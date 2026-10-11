package id.maplushub.absensimax

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.background
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.Shapes
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.time.ZoneId

private enum class AppTab(val title: String) {
    HOME("Beranda"),
    CLASS("Kelas"),
    RECAP("Rekap"),
    LEAVE("Izin"),
    ACCOUNT("Akun"),
}

private val attendanceStatuses = listOf("hadir", "sakit", "izin", "alpha", "cuti")

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF145C4C),
                    onPrimary = Color(0xFFF6F1E6),
                    primaryContainer = Color(0xFFD8E7DD),
                    onPrimaryContainer = Color(0xFF173D33),
                    secondary = Color(0xFF4C7569),
                    background = Color(0xFFF3EEE4),
                    onBackground = Color(0xFF1A221C),
                    surface = Color(0xFFFBF8F1),
                    onSurface = Color(0xFF1A221C),
                    surfaceVariant = Color(0xFFEFE6D6),
                    onSurfaceVariant = Color(0xFF6D6558),
                    outline = Color(0xFFDDD4C4),
                    error = Color(0xFF9B2C35),
                ),
                shapes = Shapes(
                    small = RoundedCornerShape(10.dp),
                    medium = RoundedCornerShape(18.dp),
                    large = RoundedCornerShape(24.dp),
                    extraLarge = RoundedCornerShape(28.dp),
                ),
            ) {
                AbsensiMaxApp()
            }
        }
    }
}

