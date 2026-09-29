import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { RoleGuard } from "@/lib/school/guard";
import { getDashboard } from "@/lib/school/api";
import type { DashboardData } from "@/lib/school/types";
import { formatDateId } from "@/lib/utils";
import { LeaveBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/admin/")({ component: Page });

function Page() {
  return (
    <RoleGuard role="admin">
      <AdminHome />
    </RoleGuard>
  );
}

function AdminHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    void getDashboard().then(setData).catch(() => setData(null));
  }, []);
  if (!data) return <div className="h-64 animate-pulse rounded-[24px] bg-surface-2" />;
  const t = data.teacherSummary;
  const hadirPct = t.total ? Math.round((t.hadir / t.total) * 100) : 0;

  return (
    <div>
      <PageHeader
        kicker={data.profile.school.name}
        title="Ringkasan sekolah"
        desc="Kelola akun, jadwal, persetujuan izin, dan rekap kehadiran guru."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Hadir guru 14 hari" value={`${hadirPct}%`} hint={`${t.hadir} dari ${t.total} catatan`} />
        <Stat label="Izin menunggu" value={String(data.pendingLeaves)} hint="Perlu persetujuan" />
        <Stat
          label="Jam Anda hari ini"
          value={String(data.todaySchedules.length)}
          hint={formatDateId(data.today)}
        />
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Akses cepat</p>
          <div className="mt-3 grid gap-2">
            <Link className="rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium" to="/admin/akun">
              Atur akun guru & wali kelas
            </Link>
            <Link className="rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium" to="/admin/master">
              Kelas, pelajaran, dan jadwal
            </Link>
            <Link className="rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium" to="/admin/rekap">
              Cetak rekap absensi guru
            </Link>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Pengajuan terbaru</p>
          <ul className="mt-3 space-y-3">
            {data.recentLeaves.map((l) => (
              <li key={l.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{l.staffName}</p>
                  <p className="text-xs text-muted">
                    {l.type} · {l.startDate}
                  </p>
                </div>
                <LeaveBadge status={l.status} />
              </li>
            ))}
            {data.recentLeaves.length === 0 && <p className="text-sm text-muted">Belum ada pengajuan.</p>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="font-display mt-2 text-3xl tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </Card>
  );
}
