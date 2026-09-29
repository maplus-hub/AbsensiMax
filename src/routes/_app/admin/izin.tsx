import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { LeaveList } from "@/components/leave-panel";
import { RoleGuard } from "@/lib/school/guard";

export const Route = createFileRoute("/_app/admin/izin")({ component: Page });

function Page() {
  return (
    <RoleGuard role="admin">
      <PageHeader
        kicker="Persetujuan"
        title="Izin dan cuti guru"
        desc="Setujui atau tolak pengajuan. Jika disetujui, rekap guru menandai hari tersebut."
      />
      <LeaveList admin />
    </RoleGuard>
  );
}
