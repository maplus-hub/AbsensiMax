import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrandWord, LogoMark } from "@/components/logo";
import { AppShell } from "@/components/app-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapSession } from "@/lib/school/api";
import { SchoolContext } from "@/lib/school/context";
import { homeForRole, readStoredRole, storeRole } from "@/lib/school/role";
import type { Role, SessionProfile } from "@/lib/school/types";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [role, setRoleState] = useState<Role>("guru");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const load = useCallback(() => {
    setError(null);
    void bootstrapSession()
      .then((p) => {
        setProfile(p);
        const fromPath: Role | null = pathname.startsWith("/admin")
          ? "admin"
          : pathname.startsWith("/wali")
            ? "wali"
            : pathname.startsWith("/guru")
              ? "guru"
              : null;
        const next =
          fromPath && p.roles.includes(fromPath) ? fromPath : readStoredRole(p);
        setRoleState(next);
        storeRole(next);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat sekolah"));
  }, [pathname]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const setRole = useCallback(
    (next: Role) => {
      setRoleState(next);
      storeRole(next);
      const home = homeForRole(next);
      if (!pathname.startsWith(home)) void navigate({ to: home });
    },
    [navigate, pathname],
  );

  const ctx = useMemo(
    () => (profile ? { profile, role, setRole, reload: load } : null),
    [profile, role, setRole, load],
  );

  if (isPending) return <BootScreen label="Memeriksa sesi" />;
  if (!user) return <RedirectToSignIn />;
  if (error) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
        <div>
          <p className="font-display text-2xl">Tidak dapat membuka sekolah</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      </main>
    );
  }
  if (!ctx) return <BootScreen label="Menyiapkan sekolah" />;

  return (
    <SchoolContext.Provider value={ctx}>
      <AppShell>
        <Outlet />
      </AppShell>
    </SchoolContext.Provider>
  );
}

function BootScreen({ label }: { label: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div>
        <div className="mx-auto flex items-center justify-center gap-2 text-primary">
          <LogoMark />
          <BrandWord />
        </div>
        <p className="mt-4 text-sm text-muted">{label}…</p>
      </div>
    </main>
  );
}
