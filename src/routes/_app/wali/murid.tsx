import { createFileRoute } from "@tanstack/react-router";
import { MuridAbsenPage } from "@/components/murid-absen";
import { RoleGuard } from "@/lib/school/guard";

export const Route = createFileRoute("/_app/wali/murid")({ component: Page });

function Page() {
  return (
    <RoleGuard role="wali">
      <MuridAbsenPage />
    </RoleGuard>
  );
}
