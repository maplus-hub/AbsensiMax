import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { ClockPanel } from "@/components/clock-panel";
import { Card } from "@/components/ui/card";
import { getDashboard } from "@/lib/school/api";
import { RoleGuard } from "@/lib/school/guard";
import { useSchool } from "@/lib/school/context";
import type { DashboardData } from "@/lib/school/types";

export const Route = createFileRoute("/_app/wali/")({ component: Page });

function Page() {
  return (
    <RoleGuard role="wali">
      <WaliHome />
    </RoleGuard>
  );
}

function WaliHome() {
  const { profile } = useSchool();
  const [data, setData] = useState<DashboardData | null>(null);
  const load = useCallback(() => {
    void getDashboard().then(setData);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  if (!data) return <div className="h-64 animate-pulse rounded-[24px] bg-surface-2" />;
  const c = data.classSummary;
  const pct = c && c.total ? Math.round((c.hadir / c.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Wali kelas"
        title={profile.waliClass ? `Kelas ${profile.waliClass.name}` : "Kelas Anda"}
        desc={
          profile.waliClass
            ? `${profile.waliClass.studentCount} murid · kehadiran 14 hari ${pct}%`
            : "Anda belum ditetapkan sebagai wali kelas."
        }
      />
      <ClockPanel attendance={data.teacherToday} onChange={load} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Ringkasan murid</p>
          {c ? (
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Hadir</span>
                <span className="tabular-nums">{c.hadir}</span>
              </li>
              <li className="flex justify-between">
                <span>Sakit</span>
                <span className="tabular-nums">{c.sakit}</span>
              </li>
              <li className="flex justify-between">
                <span>Izin</span>
                <span className="tabular-nums">{c.izin}</span>
              </li>
              <li className="flex justify-between">
                <span>Alpha</span>
                <span className="tabular-nums">{c.alpha}</span>
              </li>
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Belum ada data kelas.</p>
          )}
        </Card>
        <Card>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Akses cepat</p>
          <div className="mt-3 grid gap-2">
            <Link className="rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium" to="/wali/murid">
              Absensi jam mengajar
            </Link>
            <Link className="rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium" to="/wali/rekap">
              Rekap semua pelajaran
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