@Composable
@OptIn(ExperimentalMaterial3Api::class)
private fun AbsensiMaxApp() {
    val api = remember { SchoolApi(BuildConfig.SUPABASE_URL, BuildConfig.SUPABASE_ANON_KEY) }
    val scope = rememberCoroutineScope()
    var profile by remember { mutableStateOf<JSONObject?>(null) }
    var dashboard by remember { mutableStateOf<JSONObject?>(null) }
    var classes by remember { mutableStateOf(emptyList<JSONObject>()) }
    var students by remember { mutableStateOf(emptyList<JSONObject>()) }
    var schedules by remember { mutableStateOf(emptyList<JSONObject>()) }
    var teachingSchedules by remember { mutableStateOf(emptyList<JSONObject>()) }
    var roster by remember { mutableStateOf(emptyList<JSONObject>()) }
    var leaves by remember { mutableStateOf(emptyList<JSONObject>()) }
    var recap by remember { mutableStateOf(emptyList<JSONObject>()) }
    var subjects by remember { mutableStateOf(emptyList<JSONObject>()) }
    var selectedClassId by remember { mutableStateOf("") }
    var selectedScheduleId by remember { mutableStateOf("") }
    var selectedDate by remember { mutableStateOf(LocalDate.now(ZoneId.of("Asia/Jakarta")).toString()) }
    var recapFrom by remember {
        mutableStateOf(LocalDate.now(ZoneId.of("Asia/Jakarta")).withDayOfMonth(1).toString())
    }
    var recapTo by remember { mutableStateOf(LocalDate.now(ZoneId.of("Asia/Jakarta")).toString()) }
    var selectedSubjectId by remember { mutableStateOf("") }
    var leaveType by remember { mutableStateOf("izin") }
    var leaveStartDate by remember { mutableStateOf(LocalDate.now(ZoneId.of("Asia/Jakarta")).toString()) }
    var leaveEndDate by remember { mutableStateOf(LocalDate.now(ZoneId.of("Asia/Jakarta")).toString()) }
    var leaveReason by remember { mutableStateOf("") }
    val attendanceMarks = remember { mutableStateMapOf<String, String>() }
    var activeTab by remember { mutableStateOf(AppTab.HOME) }
    var busy by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    var notice by remember { mutableStateOf("") }

    fun perform(block: suspend () -> Unit) {
        scope.launch {
            busy = true
            errorMessage = ""
            notice = ""
            try {
                block()
            } catch (e: Exception) {
                errorMessage = e.message?.takeIf { it.isNotBlank() } ?: "Terjadi kesalahan. Coba lagi."
            } finally {
                busy = false
            }
        }
    }

    suspend fun loadDashboard() {
        dashboard = api.invoke("getDashboard") as? JSONObject
            ?: kotlin.error("Data beranda tidak valid")
    }

    suspend fun loadStudentsForSelection() {
        students = if (selectedClassId.isBlank()) {
            emptyList()
        } else {
            api.invoke("listStudents", JSONObject().put("classId", selectedClassId)).asObjects()
        }
    }

    suspend fun loadClassData() {
        classes = api.invoke("listClasses").asObjects()
        schedules = api.invoke("listSchedules").asObjects()
        val waliClassId = profile?.optJSONObject("waliClass")?.optString("id").orEmpty()
        if (selectedClassId.isBlank()) {
            selectedClassId = waliClassId.ifBlank { classes.firstOrNull()?.optString("id").orEmpty() }
        }
        teachingSchedules = (api.invoke(
            "getTeachingDay",
            JSONObject().put("date", selectedDate),
        ) as? JSONObject)?.optJSONArray("schedules").asObjects()
        loadStudentsForSelection()
        if (selectedScheduleId.isNotBlank() &&
            teachingSchedules.none { it.optString("id") == selectedScheduleId }
        ) {
            selectedScheduleId = ""
            roster = emptyList()
        }
    }

    suspend fun loadLeaveRequests() {
        leaves = api.invoke("listLeaves", JSONObject().put("mine", true)).asObjects()
    }

    suspend fun loadRecap() {
        val data = JSONObject()
            .put("from", recapFrom)
            .put("to", recapTo)
            .put("classId", profile?.optJSONObject("waliClass")?.optString("id").orEmpty())
        if (selectedSubjectId.isNotBlank()) data.put("subjectId", selectedSubjectId)
        recap = api.invoke("getStudentRecap", data).asObjects()
    }

    suspend fun loadRoster(scheduleId: String) {
        val rows = api.invoke(
            "getRoster",
            JSONObject().put("scheduleId", scheduleId).put("date", selectedDate),
        ).asObjects()
        roster = rows
        attendanceMarks.clear()
        rows.forEach { row ->
            attendanceMarks[row.optString("studentId")] =
                row.optString("status").ifBlank { "hadir" }
        }
        selectedScheduleId = scheduleId
    }

    suspend fun completeAuthentication() {
        val loadedProfile = api.invoke("bootstrapSession") as? JSONObject
            ?: kotlin.error("Profil akun tidak valid")
        val accountRoles = loadedProfile.optJSONArray("roles").strings()
        if ("admin" in accountRoles) {
            api.signOut()
            errorMessage = "Akun Admin hanya dapat menggunakan AbsensiMax versi web."
            return
        }
        if ("guru" !in accountRoles && "wali" !in accountRoles) {
            api.signOut()
            errorMessage = "Akun ini tidak memiliki peran Guru atau Wali Kelas."
            return
        }
        profile = loadedProfile
        val mustChangePassword = loadedProfile.optBoolean("mustChangePassword")
        dashboard = if (mustChangePassword) {
            null
        } else {
            api.invoke("getDashboard") as? JSONObject
        }
        activeTab = if (mustChangePassword) {
            AppTab.ACCOUNT
        } else {
            AppTab.HOME
        }
    }

    LaunchedEffect(activeTab, profile?.optString("userId")) {
        if (profile != null) {
            perform {
                when (activeTab) {
                    AppTab.CLASS -> loadClassData()
                    AppTab.LEAVE -> loadLeaveRequests()
                    AppTab.RECAP -> {
                        subjects = api.invoke("listSchedules").asObjects()
                            .distinctBy { it.optString("subjectId") }
                    }
                    AppTab.HOME -> Unit
                    AppTab.ACCOUNT -> Unit
                }
            }
        }
    }

    val currentProfile = profile
    if (currentProfile == null) {
        LoginScreen(
            busy = busy,
            error = errorMessage,
            configured = api.isConfigured,
            onLogin = { email, password ->
                perform {
                    api.signIn(email, password)
                    completeAuthentication()
                }
            },
        )
        return
    }

    val roles = currentProfile.optJSONArray("roles").strings()
    val isGuru = "guru" in roles
    val isWali = "wali" in roles
    val tabs = buildList {
        add(AppTab.HOME)
        add(AppTab.CLASS)
        if (isWali) add(AppTab.RECAP)
        add(AppTab.LEAVE)
        add(AppTab.ACCOUNT)
    }
    val mustChangePassword = currentProfile.optBoolean("mustChangePassword")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        AbsensiLogo(Modifier.size(38.dp))
                        Column {
                            Text("AbsensiMax", fontWeight = FontWeight.Bold)
                            Text(
                                currentProfile.optJSONObject("staff")?.optString("name").orEmpty(),
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                },
                actions = {
                    OutlinedButton(
                        onClick = {
                            api.signOut()
                            profile = null
                            dashboard = null
                            errorMessage = ""
                            notice = ""
                        },
                        enabled = !busy,
                        modifier = Modifier.padding(end = 8.dp),
                    ) { Text("Keluar") }
                },
            )
        },
        bottomBar = {
            NavigationBar {
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = activeTab == tab,
                        onClick = { activeTab = tab },
                        enabled = !mustChangePassword || tab == AppTab.ACCOUNT,
                        icon = {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .background(
                                        if (activeTab == tab) MaterialTheme.colorScheme.primaryContainer
                                        else Color.Transparent,
                                        CircleShape,
                                    )
                                    .clip(CircleShape),
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    tab.title.take(1),
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.labelMedium,
                                )
                            }
                        },
                        label = { Text(tab.title) },
                    )
                }
            }
        },
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
        ) {
            if (busy) LinearProgressIndicator(Modifier.fillMaxWidth())
            if (errorMessage.isNotBlank()) MessageCard(errorMessage, isError = true)
            if (notice.isNotBlank()) MessageCard(notice, isError = false)
            when (activeTab) {
                AppTab.HOME -> DashboardScreen(
                    profile = currentProfile,
                    dashboard = dashboard,
                    busy = busy,
                    canCheckInOut = isGuru,
                    onRefresh = { perform { loadDashboard() } },
                    onClockIn = {
                        perform {
                            api.invoke("clockIn")
                            loadDashboard()
                            notice = "Absen masuk berhasil disimpan."
                        }
                    },
                    onClockOut = {
                        perform {
                            api.invoke("clockOut")
                            loadDashboard()
                            notice = "Absen pulang berhasil disimpan."
                        }
                    },
                )
                AppTab.CLASS -> ClassScreen(
                    profile = currentProfile,
                    classes = classes,
                    students = students,
                    schedules = schedules,
                    teachingSchedules = teachingSchedules,
                    roster = roster,
                    selectedClassId = selectedClassId,
                    selectedScheduleId = selectedScheduleId,
                    selectedDate = selectedDate,
                    attendanceMarks = attendanceMarks,
                    busy = busy,
                    canMarkAttendance = "guru" in roles || "wali" in roles,
                    onDateChange = { selectedDate = it },
                    onLoadDate = {
                        perform {
                            teachingSchedules = (api.invoke(
                                "getTeachingDay",
                                JSONObject().put("date", selectedDate),
                            ) as? JSONObject)?.optJSONArray("schedules").asObjects()
                            selectedScheduleId = ""
                            roster = emptyList()
                        }
                    },
                    onClassSelect = { id ->
                        selectedClassId = id
                        selectedScheduleId = ""
                        roster = emptyList()
                        perform { loadStudentsForSelection() }
                    },
                    onScheduleSelect = { id -> perform { loadRoster(id) } },
                    onMarkChange = { id, status -> attendanceMarks[id] = status },
                    onSaveAttendance = {
                        perform {
                            val data = JSONObject()
                                .put("scheduleId", selectedScheduleId)
                                .put("date", selectedDate)
                            val marks = JSONArray()
                            roster.forEach { row ->
                                val mark = JSONObject()
                                    .put("studentId", row.optString("studentId"))
                                    .put(
                                        "status",
                                        attendanceMarks[row.optString("studentId")] ?: "hadir",
                                    )
                                val note = row.optString("note")
                                if (note.isNotBlank()) mark.put("note", note)
                                marks.put(mark)
                            }
                            data.put("marks", marks)
                            api.invoke("saveStudentAttendance", data)
                            loadRoster(selectedScheduleId)
                            notice = "Kehadiran ${marks.length()} siswa berhasil disimpan."
                        }
                    },
                )
                AppTab.RECAP -> RecapScreen(
                    profile = currentProfile,
                    rows = recap,
                    schedules = subjects,
                    from = recapFrom,
                    to = recapTo,
                    subjectId = selectedSubjectId,
                    busy = busy,
                    onFromChange = { recapFrom = it },
                    onToChange = { recapTo = it },
                    onSubjectChange = { selectedSubjectId = it },
                    onSearch = { perform { loadRecap() } },
                )
                AppTab.LEAVE -> LeaveScreen(
                    leaves = leaves,
                    busy = busy,
                    type = leaveType,
                    startDate = leaveStartDate,
                    endDate = leaveEndDate,
                    reason = leaveReason,
                    onTypeChange = { leaveType = it },
                    onStartDateChange = { leaveStartDate = it },
                    onEndDateChange = { leaveEndDate = it },
                    onReasonChange = { leaveReason = it },
                    onSubmit = { type, start, end, reason ->
                        perform {
                            api.invoke(
                                "submitLeave",
                                JSONObject()
                                    .put("type", type)
                                    .put("startDate", start)
                                    .put("endDate", end)
                                    .put("reason", reason),
                            )
                            loadLeaveRequests()
                            leaveReason = ""
                            notice = "Pengajuan izin/cuti berhasil dikirim."
                        }
                    },
                )
                AppTab.ACCOUNT -> AccountScreen(
                    profile = currentProfile,
                    busy = busy,
                    mustChangePassword = mustChangePassword,
                    onSave = { name, phone, password, onSaved ->
                        perform {
                            val data = JSONObject()
                                .put("name", name)
                                .put("phone", phone)
                            if (password.isNotBlank()) data.put("password", password)
                            api.invoke("updateOwnAccount", data)
                            val refreshedProfile = api.invoke("bootstrapSession") as? JSONObject
                                ?: kotlin.error("Profil akun tidak valid")
                            profile = refreshedProfile
                            if (!refreshedProfile.optBoolean("mustChangePassword")) {
                                activeTab = AppTab.HOME
                            }
                            notice = if (password.isNotBlank()) {
                                "Data akun dan kata sandi berhasil diperbarui."
                            } else {
                                "Data akun berhasil diperbarui."
                            }
                            onSaved()
                        }
                    },
                )
            }
        }
    }
}

