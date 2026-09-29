import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getRoster, getTeachingDay, saveStudentAttendance } from "@/lib/school/api";
import type { AttendanceStatus, RosterRow, Schedule } from "@/lib/school/types";
import { STATUS_LABEL } from "@/lib/school/types";
import { DAY_NAMES, cn, todayWib } from "@/lib/utils";
import { EmptyState, PageHeader } from "./app-shell";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Field, Input, NativeSelect } from "./ui/input";

const MARKS: AttendanceStatus[] = ["hadir", "sakit", "izin", "alpha"];

const markClass: Record<AttendanceStatus, string> = {
  hadir: "border-hadir bg-hadir text-primary-fg",
  sakit: "border-sakit bg-sakit text-primary-fg",
  izin: "border-izin bg-izin text-primary-fg",
  alpha: "border-alpha bg-alpha text-primary-fg",
  cuti: "border-cuti bg-cuti text-primary-fg",
};

export function MuridAbsenPage() {
  const [date, setDate] = useState(todayWib);
  const [day, setDay] = useState<{ dayOfWeek: number; schedules: Schedule[] } | null>(null);
  const [scheduleId, setScheduleId] = useState("");
  const [roster, setRoster] = useState<RosterRow[] | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDay(null);
    setRoster(null);
    setScheduleId("");
    void getTeachingDay({ data: { date } })
      .then((res) => {
        setDay(res);
        const first = res.schedules[0]?.id ?? "";
        setScheduleId(first);
      })
      .catch(() => setDay({ dayOfWeek: 0, schedules: [] }));
  }, [date]);

  useEffect(() => {
    if (!scheduleId) {
      setRoster([]);
      return;
    }
    setRoster(null);
    void getRoster({ data: { scheduleId, date } })
      .then((rows) => {
        setRoster(rows);
        const next: Record<string, AttendanceStatus> = {};
        for (const r of rows) next[r.studentId] = r.status ?? "hadir";
        setMarks(next);
      })
      .catch(() => setRoster([]));
  }, [scheduleId, date]);

  const selected = useMemo(
    () => day?.schedules.find((s) => s.id === scheduleId) ?? null,
    [day, scheduleId],
  );

  const save = async () => {
    if (!scheduleId || !roster) return;
    setBusy(true);
    try {
      await saveStudentAttendance({
        data: {
          scheduleId,
          date,
          marks: roster.map((r) => ({ studentId: r.studentId, status: marks[r.studentId] ?? "hadir" })),
        },
      });
      toast.success("Absensi murid disimpan");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  const setAll = (status: AttendanceStatus) => {
    if (!roster) return;
    const next: Record<string, AttendanceStatus> = {};
    for (const r of roster) next[r.studentId] = status;
    setMarks(next);
  };

  return (
    <div>
      <PageHeader
        kicker="Jam mengajar"
        title="Absensi murid"
        desc="Tandai kehadiran di kelas yang Anda ampu pada jam tersebut."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="Tanggal">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Jam pelajaran">
          <NativeSelect value={scheduleId} onChange={(e) => setScheduleId(e.target.value)}>
            {(day?.schedules ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                Jam ke-{s.period} · {s.className} · {s.subjectName}
              </option>
            ))}
            {day && day.schedules.length === 0 && <option value="">Tidak ada jadwal</option>}
          </NativeSelect>
        </Field>
      </div>

      {day && day.schedules.length === 0 && (
        <EmptyState
          title={`Tidak ada jam mengajar ${DAY_NAMES[day.dayOfWeek] ?? ""}`}
          desc="Pilih hari lain, atau minta admin menambahkan jadwal pengampu."
        />
      )}

      {selected && (
        <Card className="mb-4">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Kelas yang diampu</p>
          <p className="font-display mt-1 text-2xl">
            {selected.className} · {selected.subjectName}
          </p>
          <p className="mt-1 text-sm text-muted">
            Jam ke-{selected.period} · {selected.startTime}–{selected.endTime}
          </p>
        </Card>
      )}

      {roster && roster.length > 0 && (
        <>
          <div className="no-print mb-3 flex flex-wrap gap-2">
            {MARKS.map((m) => (
              <Button key={m} size="sm" variant="outline" onClick={() => setAll(m)}>
                Semua {STATUS_LABEL[m]}
              </Button>
            ))}
            <Button className="ml-auto" disabled={busy} onClick={() => void save()}>
              {busy ? "Menyimpan…" : "Simpan absensi"}
            </Button>
          </div>
          <ul className="space-y-2">
            {roster.map((row) => (
              <li key={row.studentId} className="rounded-[18px] bg-surface p-3 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted">NIS {row.nis}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {MARKS.map((m) => {
                    const on = (marks[row.studentId] ?? "hadir") === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMarks((prev) => ({ ...prev, [row.studentId]: m }))}
                        className={cn(
                          "h-10 rounded-[10px] border text-xs font-medium",
                          on ? markClass[m] : "border-border bg-background text-muted",
                        )}
                      >
                        {STATUS_LABEL[m]}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
