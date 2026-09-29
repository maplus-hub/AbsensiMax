package id.maplushub.absensimax

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import org.json.JSONTokener
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

data class UserSession(
    val accessToken: String,
    val refreshToken: String,
    val expiresAtMillis: Long,
)

data class SignUpResult(
    val session: UserSession?,
)

class SchoolApi(
    private val projectUrl: String,
    private val anonKey: String,
) {
    @Volatile
    private var session: UserSession? = null

    val isConfigured: Boolean
        get() = projectUrl.trim().startsWith("https://") && anonKey.isNotBlank()

    suspend fun signIn(email: String, password: String): UserSession = withContext(Dispatchers.IO) {
        requireConfigured()
        val body = JSONObject().put("email", email.trim()).put("password", password)
        val response = request(
            path = "/auth/v1/token?grant_type=password",
            body = body,
        )
        val json = response as? JSONObject ?: error("Respons autentikasi tidak valid")
        createSession(json).also { session = it }
    }

    suspend fun signUp(email: String, password: String, displayName: String): SignUpResult =
        withContext(Dispatchers.IO) {
            requireConfigured()
            require(password.length >= 8) { "Kata sandi harus terdiri dari minimal 8 karakter." }
            require(displayName.isNotBlank()) { "Nama wajib diisi." }
            val body = JSONObject()
                .put("email", email.trim())
                .put("password", password)
                .put("data", JSONObject().put("name", displayName.trim()))
            val response = request(
                path = "/auth/v1/signup",
                body = body,
            ) as? JSONObject ?: error("Respons pendaftaran tidak valid")
            val access = response.optString("access_token")
            val refresh = response.optString("refresh_token")
            if (access.isBlank() || refresh.isBlank()) {
                session = null
                SignUpResult(session = null)
            } else {
                SignUpResult(createSession(response).also { session = it })
            }
        }

    suspend fun invoke(action: String, data: JSONObject = JSONObject()): Any? =
        withContext(Dispatchers.IO) {
            requireConfigured()
            var current = session ?: error("Sesi berakhir. Silakan masuk kembali.")
            if (current.expiresAtMillis <= System.currentTimeMillis() + 30_000) {
                current = refresh(current)
            }
            val body = JSONObject().put("action", action).put("data", data)
            try {
                request("/functions/v1/school-api", body, current.accessToken)
            } catch (e: HttpFailure) {
                if (e.status != HttpURLConnection.HTTP_UNAUTHORIZED) throw e
                current = refresh(current)
                request("/functions/v1/school-api", body, current.accessToken)
            }
        }

    fun signOut() {
        session = null
    }

    private suspend fun refresh(previous: UserSession): UserSession {
        val response = request(
            path = "/auth/v1/token?grant_type=refresh_token",
            body = JSONObject().put("refresh_token", previous.refreshToken),
        ) as? JSONObject ?: error("Respons pembaruan sesi tidak valid")
        return createSession(response).also { session = it }
    }

    private fun createSession(json: JSONObject): UserSession {
        val access = json.optString("access_token")
        val refresh = json.optString("refresh_token")
        if (access.isBlank() || refresh.isBlank()) {
            error(json.optString("message").ifBlank { "Gagal membuat sesi Supabase" })
        }
        val expirySeconds = json.optLong("expires_in", 3600L).coerceAtLeast(60L)
        return UserSession(access, refresh, System.currentTimeMillis() + expirySeconds * 1000)
    }

    private fun requireConfigured() {
        check(isConfigured) {
            "Konfigurasi Supabase belum tersedia. Isi ABSENSIMAX_SUPABASE_URL dan ABSENSIMAX_SUPABASE_ANON_KEY di android/local.properties."
        }
    }

    private fun request(path: String, body: JSONObject, accessToken: String? = null): Any? {
        val baseUrl = projectUrl.trim().trimEnd('/')
        val connection = (URL(baseUrl + path).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 20_000
            readTimeout = 30_000
            doOutput = true
            setRequestProperty("apikey", anonKey)
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("Accept", "application/json")
            if (accessToken != null) {
                setRequestProperty("Authorization", "Bearer $accessToken")
            }
        }
        return try {
            connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val content = stream?.use(::readFully).orEmpty()
            val parsed = if (content.isBlank()) JSONObject() else JSONTokener(content).nextValue()
            if (status !in 200..299) {
                val message = (parsed as? JSONObject)?.optString("error")
                    ?.takeIf { it.isNotBlank() }
                    ?: (parsed as? JSONObject)?.optString("message")
                    ?.takeIf { it.isNotBlank() }
                    ?: (parsed as? JSONObject)?.optString("msg")
                    ?.takeIf { it.isNotBlank() }
                    ?: (parsed as? JSONObject)?.optString("error_description")
                    ?.takeIf { it.isNotBlank() }
                    ?: "Permintaan gagal (HTTP $status)"
                throw HttpFailure(status, message)
            }
            parsed
        } catch (e: HttpFailure) {
            throw e
        } catch (e: Exception) {
            throw IllegalStateException(
                e.message?.takeIf { it.isNotBlank() } ?: "Tidak dapat terhubung ke layanan.",
                e,
            )
        } finally {
            connection.disconnect()
        }
    }

    private fun readFully(stream: InputStream): String =
        BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use { it.readText() }

    private class HttpFailure(val status: Int, message: String) : IllegalStateException(message)
}
