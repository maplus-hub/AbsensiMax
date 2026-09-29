import { nid, weekdayDatesWib, wibDayOfWeek } from "@/lib/utils";
import type { Sql } from "@/lib/db";

const PERIODS = [
  { period: 1, start: "07:00", end: "07:40" },
  { period: 2, start: "07:40", end: "08:20" },
  { period: 3, start: "08:20", end: "09:00" },
  { period: 4, start: "09:20", end: "10:00" },
  { period: 5, start: "10:00", end: "10:40" },
  { period: 6, start: "10:40", end: "11:20" },
] as const;

const SUBJECTS = [
  { code: "MTK", name: "Matematika" },
  { code: "BIN", name: "Bahasa Indonesia" },
  { code: "BIG", name: "Bahasa Inggris" },
  { code: "IPA", name: "Ilmu Pengetahuan Alam" },
  { code: "IPS", name: "Ilmu Pengetahuan Sosial" },
  { code: "PKN", name: "Pendidikan Pancasila" },
  { code: "PJOK", name: "Pendidikan Jasmani" },
  { code: "SBK", name: "Seni Budaya" },
] as const;

const CLASS_STUDENTS: Record<string, { name: string; gender: "L" | "P" }[]> = {
  "7A": [
    { name: "Alya Putri Rahma", gender: "P" },
    { name: "Bima Arya Pratama", gender: "L" },
    { name: "Citra Lestari", gender: "P" },
    { name: "Dimas Wahyu Nugroho", gender: "L" },
    { name: "Eka Nurhaliza", gender: "P" },
    { name: "Fajar Maulana", gender: "L" },
    { name: "Gita Savira", gender: "P" },
    { name: "Hendra Wijaya", gender: "L" },
  ],
  "7B": [
    { name: "Kirana Ayu", gender: "P" },
    { name: "Lutfi Ramadhan", gender: "L" },
    { name: "Maya Salsabila", gender: "P" },
    { name: "Naufal Rizki", gender: "L" },
    { name: "Olivia Zahra", gender: "P" },
    { name: "Putra Aditya", gender: "L" },
  ],
  "8A": [
    { name: "Sinta Dewi", gender: "P" },
    { name: "Tegar Prakoso", gender: "L" },
    { name: "Umi Kalsum", gender: "P" },
    { name: "Vino Saputra", gender: "L" },
    { name: "Wulan Dari", gender: "P" },
    { name: "Yoga Kurniawan", gender: "L" },
  ],
};

type SeedStaff = {
  id: string;
  name: string;
  email: string;
  nip: string;
  isAdmin: boolean;
  isGuru: boolean;
  isWali: boolean;
};

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!;
}

function randStatus(seed: number): "hadir" | "sakit" | "izin" | "alpha" {
  const n = (seed * 17 + 31) % 100;
  if (n < 86) return "hadir";
  if (n < 92) return "sakit";
  if (n < 97) return "izin";
  return "alpha";
}

async function insertChunk(sql: Sql, tableSql: string, rows: unknown[][], chunkSize = 80) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const cols = chunk[0]?.length ?? 0;
    const placeholders = chunk
      .map((row, ri) => `(${row.map((_, ci) => `$${ri * cols + ci + 1}`).join(",")})`)
      .join(",");
    const params = chunk.flat();
    await sql.query(`${tableSql} values ${placeholders}`, params);
  }
}

