# AbsensiMax

Admin memakai web di GitHub Pages. Guru dan Wali Kelas memakai aplikasi
Android. Login dan data keduanya tersimpan di proyek Supabase yang sama.

## Menyiapkan layanan

Sebelum aplikasi dapat dipakai:

1. Di Supabase **SQL Editor**, jalankan file migrasi secara berurutan:
   `migrations/0001_auth.sql`, `migrations/0002_school.sql`, lalu
   `migrations/0003_supabase_auth.sql`. Data sekolah lama tidak disalin.
2. Di GitHub repo, buka **Settings → Secrets and variables → Actions** dan
   tambahkan dua *repository secrets*:
   - `SUPABASE_ACCESS_TOKEN` — token pribadi dari Supabase.
   - `SUPABASE_PROJECT_REF` — kode proyek di alamat URL Supabase.
3. Jalankan workflow **Deploy Supabase school API** dari tab **Actions**.
   Kunci service-role tetap berada di Supabase; jangan masukkan kunci itu ke
   aplikasi atau kirim lewat chat.
4. Di Supabase **Authentication → URL Configuration**, izinkan alamat
   `https://maplus-hub.github.io/AbsensiMax/` sebagai URL situs dan redirect.
   Pastikan konfirmasi email dan pengiriman email sudah dikonfigurasi.
5. Di GitHub **Settings → Pages**, pilih **GitHub Actions** sebagai sumber
   publikasi. Workflow akan menerbitkan web Admin saat ada perubahan di `main`.

Alamat web Admin:
`https://maplus-hub.github.io/AbsensiMax/`

Kunci anon Supabase di `.grok/app-env.json` memang dipakai di browser dan
bukan password database maupun kunci service-role.

## Akun dan aplikasi Android

Akun Admin pertama dibuat dari halaman web. Admin menambahkan email Guru/Wali
di menu akun; Guru/Wali lalu mendaftar di aplikasi Android dengan email yang
sama. Akun dari sistem login lama harus mendaftar ulang. Buka folder `android/`
di Android Studio untuk menjalankan aplikasi Guru/Wali. Konfigurasi Supabase
lokal Android disimpan di `android/local.properties` dan tidak masuk Git.
