import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  Home,
  LogOut,
  School,
  UserRound,
  Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useSchool } from "@/lib/school/context";
import { homeForRole } from "@/lib/school/role";
import { ROLE_LABEL, type Role } from "@/lib/school/types";
import { cn, initials } from "@/lib/utils";
import { BrandWord, LogoMark } from "./logo";

type NavItem = { to: string; label: string; icon: typeof Home };

function navFor(role: Role): NavItem[] {
  if (role === "admin") {
    return [
      { to: "/admin", label: "Beranda", icon: Home },
      { to: "/admin/akun", label: "Akun guru", icon: Users },
      { to: "/admin/master", label: "Master data", icon: School },
      { to: "/admin/izin", label: "Izin & cuti", icon: ClipboardCheck },
      { to: "/admin/rekap", label: "Rekap guru", icon: FileSpreadsheet },
    ];
  }
  if (role === "wali") {
    return [
      { to: "/wali", label: "Beranda", icon: Home },
      { to: "/wali/murid", label: "Absen murid", icon: BookOpen },
      { to: "/wali/rekap", label: "Rekap kelas", icon: FileSpreadsheet },
      { to: "/wali/izin", label: "Izin / cuti", icon: CalendarDays },
    ];
  }
  return [
    { to: "/guru", label: "Beranda", icon: Home },
    { to: "/guru/murid", label: "Absen murid", icon: BookOpen },
    { to: "/guru/izin", label: "Izin / cuti", icon: CalendarDays },
  ];
}

function isActive(pathname: string, to: string) {
  if (to === "/admin" || to === "/guru" || to === "/wali") return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, role, setRole } = useSchool();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navFor(role);
  const user = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-ink">
      <header className="no-print sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link to={homeForRole(role)} className="flex items-center gap-2 text-primary">
            <LogoMark className="size-8" />
            <BrandWord className="hidden sm:inline" />
          </Link>
          <p className="hidden min-w-0 flex-1 truncate text-sm text-muted md:block">
            {profile.school.name}
          </p>
          <div className="ml-auto flex items-center gap-2">
            {import.meta.env.VITE_STATIC_SITE !== "true" && profile.roles.length > 1 && (
              <select
                aria-label="Pilih peran"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="h-10 max-w-[9.5rem] rounded-[12px] border border-border bg-surface px-2 text-xs font-medium"
              >
                {profile.roles.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
            )}
            <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-fg">
              {initials(profile.staff.name)}
            </span>
            <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:block">
              {profile.staff.name}
            </span>
            {user && (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  void signOut("/login").catch(() => setSigningOut(false));
                }}
                className="grid size-10 place-items-center rounded-[12px] text-muted hover:bg-surface-2"
                aria-label="Keluar"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto flex max-w-6xl",
          role === "admin" ? "md:grid md:grid-cols-[220px_1fr]" : "flex-col",
        )}
      >
        {role === "admin" ? (
          <aside className="no-print hidden border-r border-border/80 p-3 md:block">
            <nav className="sticky top-20 flex flex-col gap-1">
              {items.map((item) => (
                <NavLink key={item.to} item={item} active={isActive(pathname, item.to)} />
              ))}
            </nav>
          </aside>
        ) : (
          <nav className="no-print hidden px-4 pt-4 md:block">
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-[14px] px-4 text-sm font-medium",
                      isActive(pathname, item.to)
                        ? "bg-primary text-primary-fg"
                        : "bg-surface text-ink shadow-card",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <main className="min-w-0 flex-1 px-4 pt-5 pb-28 md:pb-10">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="mx-auto grid max-w-lg grid-flow-col">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "flex h-11 items-center gap-2 rounded-[14px] px-3 text-sm font-medium",
        active ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

export function PageHeader({
  kicker,
  title,
  desc,
  actions,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && (
          <p className="mb-1 text-xs font-medium tracking-[0.14em] text-muted uppercase">
            {kicker}
          </p>
        )}
        <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
        {desc && <p className="mt-1 max-w-xl text-sm text-muted">{desc}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon = UserRound,
  title,
  desc,
}: {
  icon?: typeof UserRound;
  title: string;
  desc: string;
}) {
  return (
    <div className="grid place-items-center rounded-[24px] bg-surface px-6 py-14 text-center shadow-card">
      <Icon className="mb-3 size-8 text-subtle" />
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{desc}</p>
    </div>
  );
}
