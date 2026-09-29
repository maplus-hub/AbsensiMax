import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandWord, LogoMark } from "@/components/logo";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapSession } from "@/lib/school/api";
import { homeForRole, readStoredRole } from "@/lib/school/role";
import { signOut } from "@/lib/auth/client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const [to, setTo] = useState<string | null>(null);
  const [androidOnly, setAndroidOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void bootstrapSession()
      .then((p) => {
        if (import.meta.env.VITE_STATIC_SITE === "true") {
          if (!p.staff.isAdmin) {
            setAndroidOnly(true);
            return;
          }
          setTo("/admin");
          return;
        }
        setTo(homeForRole(readStoredRole(p)));
      })
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : "Gagal membuka sekolah."),
      );
  }, [user]);

  if (isPending) return <Splash />;
  if (!user) return <RedirectToSignIn />;
  if (androidOnly) return <AndroidOnly />;
  if (error) return <SetupError message={error} />;
  if (!to) return <Splash />;
  return <Navigate to={to} />;
}

function SetupError({ message }: { message: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <p className="font-display text-2xl">Tidak dapat membuka sekolah</p>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <button
          type="button"
          className="mt-5 text-sm font-medium text-primary underline"
          onClick={() => window.location.reload()}
        >
          Coba lagi
        </button>
        <button
          type="button"
          className="ml-4 mt-5 text-sm font-medium text-primary underline"
          onClick={() => void signOut("/login")}
        >
          Keluar
        </button>
      </div>
    </main>
  );
}

function AndroidOnly() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex items-center justify-center gap-2 text-primary">
          <LogoMark />
          <BrandWord />
        </div>
        <h1 className="mt-6 font-display text-2xl">Akun Guru/Wali</h1>
        <p className="mt-2 text-sm text-muted">
          Akun Guru dan Wali Kelas menggunakan aplikasi Android AbsensiMax.
        </p>
        <button
          type="button"
          className="mt-5 text-sm font-medium text-primary underline"
          onClick={() => void signOut("/login")}
        >
          Keluar
        </button>
      </div>
    </main>
  );
}

function Splash() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div>
        <div className="mx-auto flex items-center justify-center gap-2 text-primary">
          <LogoMark />
          <BrandWord />
        </div>
        <p className="mt-4 text-sm text-muted">Menyiapkan absensi sekolah…</p>
      </div>
    </main>
  );
}
