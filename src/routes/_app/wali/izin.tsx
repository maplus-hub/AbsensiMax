import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { LeaveForm, LeaveList } from "@/components/leave-panel";
import { RoleGuard } from "@/lib/school/guard";

export const Route = createFileRoute("/_app/wali/izin")({ component: Page });

function Page() {
  return (
    <RoleGuard role="wali">
      <IzinPage />
    </RoleGuard>
  );
}

function IzinPage() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <PageHeader kicker="Pengajuan" title="Izin dan cuti" desc="Sama seperti guru, pengajuan ditinjau admin." />
      <LeaveForm onSaved={() => setKey((k) => k + 1)} />
      <LeaveList refreshKey={key} />
    </div>
  );
}
