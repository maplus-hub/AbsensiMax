import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { ClockPanel } from "@/components/clock-panel";
import { Card } from "@/components/ui/card";
import { getDashboard } from "@/lib/school/api";
import { RoleGuard } from "@/lib/school/guard";
import type { DashboardData } from "@/lib/school/types";
import { DAY_NAMES, wibDayOfWeek } from "@/lib/utils";

export const Route = createFileRoute("/_app/guru/")({ component: Page });

function Page() {
  return (
    <RoleGuard role="guru">
      <GuruHome />
    </RoleGuard>
  );
}

function GuruHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const load = useCallback(() => {
    void getDashboard().then(setData);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  if (!data) return <div className="h-64 animate-pulse rounded-[24px] bg-surface-2" />;
  const day = DAY_NAMES[wibDayOfWeek()];

  return (
    <div className="space-y-4">
      <PageHeader
        kicker={`Halo, ${data.profile.staff.name.split(" ")[0]}`}
        title="Hari mengajar"
        desc={`${data.profile.school.name} · ${day}`}
      />
      <ClockPanel attendance={data.teacherToday} onChange={load} />
      <Card>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Jadwal hari ini</p>
        {data.todaySchedules.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Tidak ada jam mengajar hari ini.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.todaySchedules.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-[14px] bg-surface-2 px-3 py-3">
                <div>
                  <p className="font-medium">
                    Jam {s.period} · {s.className}
                  </p>
                  <p className="text-xs text-muted">
                    {s.subjectName} · {s.startTime}–{s.endTime}
                  </p>
                </div>
                <Link to="/guru/murid" className="text-sm font-medium text-primary">
                  Absen
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
