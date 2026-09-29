import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { nid, todayWib, wibDayOfWeek } from "@/lib/utils";
import { seedSchool } from "./seed";
import type {
  AttendanceStatus,
  DashboardData,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  Role,
  Schedule,
  SchoolClass,
  SessionProfile,
  Staff,
  Student,
  StudentRecapRow,
  Subject,
  TeacherAttendance,
  RosterRow,
} from "./types";

type StaffRow = {
  id: string;
  school_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  nip: string | null;
  phone: string | null;
  is_admin: boolean;
  is_guru: boolean;
  is_wali: boolean;
  active: boolean;
};

type AuthUserRow = { id: string; name: string; email: string };

function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}

function mapStaff(r: StaffRow): Staff {
  return {
    id: r.id,
    schoolId: r.school_id,
    userId: r.user_id,
    name: r.name,
    email: r.email,
    nip: r.nip,
    phone: r.phone,
    isAdmin: asBool(r.is_admin),
    isGuru: asBool(r.is_guru),
    isWali: asBool(r.is_wali),
    active: asBool(r.active),
  };
}

function rolesOf(s: Staff): Role[] {
  const roles: Role[] = [];
  if (s.isAdmin) roles.push("admin");
  if (s.isGuru) roles.push("guru");
  if (s.isWali) roles.push("wali");
  return roles;
}

