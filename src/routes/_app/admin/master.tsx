import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import {
  deleteClass,
  deleteSchedule,
  deleteStudent,
  deleteSubject,
  listClasses,
  listSchedules,
  listStaff,
  listStudents,
  listSubjects,
  upsertClass,
  upsertSchedule,
  upsertStudent,
  upsertSubject,
} from "@/lib/school/api";
import { RoleGuard } from "@/lib/school/guard";
import type { Schedule, SchoolClass, Staff, Student, Subject } from "@/lib/school/types";
import { DAY_NAMES, cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/admin/master")({ component: Page });

function Page() {
  return (
    <RoleGuard role="admin">
      <MasterPage />
    </RoleGuard>
  );
}

type Tab = "kelas" | "pelajaran" | "jadwal" | "murid";

function MasterPage() {
  const [tab, setTab] = useState<Tab>("kelas");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const load = () => {
    void Promise.all([listClasses(), listSubjects(), listStaff(), listSchedules(), listStudents({ data: {} })]).then(
      ([c, s, st, sch, mu]) => {
        setClasses(c);
        setSubjects(s);
        setStaff(st);
        setSchedules(sch);
        setStudents(mu);
      },
    );
  };
  useEffect(load, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "kelas", label: "Kelas" },
    { id: "pelajaran", label: "Pelajaran" },
    { id: "jadwal", label: "Jadwal" },
    { id: "murid", label: "Murid" },
  ];

  return (
    <div>
      <PageHeader
        kicker="Master data"
        title="Kelas, pelajaran, jadwal"
        desc="Atur struktur sekolah dan pengampu setiap jam pelajaran."
      />
      <div className="no-print mb-4 flex gap-1 overflow-x-auto rounded-[16px] bg-surface p-1 shadow-card">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-10 shrink-0 rounded-[12px] px-4 text-sm font-medium",
              tab === t.id ? "bg-primary text-primary-fg" : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "kelas" && <KelasTab rows={classes} staff={staff} onChange={load} />}
      {tab === "pelajaran" && <PelajaranTab rows={subjects} onChange={load} />}
      {tab === "jadwal" && (
        <JadwalTab rows={schedules} classes={classes} subjects={subjects} staff={staff} onChange={load} />
      )}
      {tab === "murid" && <MuridTab rows={students} classes={classes} onChange={load} />}
    </div>
  );
}

