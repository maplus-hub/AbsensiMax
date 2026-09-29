import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { getStudentRecap, listSubjects } from "@/lib/school/api";
import { useSchool } from "@/lib/school/context";
import { RoleGuard } from "@/lib/school/guard";
import type { StudentRecapRow, Subject } from "@/lib/school/types";
import { daysAgoWib, downloadCsv, formatDateId, printPage, todayWib } from "@/lib/utils";

export const Route = createFileRoute("/_app/wali/rekap")({ component: Page });

function Page() {
  return (
    <RoleGuard role="wali">
      <RekapKelas />
    </RoleGuard>
  );
}

function RekapKelas() {
  const { profile } = useSchool();
  const [from, setFrom] = useState(daysAgoWib(14));
  const [to, setTo] = useState(todayWib);
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rows, setRows] = useState<StudentRecapRow[]>([]);

  useEffect(() => {
    void listSubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (!profile.waliClass) return;
    void getStudentRecap({
      data: { from, to, subjectId: subjectId || undefined, classId: profile.waliClass.id },
    })
      .then(setRows)
      .catch(() => setRows([]));
  }, [from, to, subjectId, profile.waliClass]);

  const grouped = useMemo(() => {
    const map = new Map<string, StudentRecapRow[]>();
    for (const r of rows) {
      const list = map.get(r.studentId) ?? [];
      list.push(r);
      map.set(r.studentId, list);
    }
    return [...map.values()];
  }, [rows]);

  const download = () => {
    downloadCsv(
      `rekap-kelas-${profile.waliClass?.name ?? "kelas"}-${from}-${to}.csv`,
      ["NIS", "Nama", "Pelajaran", "Hadir", "Sakit", "Izin", "Alpha", "Total", "% Hadir"],
      rows.map((r) => [r.nis, r.studentName, r.subjectName, r.hadir, r.sakit, r.izin, r.alpha, r.total, r.percent]),
    );
  };

  return (
    <div>
      <PageHeader
        kicker={`Kelas ${profile.waliClass?.name ?? ""}`}
        title="Rekap absensi murid"
        desc="Semua pelajaran di kelas ini, bisa disaring per mapel, dicetak, dan diunduh."
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
        <Field label="Pelajaran">
          <NativeSelect value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Semua pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Card className="mb-4">
        <p className="text-xs tracking-wide text-muted uppercase">Dokumen rekap</p>
        <h2 className="font-display mt-1 text-2xl">{profile.school.name}</h2>
        <p className="text-sm text-muted">
          Kelas {profile.waliClass?.name} · {formatDateId(from)} — {formatDateId(to)}
        </p>
      </Card>
      <div className="overflow-x-auto rounded-[24px] bg-surface shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Murid</th>
              <th className="px-4 py-3 font-medium">Pelajaran</th>
              <th className="px-4 py-3 font-medium">H</th>
              <th className="px-4 py-3 font-medium">S</th>
              <th className="px-4 py-3 font-medium">I</th>
              <th className="px-4 py-3 font-medium">A</th>
              <th className="px-4 py-3 font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {grouped.flatMap((group) =>
              group.map((r, i) => (
                <tr key={`${r.studentId}-${r.subjectName}`} className="border-b border-border/70">
                  <td className="px-4 py-3">{i === 0 ? r.studentName : ""}</td>
                  <td className="px-4 py-3">{r.subjectName}</td>
                  <td className="px-4 py-3 tabular-nums">{r.hadir}</td>
                  <td className="px-4 py-3 tabular-nums">{r.sakit}</td>
                  <td className="px-4 py-3 tabular-nums">{r.izin}</td>
                  <td className="px-4 py-3 tabular-nums">{r.alpha}</td>
                  <td className="px-4 py-3 tabular-nums">{r.percent}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