function iso(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function dateStr(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

async function authUser(userId: string): Promise<AuthUserRow> {
  const sql = await getSql();
  const rows = await sql<AuthUserRow>`
    select id, name, email from "user" where id = ${userId} limit 1
  `;
  const u = rows[0];
  if (!u) return { id: userId, name: "Pengguna", email: "" };
  return u;
}

async function loadProfile(userId: string): Promise<SessionProfile> {
  const sql = await getSql();
  const rows = await sql<StaffRow & { school_name: string; school_address: string | null }>`
    select s.*, sc.name as school_name, sc.address as school_address
    from staff s
    join schools sc on sc.id = s.school_id
    where s.user_id = ${userId} and s.active = true
    limit 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Akun belum terhubung ke sekolah");
  const staff = mapStaff(row);
  let waliClass: SchoolClass | null = null;
  if (staff.isWali) {
    const cls = await sql<{
      id: string;
      school_id: string;
      name: string;
      grade: number;
      wali_staff_id: string | null;
      cnt: number;
    }>`
      select c.id, c.school_id, c.name, c.grade, c.wali_staff_id,
        (select count(*)::int from students st where st.class_id = c.id) as cnt
      from classes c
      where c.wali_staff_id = ${staff.id}
      limit 1
    `;
    const c = cls[0];
    if (c) {
      waliClass = {
        id: c.id,
        schoolId: c.school_id,
        name: c.name,
        grade: Number(c.grade),
        waliStaffId: c.wali_staff_id,
        waliName: staff.name,
        studentCount: Number(c.cnt),
      };
    }
  }
  return {
    userId,
    school: { id: row.school_id, name: row.school_name, address: row.school_address },
    staff,
    waliClass,
    roles: rolesOf(staff),
  };
}

const inflight = new Map<string, Promise<SessionProfile>>();

async function ensureProfile(userId: string): Promise<SessionProfile> {
  const hit = inflight.get(userId);
  if (hit) return hit;
  const pending = ensureProfileInner(userId).finally(() => inflight.delete(userId));
  inflight.set(userId, pending);
  return pending;
}

async function ensureProfileInner(userId: string): Promise<SessionProfile> {
  const sql = await getSql();
  const existing = await sql<{ id: string }>`
    select id from staff where user_id = ${userId} and active = true limit 1
  `;
  if (existing[0]) return loadProfile(userId);

  const user = await authUser(userId);
  if (user.email) {
    const byEmail = await sql<{ id: string }>`
      select id from staff
      where lower(email) = lower(${user.email}) and user_id is null and active = true
      limit 1
    `;
    if (byEmail[0]) {
      await sql`update staff set user_id = ${userId} where id = ${byEmail[0].id}`;
      return loadProfile(userId);
    }
  }

  const schoolId = nid("sch");
  const staffId = nid("stf");
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Admin Sekolah";
  try {
    await seedSchool(sql, {
      schoolId,
      admin: { id: staffId, userId, name: displayName, email: user.email || null },
    });
  } catch {
    const again = await sql<{ id: string }>`
      select id from staff where user_id = ${userId} and active = true limit 1
    `;
    if (again[0]) return loadProfile(userId);
    throw new Error("Gagal menyiapkan data sekolah");
  }
  return loadProfile(userId);
}

function requireAdmin(p: SessionProfile) {
  if (!p.staff.isAdmin) throw new Error("Hanya admin yang dapat melakukan ini");
}

function requireTeacher(p: SessionProfile) {
  if (!p.staff.isGuru && !p.staff.isWali && !p.staff.isAdmin) {
    throw new Error("Hanya guru yang dapat melakukan ini");
  }
}

const scheduleSelect = `
  sc.id, sc.school_id, sc.class_id, c.name as class_name,
  sc.subject_id, sub.name as subject_name,
  sc.teacher_staff_id, st.name as teacher_name,
  sc.day_of_week, sc.period, sc.start_time, sc.end_time
`;

function mapSchedule(r: {
  id: string;
  school_id: string;
  class_id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  teacher_staff_id: string;
  teacher_name: string;
  day_of_week: number;
  period: number;
  start_time: string;
  end_time: string;
}): Schedule {
  return {
    id: r.id,
    schoolId: r.school_id,
    classId: r.class_id,
    className: r.class_name,
    subjectId: r.subject_id,
    subjectName: r.subject_name,
    teacherStaffId: r.teacher_staff_id,
    teacherName: r.teacher_name,
    dayOfWeek: Number(r.day_of_week),
    period: Number(r.period),
    startTime: r.start_time,
    endTime: r.end_time,
  };
}

export const bootstrapSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => ensureProfile(context.userId));

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DashboardData> => {
    const profile = await ensureProfile(context.userId);
    const sql = await getSql();
    const today = todayWib();
    const dow = wibDayOfWeek();

    const att = await sql<{
      id: string;
      staff_id: string;
      date: string;
      check_in_at: unknown;
      check_out_at: unknown;
      status: AttendanceStatus;
      note: string | null;
    }>`
      select id, staff_id, date, check_in_at, check_out_at, status, note
      from teacher_attendance
      where staff_id = ${profile.staff.id} and date = ${today}::date
      limit 1
    `;

    const schedules = await sql.query<Parameters<typeof mapSchedule>[0]>(
      `select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.teacher_staff_id = $1 and sc.day_of_week = $2
       order by sc.period`,
      [profile.staff.id, dow],
    );

    const pending = await sql<{ n: number }>`
      select count(*)::int as n from leave_requests
      where school_id = ${profile.school.id} and status = 'pending'
    `;

    const tSum = await sql<{
      hadir: number;
      izin: number;
      cuti: number;
      alpha: number;
      total: number;
    }>`
      select
        count(*) filter (where status = 'hadir')::int as hadir,
        count(*) filter (where status = 'izin')::int as izin,
        count(*) filter (where status = 'cuti')::int as cuti,
        count(*) filter (where status = 'alpha')::int as alpha,
        count(*)::int as total
      from teacher_attendance
      where school_id = ${profile.school.id}
        and date >= ${today}::date - interval '14 days'
    `;

    let classSummary: DashboardData["classSummary"] = null;
    if (profile.waliClass) {
      const cs = await sql<{
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
        total: number;
      }>`
        select
          count(*) filter (where sa.status = 'hadir')::int as hadir,
          count(*) filter (where sa.status = 'sakit')::int as sakit,
          count(*) filter (where sa.status = 'izin')::int as izin,
          count(*) filter (where sa.status = 'alpha')::int as alpha,
          count(*)::int as total
        from student_attendance sa
        join students s on s.id = sa.student_id
        where s.class_id = ${profile.waliClass.id}
          and sa.date >= ${today}::date - interval '14 days'
      `;
      classSummary = cs[0] ?? { hadir: 0, sakit: 0, izin: 0, alpha: 0, total: 0 };
    }

    const leaves = await sql<{
      id: string;
      staff_id: string;
      staff_name: string;
      type: LeaveType;
      start_date: string;
      end_date: string;
      reason: string;
      status: LeaveStatus;
      reviewed_by_name: string | null;
      created_at: unknown;
    }>`
      select l.id, l.staff_id, st.name as staff_name, l.type, l.start_date, l.end_date,
        l.reason, l.status, rv.name as reviewed_by_name, l.created_at
      from leave_requests l
      join staff st on st.id = l.staff_id
      left join staff rv on rv.id = l.reviewed_by
      where l.school_id = ${profile.school.id}
      order by l.created_at desc
      limit 5
    `;

    const a = att[0];
    return {
      profile,
      today,
      teacherToday: a
        ? {
            id: a.id,
            staffId: a.staff_id,
            staffName: profile.staff.name,
            date: dateStr(a.date),
            checkInAt: iso(a.check_in_at),
            checkOutAt: iso(a.check_out_at),
            status: a.status,
            note: a.note,
          }
        : null,
      todaySchedules: schedules.map(mapSchedule),
      pendingLeaves: Number(pending[0]?.n ?? 0),
      teacherSummary: tSum[0] ?? { hadir: 0, izin: 0, cuti: 0, alpha: 0, total: 0 },
      classSummary,
      recentLeaves: leaves.map((l) => ({
        id: l.id,
        staffId: l.staff_id,
        staffName: l.staff_name,
        type: l.type,
        startDate: dateStr(l.start_date),
        endDate: dateStr(l.end_date),
        reason: l.reason,
        status: l.status,
        reviewedByName: l.reviewed_by_name,
        createdAt: iso(l.created_at) ?? "",
      })),
    };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const rows = await sql<StaffRow>`
      select * from staff where school_id = ${p.school.id} order by name
    `;
    return rows.map(mapStaff);
  });

export const upsertStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id?: string;
    name: string;
    email: string;
    nip?: string;
    phone?: string;
    isAdmin: boolean;
    isGuru: boolean;
    isWali: boolean;
  }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    if (!name || !email) throw new Error("Nama dan email wajib diisi");
    if (!data.isAdmin && !data.isGuru && !data.isWali) {
      throw new Error("Pilih minimal satu peran");
    }
    if (data.id) {
      await sql`
        update staff set
          name = ${name}, email = ${email}, nip = ${data.nip?.trim() || null},
          phone = ${data.phone?.trim() || null},
          is_admin = ${data.isAdmin}, is_guru = ${data.isGuru}, is_wali = ${data.isWali}
        where id = ${data.id} and school_id = ${p.school.id}
      `;
      return { id: data.id };
    }
    const id = nid("stf");
    await sql`
      insert into staff (id, school_id, name, email, nip, phone, is_admin, is_guru, is_wali, active)
      values (
        ${id}, ${p.school.id}, ${name}, ${email}, ${data.nip?.trim() || null},
        ${data.phone?.trim() || null}, ${data.isAdmin}, ${data.isGuru}, ${data.isWali}, ${true}
      )
    `;
    return { id };
  });

export const setStaffActive = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; active: boolean }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    if (data.id === p.staff.id) throw new Error("Tidak dapat menonaktifkan akun sendiri");
    const sql = await getSql();
    await sql`
      update staff set active = ${data.active}
      where id = ${data.id} and school_id = ${p.school.id}
    `;
    return { ok: true };
  });

export const listClasses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      school_id: string;
      name: string;
      grade: number;
      wali_staff_id: string | null;
      wali_name: string | null;
      cnt: number;
    }>`
      select c.id, c.school_id, c.name, c.grade, c.wali_staff_id, st.name as wali_name,
        (select count(*)::int from students s where s.class_id = c.id) as cnt
      from classes c
      left join staff st on st.id = c.wali_staff_id
      where c.school_id = ${p.school.id}
      order by c.grade, c.name
    `;
    return rows.map(
      (c): SchoolClass => ({
        id: c.id,
        schoolId: c.school_id,
        name: c.name,
        grade: Number(c.grade),
        waliStaffId: c.wali_staff_id,
        waliName: c.wali_name,
        studentCount: Number(c.cnt),
      }),
    );
  });

export const upsertClass = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; name: string; grade: number; waliStaffId?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const name = data.name.trim();
    if (!name) throw new Error("Nama kelas wajib");
    const wali = data.waliStaffId || null;
    if (data.id) {
      await sql`
        update classes set name = ${name}, grade = ${data.grade}, wali_staff_id = ${wali}
        where id = ${data.id} and school_id = ${p.school.id}
      `;
      return { id: data.id };
    }
    const id = nid("cls");
    await sql`
      insert into classes (id, school_id, name, grade, wali_staff_id)
      values (${id}, ${p.school.id}, ${name}, ${data.grade}, ${wali})
    `;
    return { id };
  });

export const deleteClass = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    await sql`delete from classes where id = ${data.id} and school_id = ${p.school.id}`;
    return { ok: true };
  });

export const listSubjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql<{ id: string; school_id: string; name: string; code: string }>`
      select id, school_id, name, code from subjects
      where school_id = ${p.school.id} order by name
    `;
    return rows.map(
      (s): Subject => ({ id: s.id, schoolId: s.school_id, name: s.name, code: s.code }),
    );
  });

export const upsertSubject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; name: string; code: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const name = data.name.trim();
    const code = data.code.trim().toUpperCase();
    if (!name || !code) throw new Error("Nama dan kode wajib");
    if (data.id) {
      await sql`
        update subjects set name = ${name}, code = ${code}
        where id = ${data.id} and school_id = ${p.school.id}
      `;
      return { id: data.id };
    }
    const id = nid("sub");
    await sql`
      insert into subjects (id, school_id, name, code)
      values (${id}, ${p.school.id}, ${name}, ${code})
    `;
    return { id };
  });

export const deleteSubject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    await sql`delete from subjects where id = ${data.id} and school_id = ${p.school.id}`;
    return { ok: true };
  });

export const listStudents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d?: { classId?: string }) => d ?? {})
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    const classId = data.classId;
    const rows = classId
      ? await sql<{
          id: string;
          school_id: string;
          class_id: string;
          class_name: string;
          name: string;
          nis: string;
          gender: "L" | "P";
        }>`
          select s.id, s.school_id, s.class_id, c.name as class_name, s.name, s.nis, s.gender
          from students s join classes c on c.id = s.class_id
          where s.school_id = ${p.school.id} and s.class_id = ${classId}
          order by s.name
        `
      : await sql<{
          id: string;
          school_id: string;
          class_id: string;
          class_name: string;
          name: string;
          nis: string;
          gender: "L" | "P";
        }>`
          select s.id, s.school_id, s.class_id, c.name as class_name, s.name, s.nis, s.gender
          from students s join classes c on c.id = s.class_id
          where s.school_id = ${p.school.id}
          order by c.grade, c.name, s.name
        `;
    return rows.map(
      (s): Student => ({
        id: s.id,
        schoolId: s.school_id,
        classId: s.class_id,
        className: s.class_name,
        name: s.name,
        nis: s.nis,
        gender: s.gender,
      }),
    );
  });

export const upsertStudent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; classId: string; name: string; nis: string; gender: "L" | "P" }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const name = data.name.trim();
    const nis = data.nis.trim();
    if (!name || !nis) throw new Error("Nama dan NIS wajib");
    if (data.id) {
      await sql`
        update students set class_id = ${data.classId}, name = ${name}, nis = ${nis}, gender = ${data.gender}
        where id = ${data.id} and school_id = ${p.school.id}
      `;
      return { id: data.id };
    }
    const id = nid("std");
    await sql`
      insert into students (id, school_id, class_id, name, nis, gender)
      values (${id}, ${p.school.id}, ${data.classId}, ${name}, ${nis}, ${data.gender})
    `;
    return { id };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    await sql`delete from students where id = ${data.id} and school_id = ${p.school.id}`;
    return { ok: true };
  });

export const listSchedules = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Parameters<typeof mapSchedule>[0]>(
      `select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.school_id = $1
       order by sc.day_of_week, sc.period, c.name`,
      [p.school.id],
    );
    return rows.map(mapSchedule);
  });

export const upsertSchedule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id?: string;
    classId: string;
    subjectId: string;
    teacherStaffId: string;
    dayOfWeek: number;
    period: number;
    startTime: string;
    endTime: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    if (data.id) {
      await sql`
        update schedules set
          class_id = ${data.classId}, subject_id = ${data.subjectId},
          teacher_staff_id = ${data.teacherStaffId}, day_of_week = ${data.dayOfWeek},
          period = ${data.period}, start_time = ${data.startTime}, end_time = ${data.endTime}
        where id = ${data.id} and school_id = ${p.school.id}
      `;
      return { id: data.id };
    }
    const id = nid("sch");
    await sql`
      insert into schedules (
        id, school_id, class_id, subject_id, teacher_staff_id,
        day_of_week, period, start_time, end_time
      ) values (
        ${id}, ${p.school.id}, ${data.classId}, ${data.subjectId}, ${data.teacherStaffId},
        ${data.dayOfWeek}, ${data.period}, ${data.startTime}, ${data.endTime}
      )
    `;
    return { id };
  });

export const deleteSchedule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    await sql`delete from schedules where id = ${data.id} and school_id = ${p.school.id}`;
    return { ok: true };
  });

export const clockIn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const sql = await getSql();
    const today = todayWib();
    const existing = await sql<{ id: string; check_in_at: unknown; status: string }>`
      select id, check_in_at, status from teacher_attendance
      where staff_id = ${p.staff.id} and date = ${today}::date
    `;
    if (existing[0]?.check_in_at) throw new Error("Anda sudah absen masuk hari ini");
    if (existing[0] && (existing[0].status === "izin" || existing[0].status === "cuti")) {
      throw new Error("Hari ini tercatat izin/cuti");
    }
    const approved = await sql<{ id: string }>`
      select id from leave_requests
      where staff_id = ${p.staff.id} and status = 'approved'
        and start_date <= ${today}::date and end_date >= ${today}::date
      limit 1
    `;
    if (approved[0]) throw new Error("Pengajuan izin/cuti Anda disetujui untuk hari ini");
    if (existing[0]) {
      await sql`
        update teacher_attendance
        set check_in_at = now(), status = 'hadir'
        where id = ${existing[0].id}
      `;
      return { ok: true };
    }
    await sql`
      insert into teacher_attendance (id, school_id, staff_id, date, check_in_at, status)
      values (${nid("tat")}, ${p.school.id}, ${p.staff.id}, ${today}::date, now(), 'hadir')
    `;
    return { ok: true };
  });

export const clockOut = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const sql = await getSql();
    const today = todayWib();
    const existing = await sql<{ id: string; check_in_at: unknown; check_out_at: unknown }>`
      select id, check_in_at, check_out_at from teacher_attendance
      where staff_id = ${p.staff.id} and date = ${today}::date
    `;
    if (!existing[0]?.check_in_at) throw new Error("Absen masuk dulu sebelum pulang");
    if (existing[0].check_out_at) throw new Error("Anda sudah absen pulang");
    await sql`
      update teacher_attendance set check_out_at = now() where id = ${existing[0].id}
    `;
    return { ok: true };
  });

export const listTeacherAttendance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { from: string; to: string; staffId?: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    if (!p.staff.isAdmin) throw new Error("Hanya admin yang dapat melihat rekap guru");
    const sql = await getSql();
    const rows = data.staffId
      ? await sql<{
          id: string;
          staff_id: string;
          staff_name: string;
          date: string;
          check_in_at: unknown;
          check_out_at: unknown;
          status: AttendanceStatus;
          note: string | null;
        }>`
          select a.id, a.staff_id, st.name as staff_name, a.date, a.check_in_at, a.check_out_at, a.status, a.note
          from teacher_attendance a
          join staff st on st.id = a.staff_id
          where a.school_id = ${p.school.id}
            and a.date >= ${data.from}::date and a.date <= ${data.to}::date
            and a.staff_id = ${data.staffId}
          order by a.date desc, st.name
        `
      : await sql<{
          id: string;
          staff_id: string;
          staff_name: string;
          date: string;
          check_in_at: unknown;
          check_out_at: unknown;
          status: AttendanceStatus;
          note: string | null;
        }>`
          select a.id, a.staff_id, st.name as staff_name, a.date, a.check_in_at, a.check_out_at, a.status, a.note
          from teacher_attendance a
          join staff st on st.id = a.staff_id
          where a.school_id = ${p.school.id}
            and a.date >= ${data.from}::date and a.date <= ${data.to}::date
          order by a.date desc, st.name
        `;
    return rows.map(
      (r): TeacherAttendance => ({
        id: r.id,
        staffId: r.staff_id,
        staffName: r.staff_name,
        date: dateStr(r.date),
        checkInAt: iso(r.check_in_at),
        checkOutAt: iso(r.check_out_at),
        status: r.status,
        note: r.note,
      }),
    );
  });

export const submitLeave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { type: LeaveType; startDate: string; endDate: string; reason: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const reason = data.reason.trim();
    if (!reason) throw new Error("Alasan wajib diisi");
    if (data.endDate < data.startDate) throw new Error("Tanggal selesai tidak valid");
    const sql = await getSql();
    const id = nid("lvr");
    await sql`
      insert into leave_requests (id, school_id, staff_id, type, start_date, end_date, reason, status)
      values (
        ${id}, ${p.school.id}, ${p.staff.id}, ${data.type},
        ${data.startDate}::date, ${data.endDate}::date, ${reason}, 'pending'
      )
    `;
    return { id };
  });

export const listLeaves = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d?: { mine?: boolean }) => d ?? {})
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    const mine = Boolean(data.mine) || !p.staff.isAdmin;
    const rows = mine
      ? await sql<{
          id: string;
          staff_id: string;
          staff_name: string;
          type: LeaveType;
          start_date: string;
          end_date: string;
          reason: string;
          status: LeaveStatus;
          reviewed_by_name: string | null;
          created_at: unknown;
        }>`
          select l.id, l.staff_id, st.name as staff_name, l.type, l.start_date, l.end_date,
            l.reason, l.status, rv.name as reviewed_by_name, l.created_at
          from leave_requests l
          join staff st on st.id = l.staff_id
          left join staff rv on rv.id = l.reviewed_by
          where l.staff_id = ${p.staff.id}
          order by l.created_at desc
        `
      : await sql<{
          id: string;
          staff_id: string;
          staff_name: string;
          type: LeaveType;
          start_date: string;
          end_date: string;
          reason: string;
          status: LeaveStatus;
          reviewed_by_name: string | null;
          created_at: unknown;
        }>`
          select l.id, l.staff_id, st.name as staff_name, l.type, l.start_date, l.end_date,
            l.reason, l.status, rv.name as reviewed_by_name, l.created_at
          from leave_requests l
          join staff st on st.id = l.staff_id
          left join staff rv on rv.id = l.reviewed_by
          where l.school_id = ${p.school.id}
          order by case l.status when 'pending' then 0 else 1 end, l.created_at desc
        `;
    return rows.map(
      (l): LeaveRequest => ({
        id: l.id,
        staffId: l.staff_id,
        staffName: l.staff_name,
        type: l.type,
        startDate: dateStr(l.start_date),
        endDate: dateStr(l.end_date),
        reason: l.reason,
        status: l.status,
        reviewedByName: l.reviewed_by_name,
        createdAt: iso(l.created_at) ?? "",
      }),
    );
  });

export const reviewLeave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; status: "approved" | "rejected" }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireAdmin(p);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      staff_id: string;
      type: LeaveType;
      start_date: string;
      end_date: string;
      status: string;
    }>`
      select id, staff_id, type, start_date, end_date, status
      from leave_requests where id = ${data.id} and school_id = ${p.school.id}
    `;
    const leave = rows[0];
    if (!leave) throw new Error("Pengajuan tidak ditemukan");
    if (leave.status !== "pending") throw new Error("Pengajuan sudah diproses");
    await sql`
      update leave_requests
      set status = ${data.status}, reviewed_by = ${p.staff.id}, reviewed_at = now()
      where id = ${leave.id}
    `;
    if (data.status === "approved") {
      const start = new Date(`${dateStr(leave.start_date)}T04:00:00+07:00`);
      const end = new Date(`${dateStr(leave.end_date)}T04:00:00+07:00`);
      for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
        const isoDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date(t));
        await sql`
          insert into teacher_attendance (id, school_id, staff_id, date, status, note)
          values (
            ${nid("tat")}, ${p.school.id}, ${leave.staff_id}, ${isoDay}::date,
            ${leave.type}, ${"Disetujui dari pengajuan"}
          )
          on conflict (staff_id, date) do update
            set status = excluded.status, note = excluded.note,
                check_in_at = null, check_out_at = null
        `;
      }
    }
    return { ok: true };
  });

export const getTeachingDay = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d?: { date?: string }) => d ?? {})
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const date = data.date || todayWib();
    const [y, m, d] = date.split("-").map(Number);
    const dow = wibDayOfWeek(new Date(Date.UTC(y!, m! - 1, d!, 4)));
    const sql = await getSql();
    const rows = await sql.query<Parameters<typeof mapSchedule>[0]>(
      `select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.teacher_staff_id = $1 and sc.day_of_week = $2
       order by sc.period`,
      [p.staff.id, dow],
    );
    return { date, dayOfWeek: dow, schedules: rows.map(mapSchedule) };
  });

export const getRoster = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { scheduleId: string; date: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const sql = await getSql();
    const sch = await sql<{ id: string; class_id: string; teacher_staff_id: string }>`
      select id, class_id, teacher_staff_id from schedules
      where id = ${data.scheduleId} and school_id = ${p.school.id}
    `;
    const schedule = sch[0];
    if (!schedule) throw new Error("Jadwal tidak ditemukan");
    if (schedule.teacher_staff_id !== p.staff.id && !p.staff.isAdmin) {
      throw new Error("Anda bukan pengampu jam ini");
    }
    const rows = await sql<{
      student_id: string;
      name: string;
      nis: string;
      gender: "L" | "P";
      status: AttendanceStatus | null;
      note: string | null;
      attendance_id: string | null;
    }>`
      select s.id as student_id, s.name, s.nis, s.gender,
        sa.status, sa.note, sa.id as attendance_id
      from students s
      left join student_attendance sa
        on sa.student_id = s.id and sa.schedule_id = ${data.scheduleId} and sa.date = ${data.date}::date
      where s.class_id = ${schedule.class_id}
      order by s.name
    `;
    return rows.map(
      (r): RosterRow => ({
        studentId: r.student_id,
        name: r.name,
        nis: r.nis,
        gender: r.gender,
        status: r.status,
        note: r.note,
        attendanceId: r.attendance_id,
      }),
    );
  });

export const saveStudentAttendance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    scheduleId: string;
    date: string;
    marks: { studentId: string; status: AttendanceStatus; note?: string }[];
  }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    requireTeacher(p);
    const sql = await getSql();
    const sch = await sql<{ id: string; teacher_staff_id: string }>`
      select id, teacher_staff_id from schedules
      where id = ${data.scheduleId} and school_id = ${p.school.id}
    `;
    if (!sch[0]) throw new Error("Jadwal tidak ditemukan");
    if (sch[0].teacher_staff_id !== p.staff.id && !p.staff.isAdmin) {
      throw new Error("Anda bukan pengampu jam ini");
    }
    for (const mark of data.marks) {
      await sql`
        insert into student_attendance (
          id, school_id, student_id, schedule_id, teacher_staff_id, date, status, note
        ) values (
          ${nid("sat")}, ${p.school.id}, ${mark.studentId}, ${data.scheduleId},
          ${p.staff.id}, ${data.date}::date, ${mark.status}, ${mark.note ?? null}
        )
        on conflict (student_id, schedule_id, date) do update
          set status = excluded.status, note = excluded.note, teacher_staff_id = excluded.teacher_staff_id
      `;
    }
    return { ok: true, count: data.marks.length };
  });

export const getStudentRecap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { from: string; to: string; subjectId?: string; classId?: string }) => d)
  .handler(async ({ context, data }) => {
    const p = await ensureProfile(context.userId);
    const sql = await getSql();
    let classId = data.classId;
    if (!p.staff.isAdmin) {
      if (!p.staff.isWali || !p.waliClass) throw new Error("Hanya wali kelas yang dapat melihat rekap ini");
      classId = p.waliClass.id;
    }
    if (!classId) throw new Error("Pilih kelas");
    const rows = data.subjectId
      ? await sql<{
          student_id: string;
          student_name: string;
          nis: string;
          class_name: string;
          subject_name: string;
          hadir: number;
          sakit: number;
          izin: number;
          alpha: number;
          total: number;
        }>`
          select s.id as student_id, s.name as student_name, s.nis, c.name as class_name,
            sub.name as subject_name,
            count(*) filter (where sa.status = 'hadir')::int as hadir,
            count(*) filter (where sa.status = 'sakit')::int as sakit,
            count(*) filter (where sa.status = 'izin')::int as izin,
            count(*) filter (where sa.status = 'alpha')::int as alpha,
            count(*)::int as total
          from student_attendance sa
          join students s on s.id = sa.student_id
          join classes c on c.id = s.class_id
          join schedules sc on sc.id = sa.schedule_id
          join subjects sub on sub.id = sc.subject_id
          where s.class_id = ${classId}
            and sa.date >= ${data.from}::date and sa.date <= ${data.to}::date
            and sc.subject_id = ${data.subjectId}
          group by s.id, s.name, s.nis, c.name, sub.name
          order by s.name, sub.name
        `
      : await sql<{
          student_id: string;
          student_name: string;
          nis: string;
          class_name: string;
          subject_name: string;
          hadir: number;
          sakit: number;
          izin: number;
          alpha: number;
          total: number;
        }>`
          select s.id as student_id, s.name as student_name, s.nis, c.name as class_name,
            sub.name as subject_name,
            count(*) filter (where sa.status = 'hadir')::int as hadir,
            count(*) filter (where sa.status = 'sakit')::int as sakit,
            count(*) filter (where sa.status = 'izin')::int as izin,
            count(*) filter (where sa.status = 'alpha')::int as alpha,
            count(*)::int as total
          from student_attendance sa
          join students s on s.id = sa.student_id
          join classes c on c.id = s.class_id
          join schedules sc on sc.id = sa.schedule_id
          join subjects sub on sub.id = sc.subject_id
          where s.class_id = ${classId}
            and sa.date >= ${data.from}::date and sa.date <= ${data.to}::date
          group by s.id, s.name, s.nis, c.name, sub.name
          order by s.name, sub.name
        `;
    return rows.map(
      (r): StudentRecapRow => ({
        studentId: r.student_id,
        studentName: r.student_name,
        nis: r.nis,
        className: r.class_name,
        subjectName: r.subject_name,
        hadir: Number(r.hadir),
        sakit: Number(r.sakit),
        izin: Number(r.izin),
        alpha: Number(r.alpha),
        total: Number(r.total),
        percent: Number(r.total) ? Math.round((Number(r.hadir) / Number(r.total)) * 1000) / 10 : 0,
      }),
    );
  });
