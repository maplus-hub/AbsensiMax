export type Role = "admin" | "guru" | "wali";

export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpha" | "cuti";
export type LeaveType = "izin" | "cuti";
export type LeaveStatus = "pending" | "approved" | "rejected";

export type School = {
  id: string;
  name: string;
  address: string | null;
};

export type Staff = {
  id: string;
  schoolId: string;
  userId: string | null;
  name: string;
  email: string | null;
  nip: string | null;
  phone: string | null;
  isAdmin: boolean;
  isGuru: boolean;
  isWali: boolean;
  active: boolean;
};

export type SchoolClass = {
  id: string;
  schoolId: string;
  name: string;
  grade: number;
  waliStaffId: string | null;
  waliName: string | null;
  studentCount: number;
};

export type Subject = {
  id: string;
  schoolId: string;
  name: string;
  code: string;
};

export type Student = {
  id: string;
  schoolId: string;
  classId: string;
  className?: string;
  name: string;
  nis: string;
  gender: "L" | "P";
};

export type Schedule = {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherStaffId: string;
  teacherName: string;
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
};

export type TeacherAttendance = {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  status: AttendanceStatus;
  note: string | null;
};

export type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedByName: string | null;
  createdAt: string;
};

export type StudentAttendance = {
  id: string;
  studentId: string;
  studentName: string;
  nis: string;
  scheduleId: string;
  subjectName: string;
  date: string;
  status: AttendanceStatus;
  note: string | null;
};

export type RosterRow = {
  studentId: string;
  name: string;
  nis: string;
  gender: "L" | "P";
  status: AttendanceStatus | null;
  note: string | null;
  attendanceId: string | null;
};

export type SessionProfile = {
  userId: string;
  school: School;
  staff: Staff;
  waliClass: SchoolClass | null;
  roles: Role[];
};

export type DashboardData = {
  profile: SessionProfile;
  today: string;
  teacherToday: TeacherAttendance | null;
  todaySchedules: Schedule[];
  pendingLeaves: number;
  teacherSummary: { hadir: number; izin: number; cuti: number; alpha: number; total: number };
  classSummary: { hadir: number; sakit: number; izin: number; alpha: number; total: number } | null;
  recentLeaves: LeaveRequest[];
};

export type StudentRecapRow = {
  studentId: string;
  studentName: string;
  nis: string;
  className: string;
  subjectName: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  total: number;
  percent: number;
};

export const STATUS_LABEL: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpha: "Alpha",
  cuti: "Cuti",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  guru: "Guru",
  wali: "Wali Kelas",
};
