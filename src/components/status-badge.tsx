import { cn } from "@/lib/utils";
import type { AttendanceStatus, LeaveStatus } from "@/lib/school/types";
import { STATUS_LABEL } from "@/lib/school/types";

const attClass: Record<AttendanceStatus, string> = {
  hadir: "bg-hadir/12 text-hadir",
  sakit: "bg-sakit/12 text-sakit",
  izin: "bg-izin/12 text-izin",
  alpha: "bg-alpha/12 text-alpha",
  cuti: "bg-cuti/12 text-cuti",
};

const leaveClass: Record<LeaveStatus, string> = {
  pending: "bg-pending/12 text-pending",
  approved: "bg-hadir/12 text-hadir",
  rejected: "bg-alpha/12 text-alpha",
};

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium",
        attClass[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function LeaveBadge({ status }: { status: LeaveStatus }) {
  const label = { pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak" }[status];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium",
        leaveClass[status],
      )}
    >
      {label}
    </span>
  );
}
