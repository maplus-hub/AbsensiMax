import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BrandWord, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const adminSite = import.meta.env.VITE_STATIC_SITE === "true";
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center gap-2 text-primary">
            <LogoMark />
            <BrandWord />
          </div>
          <p className="mt-4 text-sm text-muted">Memeriksa sesi…</p>
        </div>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  const submit = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "up") {
        const { data, error: signUpError } = await authClient.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice("Periksa email Anda untuk mengonfirmasi akun sebelum masuk.");
          return;
        }
      } else {
        const { error: signInError } = await authClient.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      window.location.href = "/";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(20,92,76,0.12),transparent)]" />
      <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-lg">
          <div className="flex items-center gap-2 text-primary">
            <LogoMark />
            <BrandWord />
          </div>
          <h1 className="font-display mt-8 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Absensi guru dan murid, rapi setiap jam pelajaran.
          </h1>
          <p className="mt-4 max-w-md text-muted">
            {adminSite
              ? "Atur akun guru, data sekolah, jadwal, persetujuan izin, dan rekap kehadiran."
              : "Masuk-pulang, izin dan cuti, absensi kelas, plus rekap yang siap dicetak. Admin mengatur sekolah; guru dan wali kelas bekerja dari genggaman."}
          </p>
          <ul className="mt-8 space-y-2 text-sm text-ink">
            <li className="rounded-[16px] bg-surface px-4 py-3 shadow-card">
              Admin — akun, jadwal, persetujuan, rekap guru
            </li>
            {!adminSite && (
              <>
                <li className="rounded-[16px] bg-surface px-4 py-3 shadow-card">
                  Guru — absen masuk/pulang dan murid di jam mengajar
                </li>
                <li className="rounded-[16px] bg-surface px-4 py-3 shadow-card">
                  Wali kelas — rekap seluruh pelajaran di kelasnya
                </li>
              </>
            )}
          </ul>
        </section>

        <section className="rounded-[28px] bg-surface p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl font-medium">Masuk AbsensiMax</h2>
          <p className="mt-1 text-sm text-muted">
            {mode === "in"
              ? "Gunakan akun admin sekolah."
              : adminSite
                ? "Buat akun admin untuk mengelola sekolah."
                : "Daftar dengan email yang dicatat admin."}
          </p>

          {!authEnabled && <p className="mt-4 text-sm text-muted">Masuk dinonaktifkan.</p>}

          <p className="mt-5 text-xs tracking-wide text-subtle uppercase">Email dan kata sandi</p>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            {mode === "up" && (
              <Field label="Nama lengkap">
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
            )}
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Field>
            <Field label="Kata sandi">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </Field>
            {error && <p className="text-sm text-alpha">{error}</p>}
            {notice && <p className="text-sm text-primary">{notice}</p>}
            <Button type="submit" className="w-full" disabled={busy || !authEnabled}>
              {busy ? "Memproses…" : mode === "in" ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </section>
      </div>
    </main>
  );
}
