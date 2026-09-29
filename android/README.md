# AbsensiMax Android

Native Android client for Guru and Wali Kelas accounts. It uses the shared
Supabase email/password Auth project and calls the `school-api` Edge Function;
it does not include a service-role key or mock school data.

## Open and run

1. Open the `android/` directory in Android Studio and allow Gradle sync.
2. Add the public Supabase project configuration to `android/local.properties`
   (this file is ignored by Git):

   ```properties
   ABSENSIMAX_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   ABSENSIMAX_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   ```

3. Run the `app` configuration on an Android device or emulator.

The URL and anon key are supplied as Android `BuildConfig` values from local
properties. Only the public anon key belongs here; never use a service-role
key. A signed-in session is kept in memory and is cleared when the app process
ends or the user signs out.

The login screen supports both sign-in and registration. Guru/Wali users should
register with the email the school Admin added, provide their display name,
and choose a password of at least 8 characters. If Supabase requires email
confirmation, the app shows a confirmation notice and keeps sign-in available;
after confirming, sign in with the same credentials.

Guru accounts can use teacher check-in/out, teaching schedules, attendance
rosters, and leave requests. Wali Kelas accounts can view their class, class
attendance/recap, and submit leave; accounts with both roles can use both
workflows. Admin-only accounts are rejected from the Android client.
