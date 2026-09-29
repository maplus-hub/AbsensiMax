import { authClient } from "@/lib/auth/client";
import type {
  AttendanceStatus,
  DashboardData,
  LeaveType,
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

type Invocation = { data: Record<string, unknown> };

async function invoke<T>(action: string, data: Record<string, unknown> = {}): Promise<T> {
  const { data: result, error } = await authClient.functions.invoke<T>("school-api", {
    body: { action, data },
  });
  if (error) {
    if ("context" in error && error.context instanceof Response) {
      const body: unknown = await error.context
        .clone()
        .json()
        .catch(() => null);
      if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
        throw new Error(body.error);
      }
    }
    throw error;
  }
  if (result === null) throw new Error("Server mengembalikan jawaban kosong");
  return result;
}

export function bootstrapSession(): Promise<SessionProfile> {
  return invoke("bootstrapSession");
}

export function getDashboard(): Promise<DashboardData> {
  return invoke("getDashboard");
}

export function listStaff(): Promise<Staff[]> {
  return invoke("listStaff");
}

export function upsertStaff({
  data,
}: Invocation & {
  data: {
    id?: string;
    name: string;
    email: string;
    nip?: string;
    phone?: string;
    isAdmin: boolean;
    isGuru: boolean;
    isWali: boolean;
  };
}): Promise<{ id: string }> {
  return invoke("upsertStaff", data);
}

export function setStaffActive({
  data,
}: Invocation & { data: { id: string; active: boolean } }): Promise<{ ok: true }> {
  return invoke("setStaffActive", data);
}

export function listClasses(): Promise<SchoolClass[]> {
  return invoke("listClasses");
}

export function upsertClass({
  data,
}: Invocation & {
  data: { id?: string; name: string; grade: number; waliStaffId?: string | null };
}): Promise<{ id: string }> {
  return invoke("upsertClass", data);
}

export function deleteClass({
  data,
}: Invocation & { data: { id: string } }): Promise<{ ok: true }> {
  return invoke("deleteClass", data);
}

export function listSubjects(): Promise<Subject[]> {
  return invoke("listSubjects");
}

export function upsertSubject({
  data,
}: Invocation & {
  data: { id?: string; name: string; code: string };
}): Promise<{ id: string }> {
  return invoke("upsertSubject", data);
}

export function deleteSubject({
  data,
}: Invocation & { data: { id: string } }): Promise<{ ok: true }> {
  return invoke("deleteSubject", data);
}

export function listStudents({ data = {} }: { data?: { classId?: string } } = {}): Promise<
  Student[]
> {
  return invoke("listStudents", data);
}

export function upsertStudent({
  data,
}: Invocation & {
  data: { id?: string; classId: string; name: string; nis: string; gender: "L" | "P" };
}): Promise<{ id: string }> {
  return invoke("upsertStudent", data);
}

export function deleteStudent({
  data,
}: Invocation & { data: { id: string } }): Promise<{ ok: true }> {
  return invoke("deleteStudent", data);
}

export function listSchedules(): Promise<Schedule[]> {
  return invoke("listSchedules");
}

export function upsertSchedule({
  data,
}: Invocation & {
  data: {
    id?: string;
    classId: string;
    subjectId: string;
    teacherStaffId: string;
    dayOfWeek: number;
    period: number;
    startTime: string;
    endTime: string;
  };
}): Promise<{ id: string }> {
  return invoke("upsertSchedule", data);
}

export function deleteSchedule({
  data,
}: Invocation & { data: { id: string } }): Promise<{ ok: true }> {
  return invoke("deleteSchedule", data);
}

export function clockIn(): Promise<{ ok: true }> {
  return invoke("clockIn");
}

export function clockOut(): Promise<{ ok: true }> {
  return invoke("clockOut");
}

export function listTeacherAttendance({
  data,
}: Invocation & {
  data: { from: string; to: string; staffId?: string };
}): Promise<TeacherAttendance[]> {
  return invoke("listTeacherAttendance", data);
}

export function submitLeave({
  data,
}: Invocation & {
  data: { type: LeaveType; startDate: string; endDate: string; reason: string };
}): Promise<{ id: string }> {
  return invoke("submitLeave", data);
}

export function listLeaves({ data = {} }: { data?: { mine?: boolean } } = {}): Promise<
  DashboardData["recentLeaves"]
> {
  return invoke("listLeaves", data);
}

export function reviewLeave({
  data,
}: Invocation & {
  data: { id: string; status: "approved" | "rejected" };
}): Promise<{ ok: true }> {
  return invoke("reviewLeave", data);
}

export function getTeachingDay({ data = {} }: { data?: { date?: string } } = {}): Promise<{
  date: string;
  dayOfWeek: number;
  schedules: Schedule[];
}> {
  return invoke("getTeachingDay", data);
}

export function getRoster({
  data,
}: Invocation & { data: { scheduleId: string; date: string } }): Promise<RosterRow[]> {
  return invoke("getRoster", data);
}

export function saveStudentAttendance({
  data,
}: Invocation & {
  data: {
    scheduleId: string;
    date: string;
    marks: { studentId: string; status: AttendanceStatus; note?: string }[];
  };
}): Promise<{ ok: true; count: number }> {
  return invoke("saveStudentAttendance", data);
}

export function getStudentRecap({
  data,
}: Invocation & {
  data: { from: string; to: string; subjectId?: string; classId?: string };
}): Promise<StudentRecapRow[]> {
  return invoke("getStudentRecap", data);
}