export async function seedSchool(
  sql: Sql,
  args: { schoolId: string; admin: { id: string; userId: string; name: string; email: string | null } },
) {
  const { schoolId, admin } = args;

  await sql`
    insert into schools (id, name, address)
    values (${schoolId}, ${"SMP Harapan Nusantara"}, ${"Jl. Pendidikan No. 12, Jakarta Selatan"})
  `;

  const teachers: SeedStaff[] = [
    {
      id: admin.id,
      name: admin.name,
      email: admin.email ?? "admin@harapannusantara.sch.id",
      nip: "19880512 201001 1 001",
      isAdmin: true,
      isGuru: true,
      isWali: true,
    },
    {
      id: nid("stf"),
      name: "Rina Wulandari",
      email: "rina.wulandari@harapannusantara.sch.id",
      nip: "19900218 201402 2 003",
      isAdmin: false,
      isGuru: true,
      isWali: true,
    },
    {
      id: nid("stf"),
      name: "Budi Santoso",
      email: "budi.santoso@harapannusantara.sch.id",
      nip: "19841103 200903 1 007",
      isAdmin: false,
      isGuru: true,
      isWali: false,
    },
    {
      id: nid("stf"),
      name: "Sari Melati",
      email: "sari.melati@harapannusantara.sch.id",
      nip: "19930621 201603 2 011",
      isAdmin: false,
      isGuru: true,
      isWali: false,
    },
    {
      id: nid("stf"),
      name: "Agus Prasetyo",
      email: "agus.prasetyo@harapannusantara.sch.id",
      nip: "19870109 201201 1 004",
      isAdmin: false,
      isGuru: true,
      isWali: true,
    },
  ];

  await insertChunk(
    sql,
    `insert into staff (id, school_id, user_id, name, email, nip, is_admin, is_guru, is_wali, active)`,
    teachers.map((t) => [
      t.id,
      schoolId,
      t.id === admin.id ? admin.userId : null,
      t.name,
      t.email,
      t.nip,
      t.isAdmin,
      t.isGuru,
      t.isWali,
      true,
    ]),
  );

  const classMeta = [
    { name: "7A", grade: 7, wali: teachers[0]!.id },
    { name: "7B", grade: 7, wali: teachers[1]!.id },
    { name: "8A", grade: 8, wali: teachers[4]!.id },
  ];

  const classIds: Record<string, string> = {};
  const classRows: unknown[][] = [];
  for (const c of classMeta) {
    const id = nid("cls");
    classIds[c.name] = id;
    classRows.push([id, schoolId, c.name, c.grade, c.wali]);
  }
  await insertChunk(
    sql,
    `insert into classes (id, school_id, name, grade, wali_staff_id)`,
    classRows,
  );

  const subjectIds: Record<string, string> = {};
  const subjectRows: unknown[][] = [];
  for (const s of SUBJECTS) {
    const id = nid("sub");
    subjectIds[s.code] = id;
    subjectRows.push([id, schoolId, s.name, s.code]);
  }
  await insertChunk(sql, `insert into subjects (id, school_id, name, code)`, subjectRows);

  const studentIds: { id: string; classId: string }[] = [];
  const studentRows: unknown[][] = [];
  for (const [className, roster] of Object.entries(CLASS_STUDENTS)) {
    const classId = classIds[className]!;
    let i = 1;
    for (const st of roster) {
      const id = nid("std");
      const grade = className.replace(/\D/g, "");
      const suffix = className.includes("B") ? "02" : "01";
      const nis = `${grade}${suffix}${String(i).padStart(3, "0")}`;
      studentRows.push([id, schoolId, classId, st.name, nis, st.gender]);
      studentIds.push({ id, classId });
      i += 1;
    }
  }
  await insertChunk(
    sql,
    `insert into students (id, school_id, class_id, name, nis, gender)`,
    studentRows,
  );

  const teacherForSubject = (code: string, className: string): string => {
    if (code === "MTK") return className === "7A" ? teachers[0]!.id : teachers[2]!.id;
    if (code === "BIN") return teachers[1]!.id;
    if (code === "BIG") return teachers[3]!.id;
    if (code === "IPA") return teachers[2]!.id;
    if (code === "IPS") return teachers[4]!.id;
    if (code === "PKN") return teachers[0]!.id;
    if (code === "PJOK") return teachers[4]!.id;
    return teachers[3]!.id;
  };

  const rotation = ["MTK", "BIN", "BIG", "IPA", "IPS", "PKN", "PJOK", "SBK"] as const;
  const scheduleIds: { id: string; classId: string; teacherId: string; day: number }[] = [];
  const scheduleRows: unknown[][] = [];
  for (const className of Object.keys(classIds)) {
    const classId = classIds[className]!;
    for (let day = 1; day <= 5; day += 1) {
      for (const p of PERIODS) {
        const code = pick(rotation, day * 6 + p.period + className.charCodeAt(1));
        const id = nid("sch");
        const teacherId = teacherForSubject(code, className);
        scheduleRows.push([
          id,
          schoolId,
          classId,
          subjectIds[code]!,
          teacherId,
          day,
          p.period,
          p.start,
          p.end,
        ]);
        scheduleIds.push({ id, classId, teacherId, day });
      }
    }
  }
  await insertChunk(
    sql,
    `insert into schedules (id, school_id, class_id, subject_id, teacher_staff_id, day_of_week, period, start_time, end_time)`,
    scheduleRows,
  );

  const dates = weekdayDatesWib(8, 1);
  const teacherAttRows: unknown[][] = [];
  for (const t of teachers) {
    for (const [i, date] of dates.entries()) {
      const seed = t.name.length * 13 + i * 7;
      const n = seed % 100;
      const status = n > 96 ? "alpha" : n > 92 ? "izin" : "hadir";
      const checkIn = status === "hadir" ? `${date}T00:${String(40 + (seed % 20)).padStart(2, "0")}:00+07:00` : null;
      const checkOut = status === "hadir" ? `${date}T07:${String(10 + (seed % 40)).padStart(2, "0")}:00+07:00` : null;
      teacherAttRows.push([nid("tat"), schoolId, t.id, date, checkIn, checkOut, status]);
    }
  }
  await insertChunk(
    sql,
    `insert into teacher_attendance (id, school_id, staff_id, date, check_in_at, check_out_at, status)`,
    teacherAttRows,
  );

  const studentsByClass = new Map<string, string[]>();
  for (const st of studentIds) {
    const list = studentsByClass.get(st.classId) ?? [];
    list.push(st.id);
    studentsByClass.set(st.classId, list);
  }

  const studentAttRows: unknown[][] = [];
  for (const date of dates) {
    const [y, m, d] = date.split("-").map(Number);
    const dow = wibDayOfWeek(new Date(Date.UTC(y!, m! - 1, d!, 4)));
    for (const sch of scheduleIds.filter((s) => s.day === dow)) {
      const roster = studentsByClass.get(sch.classId) ?? [];
      for (const [si, studentId] of roster.entries()) {
        studentAttRows.push([
          nid("sat"),
          schoolId,
          studentId,
          sch.id,
          sch.teacherId,
          date,
          randStatus(si * 11 + sch.day * 3 + date.length * 5),
        ]);
      }
    }
  }
  await insertChunk(
    sql,
    `insert into student_attendance (id, school_id, student_id, schedule_id, teacher_staff_id, date, status)`,
    studentAttRows,
  );

  const last = dates[dates.length - 1]!;
  await sql`
    insert into leave_requests (id, school_id, staff_id, type, start_date, end_date, reason, status)
    values (
      ${nid("lvr")}, ${schoolId}, ${teachers[2]!.id}, ${"izin"}, ${last}::date, ${last}::date,
      ${"Mengantar orang tua ke rumah sakit"}, ${"pending"}
    )
  `;
  await sql`
    insert into leave_requests (id, school_id, staff_id, type, start_date, end_date, reason, status, reviewed_by, reviewed_at)
    values (
      ${nid("lvr")}, ${schoolId}, ${teachers[3]!.id}, ${"cuti"}, ${dates[0]}::date, ${dates[1] ?? dates[0]}::date,
      ${"Cuti tahunan keperluan keluarga"}, ${"approved"}, ${admin.id}, ${`${dates[0]}T01:00:00+07:00`}
    )
  `;
}
