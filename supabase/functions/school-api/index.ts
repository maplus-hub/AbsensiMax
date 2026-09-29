import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("Supabase function environment is incomplete.");
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

type Role = "admin" | "guru" | "wali";
type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpha" | "cuti";
type LeaveType = "izin" | "cuti";
type LeaveStatus = "pending" | "approved" | "rejected";
type User = {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
};
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
type Profile = {
  userId: string;
  school: { id: string; name: string; address: string | null };
  staff: Record<string, unknown> & {
    id: string;
    schoolId: string;
    isAdmin: boolean;
    isGuru: boolean;
    isWali: boolean;
  };
  waliClass: Record<string, unknown> | null;
  roles: Role[];
};

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function fail(message: string, status = 400): Response {
  return Response.json({ error: message }, { status, headers });
}

function must<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new DatabaseError(result.error.message);
  return result.data as T;
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`;
}

function todayWib(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

function daysAgoWib(days: number): string {
  const today = new Date(`${todayWib()}T00:00:00+07:00`);
  today.setUTCDate(today.getUTCDate() - days);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(today);
}

function dayWib(date = new Date()): number {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(date);
  return (
    ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 } as Record<string, number>)[day] ?? 1
  );
}

function iso(value: unknown): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

function dateString(value: unknown): string {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function rolesOf(staff: StaffRow): Role[] {
  return [
    ...(staff.is_admin ? ["admin" as const] : []),
    ...(staff.is_guru ? ["guru" as const] : []),
    ...(staff.is_wali ? ["wali" as const] : []),
  ];
}

function mapStaff(row: StaffRow) {
  return {
    id: row.id,
    schoolId: row.school_id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    nip: row.nip,
    phone: row.phone,
    isAdmin: row.is_admin,
    isGuru: row.is_guru,
    isWali: row.is_wali,
    active: row.active,
  };
}

async function getProfile(db: ReturnType<typeof createClient>, user: User): Promise<Profile> {
  const email = user.email ?? "";
  const metadataName = user.user_metadata?.name ?? user.user_metadata?.full_name;
  const name =
    (typeof metadataName === "string" && metadataName.trim()) || email.split("@")[0] || "Pengguna";
  must(await db.from("app_users").upsert({ id: user.id, name, email }, { onConflict: "id" }));

  let staff = must(
    await db.from("staff").select("*").eq("user_id", user.id).eq("active", true).maybeSingle(),
  );
  if (!staff && email) {
    const invitation = must(
      await db
        .from("staff")
        .select("id")
        .eq("email", email)
        .is("user_id", null)
        .eq("active", true)
        .maybeSingle(),
    );
    if (invitation) {
      if (!user.email_confirmed_at)
        throw new Error("Verifikasi email terlebih dahulu sebelum menghubungkan akun sekolah.");
      const link = await db
        .from("staff")
        .update({ user_id: user.id })
        .eq("id", invitation.id)
        .is("user_id", null)
        .select("*")
        .maybeSingle();
      if (link.error) throw new DatabaseError(link.error.message);
      staff = link.data;
      if (!staff) {
        staff = must(
          await db.from("staff").select("*").eq("user_id", user.id).maybeSingle(),
        );
        if (staff && !staff.active) throw new Error("Akun sekolah ini sudah dinonaktifkan.");
        if (!staff) throw new Error("Undangan staf sudah digunakan oleh akun lain.");
      }
    }
  }

  if (!staff) {
    const schoolId = id("sch");
    const staffId = id("stf");
    try {
      must(
        await db
          .from("schools")
          .insert({
            id: schoolId,
            name: `Sekolah ${name}`,
            address: null,
          })
          .select("id")
          .single(),
      );
      staff = must(
        await db
          .from("staff")
          .insert({
            id: staffId,
            school_id: schoolId,
            user_id: user.id,
            name,
            email: email || null,
            is_admin: true,
            is_guru: false,
            is_wali: false,
            active: true,
          })
          .select("*")
          .single(),
      );
    } catch (error) {
      const retry = await db
        .from("staff")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (retry.error) throw new DatabaseError(retry.error.message);
      if (!retry.data) throw error;
      staff = retry.data;
      const cleanup = await db.from("schools").delete().eq("id", schoolId);
      if (cleanup.error)
        console.error("[school-api] orphan-school cleanup failed:", cleanup.error.message);
    }
  }

  const school = must(
    await db.from("schools").select("id,name,address").eq("id", staff.school_id).single(),
  );
  const roles = rolesOf(staff as StaffRow);
  let waliClass = null;
  if (staff.is_wali) {
    const row = must(
      await db
        .from("classes")
        .select("id,school_id,name,grade,wali_staff_id")
        .eq("wali_staff_id", staff.id)
        .limit(1)
        .maybeSingle(),
    );
    if (row) {
      const count = await db
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("class_id", row.id);
      if (count.error) throw new DatabaseError(count.error.message);
      waliClass = {
        id: row.id,
        schoolId: row.school_id,
        name: row.name,
        grade: Number(row.grade),
        waliStaffId: row.wali_staff_id,
        waliName: staff.name,
        studentCount: count.count ?? 0,
      };
    }
  }
  return { userId: user.id, school, staff: mapStaff(staff as StaffRow), waliClass, roles };
}

function requireAdmin(profile: Profile) {
  if (!profile.staff.isAdmin) throw new Error("Hanya admin yang dapat melakukan ini");
}

function requireTeacher(profile: Profile) {
  if (!profile.staff.isGuru && !profile.staff.isWali && !profile.staff.isAdmin) {
    throw new Error("Hanya guru yang dapat melakukan ini");
  }
}

async function withSchedules(db: ReturnType<typeof createClient>, rows: Record<string, unknown>[]) {
  const classIds = [...new Set(rows.map((r) => r.class_id as string))];
  const subjectIds = [...new Set(rows.map((r) => r.subject_id as string))];
  const staffIds = [...new Set(rows.map((r) => r.teacher_staff_id as string))];
  const [classes, subjects, staff] = await Promise.all([
    classIds.length
      ? db.from("classes").select("id,name").in("id", classIds)
      : Promise.resolve({ data: [], error: null }),
    subjectIds.length
      ? db.from("subjects").select("id,name").in("id", subjectIds)
      : Promise.resolve({ data: [], error: null }),
    staffIds.length
      ? db.from("staff").select("id,name").in("id", staffIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const classById = new Map(
    (must(classes) as { id: string; name: string }[]).map((x) => [x.id, x.name]),
  );
  const subjectById = new Map(
    (must(subjects) as { id: string; name: string }[]).map((x) => [x.id, x.name]),
  );
  const staffById = new Map(
    (must(staff) as { id: string; name: string }[]).map((x) => [x.id, x.name]),
  );
  return rows.map((r) => ({
    id: r.id,
    schoolId: r.school_id,
    classId: r.class_id,
    className: classById.get(r.class_id as string) ?? "",
    subjectId: r.subject_id,
    subjectName: subjectById.get(r.subject_id as string) ?? "",
    teacherStaffId: r.teacher_staff_id,
    teacherName: staffById.get(r.teacher_staff_id as string) ?? "",
    dayOfWeek: Number(r.day_of_week),
    period: Number(r.period),
    startTime: r.start_time,
    endTime: r.end_time,
  }));
}

async function dashboard(db: ReturnType<typeof createClient>, p: Profile) {
  const today = todayWib();
  const dow = dayWib();
  const staffId = p.staff.id as string;
  const schoolId = p.school.id;
  const since = daysAgoWib(14);
  const [attendance, scheduleResult, leaveResult, teacherResult] = await Promise.all([
    db
      .from("teacher_attendance")
      .select("*")
      .eq("staff_id", staffId)
      .eq("date", today)
      .maybeSingle(),
    db
      .from("schedules")
      .select("*")
      .eq("teacher_staff_id", staffId)
      .eq("day_of_week", dow)
      .order("period"),
    db
      .from("leave_requests")
      .select("id", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("status", "pending"),
    db.from("teacher_attendance").select("status").eq("school_id", schoolId).gte("date", since),
  ]);
  const att = must(attendance);
  const schedules = await withSchedules(db, must(scheduleResult) as Record<string, unknown>[]);
  const teacherRows = must(teacherResult) as { status: string }[];
  const teacherSummary = {
    hadir: teacherRows.filter((x) => x.status === "hadir").length,
    izin: teacherRows.filter((x) => x.status === "izin").length,
    cuti: teacherRows.filter((x) => x.status === "cuti").length,
    alpha: teacherRows.filter((x) => x.status === "alpha").length,
    total: teacherRows.length,
  };
  let classSummary = null;
  if (p.waliClass) {
    const studentRows = must(
      await db
        .from("student_attendance")
        .select("status,students!inner(class_id)")
        .eq("students.class_id", p.waliClass.id)
        .gte("date", since),
    );
    const rows = studentRows as { status: string }[];
    classSummary = {
      hadir: rows.filter((x) => x.status === "hadir").length,
      sakit: rows.filter((x) => x.status === "sakit").length,
      izin: rows.filter((x) => x.status === "izin").length,
      alpha: rows.filter((x) => x.status === "alpha").length,
      total: rows.length,
    };
  }
  const leaves = must(
    await db
      .from("leave_requests")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false })
      .limit(5),
  );
  const leaveStaffIds = [
    ...new Set(
      (leaves as Record<string, unknown>[]).flatMap(
        (x) => [x.staff_id, x.reviewed_by].filter(Boolean) as string[],
      ),
    ),
  ];
  const staffRows = leaveStaffIds.length
    ? (must(await db.from("staff").select("id,name").in("id", leaveStaffIds)) as {
        id: string;
        name: string;
      }[])
    : [];
  const staffNames = new Map(staffRows.map((x) => [x.id, x.name]));
  return {
    profile: p,
    today,
    teacherToday: att
      ? {
          id: att.id,
          staffId: att.staff_id,
          staffName: p.staff.name,
          date: dateString(att.date),
          checkInAt: iso(att.check_in_at),
          checkOutAt: iso(att.check_out_at),
          status: att.status,
          note: att.note,
        }
      : null,
    todaySchedules: schedules,
    pendingLeaves: leaveResult.count ?? 0,
    teacherSummary,
    classSummary,
    recentLeaves: (leaves as Record<string, unknown>[]).map((l) => ({
      id: l.id,
      staffId: l.staff_id,
      staffName: staffNames.get(l.staff_id as string) ?? "",
      type: l.type,
      startDate: dateString(l.start_date),
      endDate: dateString(l.end_date),
      reason: l.reason,
      status: l.status,
      reviewedByName: staffNames.get(l.reviewed_by as string) ?? null,
      createdAt: iso(l.created_at) ?? "",
    })),
  };
}

async function dispatch(
  db: ReturnType<typeof createClient>,
  p: Profile,
  action: string,
  data: Record<string, unknown>,
) {
  const schoolId = p.school.id;
  const staffId = p.staff.id as string;
  switch (action) {
    case "bootstrapSession":
      return p;
    case "getDashboard":
      return dashboard(db, p);
    case "listStaff": {
      requireAdmin(p);
      return (
        must(
          await db.from("staff").select("*").eq("school_id", schoolId).order("name"),
        ) as StaffRow[]
      ).map(mapStaff);
    }
    case "upsertStaff": {
      requireAdmin(p);
      const name = String(data.name ?? "").trim();
      const email = String(data.email ?? "")
        .trim()
        .toLowerCase();
      if (!name || !email) throw new Error("Nama dan email wajib diisi");
      if (!data.isAdmin && !data.isGuru && !data.isWali)
        throw new Error("Pilih minimal satu peran");
      const row = {
        name,
        email,
        nip: String(data.nip ?? "").trim() || null,
        phone: String(data.phone ?? "").trim() || null,
        is_admin: Boolean(data.isAdmin),
        is_guru: Boolean(data.isGuru),
        is_wali: Boolean(data.isWali),
      };
      if (data.id) {
        must(
          await db
            .from("staff")
            .update(row)
            .eq("id", data.id)
            .eq("school_id", schoolId)
            .select("id")
            .single(),
        );
        return { id: data.id };
      }
      const created = must(
        await db
          .from("staff")
          .insert({ id: id("stf"), school_id: schoolId, ...row, active: true })
          .select("id")
          .single(),
      );
      return { id: created.id };
    }
    case "setStaffActive": {
      requireAdmin(p);
      if (data.id === staffId) throw new Error("Tidak dapat menonaktifkan akun sendiri");
      must(
        await db
          .from("staff")
          .update({ active: Boolean(data.active) })
          .eq("id", data.id)
          .eq("school_id", schoolId),
      );
      return { ok: true };
    }
    case "listClasses": {
      const rows = must(
        await db.from("classes").select("*").eq("school_id", schoolId).order("grade").order("name"),
      ) as Record<string, unknown>[];
      const waliIds = [...new Set(rows.map((r) => r.wali_staff_id).filter(Boolean) as string[])];
      const [staffRows, studentRows] = await Promise.all([
        waliIds.length
          ? db.from("staff").select("id,name").in("id", waliIds)
          : Promise.resolve({ data: [], error: null }),
        rows.length
          ? db
              .from("students")
              .select("class_id")
              .in(
                "class_id",
                rows.map((r) => r.id),
              )
          : Promise.resolve({ data: [], error: null }),
      ]);
      const names = new Map(
        (must(staffRows) as { id: string; name: string }[]).map((s) => [s.id, s.name]),
      );
      const counts = new Map<string, number>();
      for (const s of must(studentRows) as { class_id: string }[])
        counts.set(s.class_id, (counts.get(s.class_id) ?? 0) + 1);
      return rows.map((r) => ({
        id: r.id,
        schoolId: r.school_id,
        name: r.name,
        grade: Number(r.grade),
        waliStaffId: r.wali_staff_id,
        waliName: names.get(r.wali_staff_id as string) ?? null,
        studentCount: counts.get(r.id as string) ?? 0,
      }));
    }
    case "upsertClass": {
      requireAdmin(p);
      const name = String(data.name ?? "").trim();
      if (!name) throw new Error("Nama kelas wajib");
      const row = { name, grade: Number(data.grade), wali_staff_id: data.waliStaffId || null };
      if (row.wali_staff_id) {
        must(
          await db
            .from("staff")
            .select("id")
            .eq("id", row.wali_staff_id)
            .eq("school_id", schoolId)
            .single(),
        );
      }
      if (data.id) {
        must(
          await db
            .from("classes")
            .update(row)
            .eq("id", data.id)
            .eq("school_id", schoolId)
            .select("id")
            .single(),
        );
        return { id: data.id };
      }
      return must(
        await db
          .from("classes")
          .insert({ id: id("cls"), school_id: schoolId, ...row })
          .select("id")
          .single(),
      );
    }
    case "deleteClass": {
      requireAdmin(p);
      must(await db.from("classes").delete().eq("id", data.id).eq("school_id", schoolId));
      return { ok: true };
    }
    case "listSubjects": {
      const rows = must(
        await db
          .from("subjects")
          .select("id,school_id,name,code")
          .eq("school_id", schoolId)
          .order("name"),
      );
      return rows.map((s) => ({ id: s.id, schoolId: s.school_id, name: s.name, code: s.code }));
    }
    case "upsertSubject": {
      requireAdmin(p);
      const name = String(data.name ?? "").trim();
      const code = String(data.code ?? "")
        .trim()
        .toUpperCase();
      if (!name || !code) throw new Error("Nama dan kode wajib");
      if (data.id) {
        must(
          await db
            .from("subjects")
            .update({ name, code })
            .eq("id", data.id)
            .eq("school_id", schoolId)
            .select("id")
            .single(),
        );
        return { id: data.id };
      }
      return must(
        await db
          .from("subjects")
          .insert({ id: id("sub"), school_id: schoolId, name, code })
          .select("id")
          .single(),
      );
    }
    case "deleteSubject": {
      requireAdmin(p);
      must(await db.from("subjects").delete().eq("id", data.id).eq("school_id", schoolId));
      return { ok: true };
    }
    case "listStudents": {
      let query = db
        .from("students")
        .select("id,school_id,class_id,name,nis,gender")
        .eq("school_id", schoolId);
      if (data.classId) query = query.eq("class_id", data.classId);
      const rows = must(await query.order("name")) as Record<string, unknown>[];
      const classIds = [...new Set(rows.map((r) => r.class_id as string))];
      const classes = classIds.length
        ? (must(await db.from("classes").select("id,name").in("id", classIds)) as { id: string; name: string }[])
        : [];
      const classNames = new Map(classes.map((c) => [c.id, c.name]));
      return rows.map((r) => ({
        id: r.id,
        schoolId: r.school_id,
        classId: r.class_id,
        className: classNames.get(r.class_id as string),
        name: r.name,
        nis: r.nis,
        gender: r.gender,
      }));
    }
    case "upsertStudent": {
      requireAdmin(p);
      const name = String(data.name ?? "").trim();
      const nis = String(data.nis ?? "").trim();
      if (!name || !nis) throw new Error("Nama dan NIS wajib");
      must(
        await db
          .from("classes")
          .select("id")
          .eq("id", data.classId)
          .eq("school_id", schoolId)
          .single(),
      );
      const row = { class_id: data.classId, name, nis, gender: data.gender };
      if (data.id) {
        must(
          await db
            .from("students")
            .update(row)
            .eq("id", data.id)
            .eq("school_id", schoolId)
            .select("id")
            .single(),
        );
        return { id: data.id };
      }
      return must(
        await db
          .from("students")
          .insert({ id: id("std"), school_id: schoolId, ...row })
          .select("id")
          .single(),
      );
    }
    case "deleteStudent": {
      requireAdmin(p);
      must(await db.from("students").delete().eq("id", data.id).eq("school_id", schoolId));
      return { ok: true };
    }
    case "listSchedules": {
      const rows = must(
        await db
          .from("schedules")
          .select("*")
          .eq("school_id", schoolId)
          .order("day_of_week")
          .order("period"),
      ) as Record<string, unknown>[];
      return withSchedules(db, rows);
    }
    case "upsertSchedule": {
      requireAdmin(p);
      const [classRow, subjectRow, teacherRow] = await Promise.all([
        db.from("classes").select("id").eq("id", data.classId).eq("school_id", schoolId).single(),
        db
          .from("subjects")
          .select("id")
          .eq("id", data.subjectId)
          .eq("school_id", schoolId)
          .single(),
        db
          .from("staff")
          .select("id")
          .eq("id", data.teacherStaffId)
          .eq("school_id", schoolId)
          .single(),
      ]);
      must(classRow);
      must(subjectRow);
      must(teacherRow);
      const row = {
        class_id: data.classId,
        subject_id: data.subjectId,
        teacher_staff_id: data.teacherStaffId,
        day_of_week: Number(data.dayOfWeek),
        period: Number(data.period),
        start_time: data.startTime,
        end_time: data.endTime,
      };
      if (data.id) {
        must(
          await db
            .from("schedules")
            .update(row)
            .eq("id", data.id)
            .eq("school_id", schoolId)
            .select("id")
            .single(),
        );
        return { id: data.id };
      }
      return must(
        await db
          .from("schedules")
          .insert({ id: id("sch"), school_id: schoolId, ...row })
          .select("id")
          .single(),
      );
    }
    case "deleteSchedule": {
      requireAdmin(p);
      must(await db.from("schedules").delete().eq("id", data.id).eq("school_id", schoolId));
      return { ok: true };
    }
    case "clockIn": {
      requireTeacher(p);
      const today = todayWib();
      const existing = must(
        await db
          .from("teacher_attendance")
          .select("*")
          .eq("staff_id", staffId)
          .eq("date", today)
          .maybeSingle(),
      );
      if (existing?.check_in_at) throw new Error("Anda sudah absen masuk hari ini");
      if (existing && ["izin", "cuti"].includes(existing.status))
        throw new Error("Hari ini tercatat izin/cuti");
      const approved = must(
        await db
          .from("leave_requests")
          .select("id")
          .eq("staff_id", staffId)
          .eq("status", "approved")
          .lte("start_date", today)
          .gte("end_date", today)
          .limit(1),
      );
      if (approved.length) throw new Error("Pengajuan izin/cuti Anda disetujui untuk hari ini");
      if (existing)
        must(
          await db
            .from("teacher_attendance")
            .update({ check_in_at: new Date().toISOString(), status: "hadir" })
            .eq("id", existing.id),
        );
      else
        must(
          await db
            .from("teacher_attendance")
            .insert({
              id: id("tat"),
              school_id: schoolId,
              staff_id: staffId,
              date: today,
              check_in_at: new Date().toISOString(),
              status: "hadir",
            }),
        );
      return { ok: true };
    }
    case "clockOut": {
      requireTeacher(p);
      const existing = must(
        await db
          .from("teacher_attendance")
          .select("*")
          .eq("staff_id", staffId)
          .eq("date", todayWib())
          .maybeSingle(),
      );
      if (!existing?.check_in_at) throw new Error("Absen masuk dulu sebelum pulang");
      if (existing.check_out_at) throw new Error("Anda sudah absen pulang");
      must(
        await db
          .from("teacher_attendance")
          .update({ check_out_at: new Date().toISOString() })
          .eq("id", existing.id),
      );
      return { ok: true };
    }
    case "listTeacherAttendance": {
      requireAdmin(p);
      let query = db
        .from("teacher_attendance")
        .select("*")
        .eq("school_id", schoolId)
        .gte("date", data.from)
        .lte("date", data.to);
      if (data.staffId) query = query.eq("staff_id", data.staffId);
      const rows = must(await query.order("date", { ascending: false })) as Record<
        string,
        unknown
      >[];
      const staffIds = [...new Set(rows.map((r) => r.staff_id as string))];
      const names = staffIds.length
        ? (must(await db.from("staff").select("id,name").in("id", staffIds)) as {
            id: string;
            name: string;
          }[])
        : [];
      const nameById = new Map(names.map((x) => [x.id, x.name]));
      return rows.map((r) => ({
        id: r.id,
        staffId: r.staff_id,
        staffName: nameById.get(r.staff_id as string) ?? "",
        date: dateString(r.date),
        checkInAt: iso(r.check_in_at),
        checkOutAt: iso(r.check_out_at),
        status: r.status,
        note: r.note,
      }));
    }
    case "submitLeave": {
      requireTeacher(p);
      const reason = String(data.reason ?? "").trim();
      const startDate = String(data.startDate ?? "");
      const endDate = String(data.endDate ?? "");
      if (!reason) throw new Error("Alasan wajib diisi");
      if (endDate < startDate) throw new Error("Tanggal selesai tidak valid");
      if (data.type !== "izin" && data.type !== "cuti") throw new Error("Jenis izin tidak valid");
      return must(
        await db
          .from("leave_requests")
          .insert({
            id: id("lvr"),
            school_id: schoolId,
            staff_id: staffId,
            type: data.type,
            start_date: startDate,
            end_date: endDate,
            reason,
            status: "pending",
          })
          .select("id")
          .single(),
      );
    }
    case "listLeaves": {
      const mine = Boolean(data.mine) || !p.staff.isAdmin;
      let query = db
        .from("leave_requests")
        .select("*")
        .eq(mine ? "staff_id" : "school_id", mine ? staffId : schoolId);
      const rows = must(await query.order("created_at", { ascending: false })) as Record<
        string,
        unknown
      >[];
      const staffIds = [
        ...new Set(rows.flatMap((r) => [r.staff_id, r.reviewed_by].filter(Boolean) as string[])),
      ];
      const names = staffIds.length
        ? must(await db.from("staff").select("id,name").in("id", staffIds))
        : [];
      const nameById = new Map(
        (names as { id: string; name: string }[]).map((x) => [x.id, x.name]),
      );
      return rows.map((l) => ({
        id: l.id,
        staffId: l.staff_id,
        staffName: nameById.get(l.staff_id as string) ?? "",
        type: l.type,
        startDate: dateString(l.start_date),
        endDate: dateString(l.end_date),
        reason: l.reason,
        status: l.status,
        reviewedByName: nameById.get(l.reviewed_by as string) ?? null,
        createdAt: iso(l.created_at) ?? "",
      }));
    }
    case "reviewLeave": {
      requireAdmin(p);
      if (!["approved", "rejected"].includes(String(data.status)))
        throw new Error("Status tidak valid");
      const leave = must(
        await db
          .from("leave_requests")
          .select("*")
          .eq("id", data.id)
          .eq("school_id", schoolId)
          .single(),
      );
      if (leave.status !== "pending") throw new Error("Pengajuan sudah diproses");
      must(
        await db
          .from("leave_requests")
          .update({
            status: data.status,
            reviewed_by: staffId,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", leave.id),
      );
      if (data.status === "approved") {
        for (
          let date = new Date(`${dateString(leave.start_date)}T04:00:00+07:00`),
            end = new Date(`${dateString(leave.end_date)}T04:00:00+07:00`);
          date <= end;
          date = new Date(date.getTime() + 86400000)
        ) {
          const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(date);
          must(
            await db.from("teacher_attendance").upsert(
              {
                id: id("tat"),
                school_id: schoolId,
                staff_id: leave.staff_id,
                date: day,
                status: leave.type,
                note: "Disetujui dari pengajuan",
                check_in_at: null,
                check_out_at: null,
              },
              { onConflict: "staff_id,date" },
            ),
          );
        }
      }
      return { ok: true };
    }
    case "getTeachingDay": {
      requireTeacher(p);
      const date = String(data.date || todayWib());
      const [year, month, day] = date.split("-").map(Number);
      const dow = dayWib(new Date(Date.UTC(year!, month! - 1, day!, 4)));
      const rows = must(
        await db
          .from("schedules")
          .select("*")
          .eq("teacher_staff_id", staffId)
          .eq("day_of_week", dow)
          .order("period"),
      ) as Record<string, unknown>[];
      return { date, dayOfWeek: dow, schedules: await withSchedules(db, rows) };
    }
    case "getRoster": {
      requireTeacher(p);
      const schedule = must(
        await db
          .from("schedules")
          .select("*")
          .eq("id", data.scheduleId)
          .eq("school_id", schoolId)
          .single(),
      );
      if (schedule.teacher_staff_id !== staffId && !p.staff.isAdmin)
        throw new Error("Anda bukan pengampu jam ini");
      const students = must(
        await db
          .from("students")
          .select("id,name,nis,gender")
          .eq("class_id", schedule.class_id)
          .order("name"),
      ) as Record<string, unknown>[];
      const marks = must(
        await db
          .from("student_attendance")
          .select("id,student_id,status,note")
          .eq("schedule_id", data.scheduleId)
          .eq("date", data.date),
      ) as Record<string, unknown>[];
      const markByStudent = new Map(marks.map((m) => [m.student_id, m]));
      return students.map((s) => {
        const mark = markByStudent.get(s.id);
        return {
          studentId: s.id,
          name: s.name,
          nis: s.nis,
          gender: s.gender,
          status: mark?.status ?? null,
          note: mark?.note ?? null,
          attendanceId: mark?.id ?? null,
        };
      });
    }
    case "saveStudentAttendance": {
      requireTeacher(p);
      const schedule = must(
        await db
          .from("schedules")
          .select("*")
          .eq("id", data.scheduleId)
          .eq("school_id", schoolId)
          .single(),
      );
      if (schedule.teacher_staff_id !== staffId && !p.staff.isAdmin)
        throw new Error("Anda bukan pengampu jam ini");
      const marks = Array.isArray(data.marks) ? (data.marks as Record<string, unknown>[]) : [];
      const rosterIds = new Set(
        (
          must(await db.from("students").select("id").eq("class_id", schedule.class_id)) as {
            id: string;
          }[]
        ).map((student) => student.id),
      );
      const rows = marks.map((mark) => {
        if (!["hadir", "sakit", "izin", "alpha", "cuti"].includes(String(mark.status)))
          throw new Error("Status absensi tidak valid");
        if (typeof mark.studentId !== "string" || !rosterIds.has(mark.studentId))
          throw new Error("Murid tidak termasuk kelas pada jadwal ini");
        return {
          id: id("sat"),
          school_id: schoolId,
          student_id: mark.studentId,
          schedule_id: data.scheduleId,
          teacher_staff_id: staffId,
          date: data.date,
          status: mark.status,
          note: mark.note ?? null,
        };
      });
      if (rows.length)
        must(
          await db
            .from("student_attendance")
            .upsert(rows, { onConflict: "student_id,schedule_id,date" }),
        );
      return { ok: true, count: marks.length };
    }
    case "getStudentRecap": {
      let classId = data.classId as string | undefined;
      if (!p.staff.isAdmin) {
        if (!p.staff.isWali || !p.waliClass)
          throw new Error("Hanya wali kelas yang dapat melihat rekap ini");
        classId = p.waliClass.id as string;
      }
      if (!classId) throw new Error("Pilih kelas");
      must(
        await db.from("classes").select("id").eq("id", classId).eq("school_id", schoolId).single(),
      );
      let query = db
        .from("student_attendance")
        .select(
          "status,student_id,students!inner(id,name,nis,class_id,classes!inner(name)),schedules!inner(subject_id,subjects!inner(name))",
        )
        .eq("students.class_id", classId)
        .gte("date", data.from)
        .lte("date", data.to);
      if (data.subjectId) query = query.eq("schedules.subject_id", data.subjectId);
      const rows = must(await query) as Record<string, unknown>[];
      const summaries = new Map<string, Record<string, unknown>>();
      for (const row of rows) {
        const student = row.students as Record<string, unknown>;
        const schedule = row.schedules as Record<string, unknown>;
        const subject = schedule.subjects as Record<string, unknown>;
        const cls = student.classes as Record<string, unknown>;
        const key = `${student.id}:${subject.name}`;
        const summary = summaries.get(key) ?? {
          studentId: student.id,
          studentName: student.name,
          nis: student.nis,
          className: cls.name,
          subjectName: subject.name,
          hadir: 0,
          sakit: 0,
          izin: 0,
          alpha: 0,
          total: 0,
        };
        const status = String(row.status);
        if (status in summary) summary[status] = Number(summary[status]) + 1;
        summary.total = Number(summary.total) + 1;
        summaries.set(key, summary);
      }
      return [...summaries.values()].map((r) => ({
        ...r,
        percent: Number(r.total) ? Math.round((Number(r.hadir) / Number(r.total)) * 1000) / 10 : 0,
      }));
    }
    default:
      throw new Error(`Operasi tidak dikenal: ${action}`);
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return fail("Method tidak didukung", 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return fail("Unauthorized", 401);
  const token = authorization.slice("Bearer ".length);
  const auth = createClient(supabaseUrl!, anonKey!, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: authError } = await auth.auth.getUser(token);
  if (authError || !userData.user) return fail("Unauthorized", 401);

  let body: { action?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("JSON request tidak valid");
  }
  if (typeof body.action !== "string" || !/^[A-Za-z][A-Za-z0-9]*$/.test(body.action))
    return fail("Operasi tidak valid");
  const input =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : {};

  const db = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  try {
    const profile = await getProfile(db, userData.user);
    const result = await dispatch(db, profile, body.action, input);
    return Response.json(result, { headers });
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(`[school-api:${body.action}] database operation failed:`, error.message);
      return fail("Terjadi kesalahan saat memproses data.", 500);
    }
    const message = error instanceof Error ? error.message : "Permintaan gagal";
    console.error(`[school-api:${body.action}] request failed:`, message);
    return fail(message, 400);
  }
});