@Composable
private fun LoginScreen(
    busy: Boolean,
    error: String,
    configured: Boolean,
    onLogin: (String, String) -> Unit,
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 36.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 480.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                AbsensiLogo(Modifier.size(68.dp))
                Spacer(Modifier.height(16.dp))
                Text(
                    "AbsensiMax",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(
                    "Kehadiran sekolah, lebih tertata.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(28.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(28.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                    ) {
                        Text(
                            "Selamat datang",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                        )
                        Text(
                            "Masuk dengan akun Guru atau Wali Kelas yang dibuat oleh Admin.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        if (!configured) {
                            MessageCard(
                                "Konfigurasi Supabase belum tersedia. Lengkapi pengaturan aplikasi terlebih dahulu.",
                                isError = true,
                            )
                        }
                        if (error.isNotBlank()) MessageCard(error, isError = true)
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            label = { Text("Email") },
                            singleLine = true,
                            enabled = !busy,
                            modifier = Modifier.fillMaxWidth(),
                        )
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            label = { Text("Kata sandi") },
                            singleLine = true,
                            enabled = !busy,
                            visualTransformation = PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth(),
                        )
                        Button(
                            onClick = { onLogin(email.trim(), password) },
                            enabled = !busy && configured && email.isNotBlank() && password.isNotBlank(),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp),
                        ) {
                            if (busy) {
                                CircularProgressIndicator(
                                    Modifier.size(20.dp),
                                    strokeWidth = 2.dp,
                                    color = MaterialTheme.colorScheme.onPrimary,
                                )
                            } else {
                                Text("Masuk", fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
                Spacer(Modifier.height(18.dp))
                Text(
                    "Belum memiliki akses? Hubungi Admin sekolah.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun AbsensiLogo(modifier: Modifier = Modifier) {
    Image(
        painter = painterResource(R.drawable.ic_launcher),
        contentDescription = "Logo AbsensiMax",
        modifier = modifier.clip(CircleShape),
    )
}

@Composable
private fun AccountScreen(
    profile: JSONObject,
    busy: Boolean,
    mustChangePassword: Boolean,
    onSave: (String, String, String, () -> Unit) -> Unit,
) {
    val staff = profile.optJSONObject("staff")
    var name by remember(profile.optString("userId")) {
        mutableStateOf(staff?.optString("name").orEmpty())
    }
    var phone by remember(profile.optString("userId")) {
        mutableStateOf(staff?.optString("phone").orEmpty().takeUnless { it == "null" }.orEmpty())
    }
    var password by remember { mutableStateOf("") }
    var confirmation by remember { mutableStateOf("") }
    val passwordValid = password.isBlank() && confirmation.isBlank() ||
        (password.length >= 8 && password == confirmation)

    ContentColumn {
        SectionTitle("Pengaturan akun")
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                AbsensiLogo(Modifier.size(52.dp))
                Column {
                    Text(name.ifBlank { "Akun staf" }, fontWeight = FontWeight.Bold)
                    Text(
                        profile.optJSONArray("roles").strings().joinToString(" · ") { it.roleTitle() },
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
        if (mustChangePassword) {
            MessageCard(
                "Kata sandi awal Anda adalah AbsensiMax. Demi keamanan, buat kata sandi pribadi sebelum menggunakan aplikasi.",
                isError = false,
            )
        }
        SectionTitle("Data profil")
        InfoCard(
            "Email masuk",
            staff?.optString("email").orEmpty().ifBlank { "Email tidak tersedia" },
        )
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Nama lengkap") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Nomor telepon") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        SectionTitle("Ganti kata sandi")
        Text(
            "Kosongkan jika tidak ingin mengganti kata sandi.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Kata sandi baru") },
            supportingText = { Text("Minimal 8 karakter") },
            singleLine = true,
            enabled = !busy,
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = confirmation,
            onValueChange = { confirmation = it },
            label = { Text("Ulangi kata sandi baru") },
            singleLine = true,
            enabled = !busy,
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
        )
        if (!passwordValid) {
            Text(
                "Kata sandi minimal 8 karakter dan harus sama pada kedua kolom.",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
            )
        }
        Button(
            onClick = {
                onSave(name.trim(), phone.trim(), password) {
                    password = ""
                    confirmation = ""
                }
            },
            enabled = !busy && name.isNotBlank() && passwordValid &&
                (!mustChangePassword || password.length >= 8),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
        ) {
            Text("Simpan perubahan", fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun DashboardScreen(
    profile: JSONObject,
    dashboard: JSONObject?,
    busy: Boolean,
    canCheckInOut: Boolean,
    onRefresh: () -> Unit,
    onClockIn: () -> Unit,
    onClockOut: () -> Unit,
) {
    val staff = profile.optJSONObject("staff")
    val school = profile.optJSONObject("school")
    val teacherToday = dashboard?.optJSONObject("teacherToday")
    val schedules = dashboard?.optJSONArray("todaySchedules").asObjects()
    val leaves = dashboard?.optJSONArray("recentLeaves").asObjects()
    ContentColumn {
        SectionTitle("Ringkasan sekolah")
        InfoCard(
            title = school?.optString("name").orEmpty().ifBlank { "Sekolah" },
            detail = listOfNotNull(
                staff?.optString("name")?.takeIf { it.isNotBlank() },
                profile.optJSONArray("roles").strings().joinToString(" · ") { it.roleTitle() },
            ).joinToString(" • "),
        )
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            MetricCard("Tanggal", dashboard?.optString("today").orEmpty().ifBlank { "—" }, Modifier.weight(1f))
            MetricCard("Pengajuan menunggu", dashboard?.optInt("pendingLeaves", 0)?.toString() ?: "0", Modifier.weight(1f))
        }
        SectionTitle("Absensi guru")
        InfoCard(
            title = if (teacherToday == null || teacherToday.isNull("checkInAt")) "Belum absen masuk" else "Sudah absen masuk",
            detail = "Masuk: ${teacherToday?.nullableText("checkInAt") ?: "—"}\nPulang: ${teacherToday?.nullableText("checkOutAt") ?: "—"}",
        )
        if (canCheckInOut) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = onClockIn,
                    enabled = !busy && (teacherToday == null || teacherToday.isNull("checkInAt")),
                    modifier = Modifier.weight(1f),
                ) { Text("Absen masuk") }
                OutlinedButton(
                    onClick = onClockOut,
                    enabled = !busy && teacherToday != null &&
                        !teacherToday.isNull("checkInAt") && teacherToday.isNull("checkOutAt"),
                    modifier = Modifier.weight(1f),
                ) { Text("Absen pulang") }
            }
        }
        SectionTitle("Jadwal hari ini")
        if (schedules.isEmpty()) EmptyState("Belum ada jadwal mengajar hari ini.")
        schedules.forEach { schedule ->
            InfoCard(
                schedule.optString("subjectName").ifBlank { "Mata pelajaran" },
                "${schedule.optString("className")} • ${schedule.optString("startTime")}–${schedule.optString("endTime")} • Jam ke-${schedule.optInt("period")}",
            )
        }
        SectionTitle("Pengajuan terbaru")
        if (leaves.isEmpty()) EmptyState("Belum ada pengajuan terbaru.")
        leaves.forEach { leave ->
            InfoCard(
                "${leave.optString("staffName")} • ${leave.optString("type").uppercase()}",
                "${leave.optString("startDate")} – ${leave.optString("endDate")} • ${leave.optString("status").statusTitle()}\n${leave.optString("reason")}",
            )
        }
        OutlinedButton(onClick = onRefresh, enabled = !busy, modifier = Modifier.fillMaxWidth()) {
            Text("Perbarui ringkasan")
        }
    }
}

@Composable
private fun ClassScreen(
    profile: JSONObject,
    classes: List<JSONObject>,
    students: List<JSONObject>,
    schedules: List<JSONObject>,
    teachingSchedules: List<JSONObject>,
    roster: List<JSONObject>,
    selectedClassId: String,
    selectedScheduleId: String,
    selectedDate: String,
    attendanceMarks: Map<String, String>,
    busy: Boolean,
    canMarkAttendance: Boolean,
    onDateChange: (String) -> Unit,
    onLoadDate: () -> Unit,
    onClassSelect: (String) -> Unit,
    onScheduleSelect: (String) -> Unit,
    onMarkChange: (String, String) -> Unit,
    onSaveAttendance: () -> Unit,
) {
    val waliClassId = profile.optJSONObject("waliClass")?.optString("id").orEmpty()
    val visibleClasses = if (waliClassId.isNotBlank()) {
        classes.filter { it.optString("id") == waliClassId }
    } else {
        classes
    }
    val staffId = profile.optJSONObject("staff")?.optString("id").orEmpty()
    val classSchedules = teachingSchedules.filter { schedule ->
        schedule.optString("teacherStaffId") == staffId &&
            (waliClassId.isBlank() || schedule.optString("classId") == waliClassId) &&
            (selectedClassId.isBlank() || schedule.optString("classId") == selectedClassId)
    }
    ContentColumn {
        SectionTitle("Kelas dan kehadiran")
        Text(
            if (waliClassId.isBlank()) "Pilih kelas untuk melihat daftar siswa dan jadwal mengajar Anda."
            else "Data kelas wali hanya menampilkan kelas yang menjadi tanggung jawab Anda.",
            style = MaterialTheme.typography.bodyMedium,
        )
        visibleClasses.forEach { schoolClass ->
            val id = schoolClass.optString("id")
            FilterChip(
                selected = selectedClassId == id,
                onClick = { onClassSelect(id) },
                label = {
                    Text("${schoolClass.optString("name")} • ${schoolClass.optInt("studentCount")} siswa")
                },
            )
        }
        SectionTitle("Daftar siswa")
        if (students.isEmpty()) EmptyState("Tidak ada siswa untuk kelas ini.")
        students.forEach { student ->
            InfoCard(
                student.optString("name"),
                "NIS ${student.optString("nis")} • ${if (student.optString("gender") == "L") "Laki-laki" else "Perempuan"}",
            )
        }
        SectionTitle("Jadwal dan absensi")
        OutlinedTextField(
            value = selectedDate,
            onValueChange = onDateChange,
            label = { Text("Tanggal (YYYY-MM-DD)") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedButton(
            onClick = onLoadDate,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        ) { Text("Tampilkan jadwal tanggal ini") }
        if (schedules.isEmpty()) {
            EmptyState("Tidak ada jadwal mengajar pada tanggal ini.")
        } else if (classSchedules.isEmpty()) {
            EmptyState("Tidak ada jadwal Anda untuk kelas/tanggal ini.")
        }
        classSchedules.forEach { schedule ->
            OutlinedButton(
                onClick = { onScheduleSelect(schedule.optString("id")) },
                enabled = !busy,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(
                    "${schedule.optString("subjectName")} • ${schedule.optString("className")} • " +
                        "${schedule.optString("startTime")} • Jam ${schedule.optInt("period")}",
                )
            }
        }
        if (selectedScheduleId.isNotBlank()) {
            SectionTitle("Presensi siswa")
            Text("Tanggal $selectedDate", style = MaterialTheme.typography.bodySmall)
            if (roster.isEmpty()) EmptyState("Belum ada siswa pada daftar presensi.")
            roster.forEach { student ->
                AttendanceRow(
                    student = student,
                    status = attendanceMarks[student.optString("studentId")] ?: "hadir",
                    enabled = !busy && canMarkAttendance,
                    onStatusChange = { onMarkChange(student.optString("studentId"), it) },
                )
            }
            if (canMarkAttendance && roster.isNotEmpty()) {
                Button(
                    onClick = onSaveAttendance,
                    enabled = !busy,
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Simpan kehadiran") }
            }
        }
    }
}

@Composable
private fun AttendanceRow(
    student: JSONObject,
    status: String,
    enabled: Boolean,
    onStatusChange: (String) -> Unit,
) {
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(14.dp)) {
            Text(student.optString("name"), fontWeight = FontWeight.SemiBold)
            Text("NIS ${student.optString("nis")}", style = MaterialTheme.typography.bodySmall)
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                attendanceStatuses.forEach { choice ->
                    FilterChip(
                        selected = status == choice,
                        onClick = { onStatusChange(choice) },
                        enabled = enabled,
                        label = { Text(choice.statusTitle()) },
                    )
                }
            }
        }
    }
}

@Composable
private fun RecapScreen(
    profile: JSONObject,
    rows: List<JSONObject>,
    schedules: List<JSONObject>,
    from: String,
    to: String,
    subjectId: String,
    busy: Boolean,
    onFromChange: (String) -> Unit,
    onToChange: (String) -> Unit,
    onSubjectChange: (String) -> Unit,
    onSearch: () -> Unit,
) {
    val waliClass = profile.optJSONObject("waliClass")
    ContentColumn {
        SectionTitle("Rekap kehadiran kelas")
        InfoCard(
            waliClass?.optString("name").orEmpty().ifBlank { "Kelas wali" },
            "${waliClass?.optInt("studentCount") ?: 0} siswa",
        )
        OutlinedTextField(
            value = from,
            onValueChange = onFromChange,
            label = { Text("Dari (YYYY-MM-DD)") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = to,
            onValueChange = onToChange,
            label = { Text("Sampai (YYYY-MM-DD)") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        FilterChip(
            selected = subjectId.isBlank(),
            onClick = { onSubjectChange("") },
            label = { Text("Semua mata pelajaran") },
        )
        schedules.forEach { schedule ->
            val id = schedule.optString("subjectId")
            if (id.isNotBlank()) {
                FilterChip(
                    selected = subjectId == id,
                    onClick = { onSubjectChange(id) },
                    enabled = !busy,
                    label = { Text(schedule.optString("subjectName")) },
                )
            }
        }
        Button(onClick = onSearch, enabled = !busy, modifier = Modifier.fillMaxWidth()) {
            Text("Tampilkan rekap")
        }
        SectionTitle("Hasil")
        if (rows.isEmpty()) EmptyState("Atur rentang tanggal lalu tampilkan rekap.")
        rows.forEach { row ->
            InfoCard(
                "${row.optString("studentName")} • ${row.optString("percent")}% hadir",
                "NIS ${row.optString("nis")} • ${row.optString("subjectName")}\n" +
                    "Hadir ${row.optInt("hadir")} · Sakit ${row.optInt("sakit")} · " +
                    "Izin ${row.optInt("izin")} · Alpha ${row.optInt("alpha")} · " +
                    "Total ${row.optInt("total")}",
            )
        }
    }
}

@Composable
private fun LeaveScreen(
    leaves: List<JSONObject>,
    busy: Boolean,
    type: String,
    startDate: String,
    endDate: String,
    reason: String,
    onTypeChange: (String) -> Unit,
    onStartDateChange: (String) -> Unit,
    onEndDateChange: (String) -> Unit,
    onReasonChange: (String) -> Unit,
    onSubmit: (String, String, String, String) -> Unit,
) {
    ContentColumn {
        SectionTitle("Ajukan izin atau cuti")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("izin", "cuti").forEach { item ->
                FilterChip(
                    selected = type == item,
                    onClick = { onTypeChange(item) },
                    enabled = !busy,
                    label = { Text(item.replaceFirstChar(Char::uppercase)) },
                )
            }
        }
        OutlinedTextField(
            value = startDate,
            onValueChange = onStartDateChange,
            label = { Text("Tanggal mulai (YYYY-MM-DD)") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = endDate,
            onValueChange = onEndDateChange,
            label = { Text("Tanggal selesai (YYYY-MM-DD)") },
            singleLine = true,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = reason,
            onValueChange = onReasonChange,
            label = { Text("Alasan") },
            minLines = 3,
            enabled = !busy,
            modifier = Modifier.fillMaxWidth(),
        )
        Button(
            onClick = { onSubmit(type, startDate, endDate, reason) },
            enabled = !busy && startDate.isNotBlank() && endDate.isNotBlank() && reason.isNotBlank(),
            modifier = Modifier.fillMaxWidth(),
        ) { Text("Kirim pengajuan") }
        SectionTitle("Riwayat pengajuan")
        if (leaves.isEmpty()) EmptyState("Belum ada pengajuan.")
        leaves.forEach { leave ->
            InfoCard(
                "${leave.optString("type").uppercase()} • ${leave.optString("status").statusTitle()}",
                "${leave.optString("startDate")} – ${leave.optString("endDate")}\n${leave.optString("reason")}",
            )
        }
    }
}

@Composable
private fun ContentColumn(content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        content = { content() },
    )
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(top = 8.dp),
    )
}

@Composable
private fun InfoCard(title: String, detail: String) {
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text(title, fontWeight = FontWeight.SemiBold)
            if (detail.isNotBlank()) {
                Text(detail, style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}

@Composable
private fun MetricCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier) {
        Column(Modifier.padding(14.dp)) {
            Text(label, style = MaterialTheme.typography.labelMedium)
            Spacer(Modifier.height(4.dp))
            Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun MessageCard(text: String, isError: Boolean) {
    Card(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
    ) {
        Text(
            text,
            modifier = Modifier.padding(14.dp),
            color = if (isError) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.bodyMedium,
        )
    }
}

@Composable
private fun EmptyState(text: String) {
    Text(
        text,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        style = MaterialTheme.typography.bodyMedium,
    )
}

private fun Any?.asObjects(): List<JSONObject> = when (this) {
    is JSONArray -> (0 until length()).mapNotNull { optJSONObject(it) }
    is JSONObject -> (0 until optJSONArray("data").orEmpty().length())
        .mapNotNull { optJSONArray("data")?.optJSONObject(it) }
    else -> emptyList()
}

private fun JSONArray?.strings(): List<String> =
    this?.let { array -> (0 until array.length()).mapNotNull { array.optString(it).takeIf(String::isNotBlank) } }
        ?: emptyList()

private fun JSONArray?.orEmpty(): JSONArray = this ?: JSONArray()

private fun JSONObject.nullableText(key: String): String =
    if (isNull(key)) "—" else optString(key).replace('T', ' ').take(16)

private fun String.statusTitle(): String = when (this) {
    "pending" -> "Menunggu"
    "approved" -> "Disetujui"
    "rejected" -> "Ditolak"
    else -> replaceFirstChar(Char::uppercase)
}

private fun String.roleTitle(): String = when (this) {
    "guru" -> "Guru"
    "wali" -> "Wali Kelas"
    "admin" -> "Admin"
    else -> this
}
