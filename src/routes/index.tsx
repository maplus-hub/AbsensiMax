import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandWord, LogoMark } from "@/components/logo";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapSession } from "@/lib/school/api";
import { homeForRole, readStoredRole } from "@/lib/school/role";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void bootstrapSession()
      .then((p) => setTo(homeForRole(readStoredRole(p))))
      .catch(() => setTo("/guru"));
  }, [user]);

  if (isPending) return <Splash />;
  if (!user) return <RedirectToSignIn />;
  if (!to) return <Splash />;
  return <Navigate to={to} />;
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
