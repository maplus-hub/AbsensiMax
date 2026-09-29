import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { listStaff, listTeacherAttendance } from "@/lib/school/api";
import { RoleGuard } from "@/lib/school/guard";
import { useSchool } from "@/lib/school/context";
import type { Staff, TeacherAttendance } from "@/lib/school/types";
import { daysAgoWib, downloadCsv, formatDateId, formatTimeWib, printPage, todayWib } from "@/lib/utils";

export const Route = createFileRoute("/_app/admin/rekap")({ component: Page });

function Page() {
  return (
    <RoleGuard role="admin">
      <RekapGuru />
    </RoleGuard>
  );
}

function RekapGuru() {
  const { profile } = useSchool();
  const [from, setFrom] = useState(daysAgoWib(14));
  const [to, setTo] = useState(todayWib);
  const [staffId, setStaffId] = useState("");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rows, setRows] = useState<TeacherAttendance[]>([]);

  useEffect(() => {
    void listStaff().then(setStaff).catch(() => setStaff([]));
  }, []);

  useEffect(() => {
    void listTeacherAttendance({ data: { from, to, staffId: staffId || undefined } })
      .then(setRows)
      .catch(() => setRows([]));
  }, [from, to, staffId]);

  const summary = useMemo(() => {
    const hadir = rows.filter((r) => r.status === "hadir").length;
    return { total: rows.length, hadir, pct: rows.length ? Math.round((hadir / rows.length) * 100) : 0 };
  }, [rows]);

  const download = () => {
    downloadCsv(
      `rekap-guru-${from}-${to}.csv`,
      ["Tanggal", "Nama", "Status", "Masuk", "Pulang", "Catatan"],
      rows.map((r) => [r.date, r.staffName, r.status, formatTimeWib(r.checkInAt), formatTimeWib(r.checkOutAt), r.note]),
    );
  };

  return (
    <div>
      <PageHeader
        kicker="Rekap"
        title="Absensi guru"
        desc="Filter rentang tanggal, unduh CSV, atau cetak untuk arsip sekolah."
        actions={
          <>
            <Button variant="outline" onClick={download}>
              <Download className="size-4" /> Unduh CSV
            </Button>
            <Button onClick={printPage}>
              <Printer className="size-4" /> Cetak
            </Button>
          </>
        }
      />
      <div className="no-print mb-4 grid gap-3 sm:grid-cols-3">
        <Field label="Dari">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Sampai">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Field label="Guru">
          <NativeSelect value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">Semua guru</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Card className="print-sheet mb-4">
        <p className="text-xs tracking-wide text-muted uppercase">Dokumen rekap</p>
        <h2 className="font-display mt-1 text-2xl">{profile.school.name}</h2>
        <p className="text-sm text-muted">
          Rekap absensi guru · {formatDateId(from)} — {formatDateId(to)}
        </p>
        <p className="mt-2 text-sm">
          {summary.hadir} hadir dari {summary.total} catatan ({summary.pct}%)
        </p>
      </Card>
      <div className="overflow-x-auto rounded-[24px] bg-surface shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Masuk</th>
              <th className="px-4 py-3 font-medium">Pulang</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/70">
                <td className="px-4 py-3 tabular-nums">{r.date}</td>
                <td className="px-4 py-3">{r.staffName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 tabular-nums">{formatTimeWib(r.checkInAt)}</td>
                <td className="px-4 py-3 tabular-nums">{formatTimeWib(r.checkOutAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