function KelasTab({
  rows,
  staff,
  onChange,
}: {
  rows: SchoolClass[];
  staff: Staff[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(7);
  const [waliStaffId, setWaliStaffId] = useState("");

  const start = (row?: SchoolClass) => {
    setEditing(row ?? null);
    setName(row?.name ?? "");
    setGrade(row?.grade ?? 7);
    setWaliStaffId(row?.waliStaffId ?? "");
    setOpen(true);
  };

  return (
    <div>
      <Button className="mb-3" onClick={() => start()}>
        Tambah kelas
      </Button>
      <div className="space-y-2">
        {rows.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                {c.name} · tingkat {c.grade}
              </p>
              <p className="text-sm text-muted">
                Wali {c.waliName ?? "—"} · {c.studentCount} murid
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => start(c)}>
                Ubah
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  void deleteClass({ data: { id: c.id } }).then(() => {
                    toast.success("Kelas dihapus");
                    onChange();
                  })
                }
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? "Ubah kelas" : "Kelas baru"}>
          <div className="space-y-3">
            <Field label="Nama (contoh 7A)">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Tingkat">
              <NativeSelect value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                {[7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Wali kelas">
              <NativeSelect value={waliStaffId} onChange={(e) => setWaliStaffId(e.target.value)}>
                <option value="">—</option>
                {staff.filter((s) => s.isWali || s.isGuru).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Button
              className="w-full"
              onClick={() =>
                void upsertClass({
                  data: { id: editing?.id, name, grade, waliStaffId: waliStaffId || null },
                }).then(() => {
                  toast.success("Kelas disimpan");
                  setOpen(false);
                  onChange();
                })
              }
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PelajaranTab({ rows, onChange }: { rows: Subject[]; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const start = (row?: Subject) => {
    setEditing(row ?? null);
    setName(row?.name ?? "");
    setCode(row?.code ?? "");
    setOpen(true);
  };
  return (
    <div>
      <Button className="mb-3" onClick={() => start()}>
        Tambah pelajaran
      </Button>
      <div className="space-y-2">
        {rows.map((s) => (
          <Card key={s.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted">{s.code}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => start(s)}>
                Ubah
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  void deleteSubject({ data: { id: s.id } }).then(() => {
                    toast.success("Pelajaran dihapus");
                    onChange();
                  })
                }
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? "Ubah pelajaran" : "Pelajaran baru"}>
          <div className="space-y-3">
            <Field label="Nama">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Kode">
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Button
              className="w-full"
              onClick={() =>
                void upsertSubject({ data: { id: editing?.id, name, code } }).then(() => {
                  toast.success("Pelajaran disimpan");
                  setOpen(false);
                  onChange();
                })
              }
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: "07:00", end: "07:40" },
  2: { start: "07:40", end: "08:20" },
  3: { start: "08:20", end: "09:00" },
  4: { start: "09:20", end: "10:00" },
  5: { start: "10:00", end: "10:40" },
  6: { start: "10:40", end: "11:20" },
};

function JadwalTab({
  rows,
  classes,
  subjects,
  staff,
  onChange,
}: {
  rows: Schedule[];
  classes: SchoolClass[];
  subjects: Subject[];
  staff: Staff[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherStaffId, setTeacherStaffId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [period, setPeriod] = useState(1);

  const start = (row?: Schedule) => {
    setEditing(row ?? null);
    setClassId(row?.classId ?? classes[0]?.id ?? "");
    setSubjectId(row?.subjectId ?? subjects[0]?.id ?? "");
    setTeacherStaffId(row?.teacherStaffId ?? staff[0]?.id ?? "");
    setDayOfWeek(row?.dayOfWeek ?? 1);
    setPeriod(row?.period ?? 1);
    setOpen(true);
  };

  const grouped = [1, 2, 3, 4, 5].map((d) => ({
    day: d,
    items: rows.filter((r) => r.dayOfWeek === d),
  }));

  return (
    <div>
      <Button className="mb-3" onClick={() => start()}>
        Tambah jadwal
      </Button>
      <div className="space-y-6">
        {grouped.map((g) => (
          <section key={g.day}>
            <h2 className="mb-2 font-display text-lg">{DAY_NAMES[g.day]}</h2>
            <div className="space-y-2">
              {g.items.map((s) => (
                <Card key={s.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      Jam {s.period} · {s.className} · {s.subjectName}
                    </p>
                    <p className="text-sm text-muted">
                      {s.startTime}–{s.endTime} · {s.teacherName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => start(s)}>
                      Ubah
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        void deleteSchedule({ data: { id: s.id } }).then(() => {
                          toast.success("Jadwal dihapus");
                          onChange();
                        })
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? "Ubah jadwal" : "Jadwal baru"}>
          <div className="grid gap-3">
            <Field label="Kelas">
              <NativeSelect value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Pelajaran">
              <NativeSelect value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Pengampu">
              <NativeSelect value={teacherStaffId} onChange={(e) => setTeacherStaffId(e.target.value)}>
                {staff.filter((s) => s.isGuru).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Hari">
              <NativeSelect value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    {DAY_NAMES[d]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Jam ke">
              <NativeSelect value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                const t = PERIOD_TIMES[period] ?? { start: "07:00", end: "07:40" };
                void upsertSchedule({
                  data: {
                    id: editing?.id,
                    classId,
                    subjectId,
                    teacherStaffId,
                    dayOfWeek,
                    period,
                    startTime: t.start,
                    endTime: t.end,
                  },
                }).then(() => {
                  toast.success("Jadwal disimpan");
                  setOpen(false);
                  onChange();
                });
              }}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MuridTab({
  rows,
  classes,
  onChange,
}: {
  rows: Student[];
  classes: SchoolClass[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [nis, setNis] = useState("");
  const [classId, setClassId] = useState("");
  const [gender, setGender] = useState<"L" | "P">("L");
  const start = (row?: Student) => {
    setEditing(row ?? null);
    setName(row?.name ?? "");
    setNis(row?.nis ?? "");
    setClassId(row?.classId ?? classes[0]?.id ?? "");
    setGender(row?.gender ?? "L");
    setOpen(true);
  };
  return (
    <div>
      <Button className="mb-3" onClick={() => start()}>
        Tambah murid
      </Button>
      <div className="space-y-2">
        {rows.map((s) => (
          <Card key={s.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted">
                {s.className} · NIS {s.nis} · {s.gender === "L" ? "Laki-laki" : "Perempuan"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => start(s)}>
                Ubah
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  void deleteStudent({ data: { id: s.id } }).then(() => {
                    toast.success("Murid dihapus");
                    onChange();
                  })
                }
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? "Ubah murid" : "Murid baru"}>
          <div className="space-y-3">
            <Field label="Nama">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="NIS">
              <Input value={nis} onChange={(e) => setNis(e.target.value)} />
            </Field>
            <Field label="Kelas">
              <NativeSelect value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Jenis kelamin">
              <NativeSelect value={gender} onChange={(e) => setGender(e.target.value as "L" | "P")}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </NativeSelect>
            </Field>
            <Button
              className="w-full"
              onClick={() =>
                void upsertStudent({ data: { id: editing?.id, name, nis, classId, gender } }).then(() => {
                  toast.success("Murid disimpan");
                  setOpen(false);
                  onChange();
                })
              }
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
