import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listLeaves, reviewLeave, submitLeave } from "@/lib/school/api";
import type { LeaveRequest, LeaveType } from "@/lib/school/types";
import { formatDateId, todayWib } from "@/lib/utils";
import { LeaveBadge } from "./status-badge";
import { Button } from "./ui/button";
import { Card, CardDesc, CardTitle } from "./ui/card";
import { Field, Input, NativeSelect, Textarea } from "./ui/input";
import { EmptyState } from "./app-shell";

export function LeaveForm({ onSaved }: { onSaved?: () => void }) {
  const [type, setType] = useState<LeaveType>("izin");
  const [startDate, setStartDate] = useState(todayWib);
  const [endDate, setEndDate] = useState(todayWib);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await submitLeave({ data: { type, startDate, endDate, reason } });
      toast.success("Pengajuan terkirim");
      setReason("");
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengajukan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardTitle>Ajukan izin atau cuti</CardTitle>
      <CardDesc>Pengajuan akan ditinjau admin sebelum masuk ke rekap.</CardDesc>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Jenis">
          <NativeSelect value={type} onChange={(e) => setType(e.target.value as LeaveType)}>
            <option value="izin">Izin</option>
            <option value="cuti">Cuti</option>
          </NativeSelect>
        </Field>
        <div />
        <Field label="Mulai">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="Selesai">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
        <Field label="Alasan" className="sm:col-span-2">
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
        </Field>
      </div>
      <Button className="mt-4" disabled={busy} onClick={() => void submit()}>
        {busy ? "Mengirim…" : "Kirim pengajuan"}
      </Button>
    </Card>
  );
}

export function LeaveList({
  admin,
  refreshKey,
}: {
  admin?: boolean;
  refreshKey?: number;
}) {
  const [rows, setRows] = useState<LeaveRequest[] | null>(null);

  const load = () => {
    void listLeaves({ data: { mine: !admin } })
      .then(setRows)
      .catch(() => setRows([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, refreshKey]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    try {
      await reviewLeave({ data: { id, status } });
      toast.success(status === "approved" ? "Pengajuan disetujui" : "Pengajuan ditolak");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memproses");
    }
  };

  if (!rows) {
    return <div className="h-40 animate-pulse rounded-[24px] bg-surface-2" />;
  }
  if (rows.length === 0) {
    return (
      <EmptyState
        title="Belum ada pengajuan"
        desc={admin ? "Izin dan cuti guru akan muncul di sini." : "Ajukan izin atau cuti dari formulir di atas."}
      />
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <Card key={row.id} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{admin ? row.staffName : row.type === "cuti" ? "Cuti" : "Izin"}</p>
              <LeaveBadge status={row.status} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatDateId(row.startDate)}
              {row.endDate !== row.startDate ? ` — ${formatDateId(row.endDate)}` : ""}
            </p>
            <p className="mt-2 text-sm">{row.reason}</p>
          </div>
          {admin && row.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => void decide(row.id, "approved")}>
                Setujui
              </Button>
              <Button size="sm" variant="outline" onClick={() => void decide(row.id, "rejected")}>
                Tolak
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
