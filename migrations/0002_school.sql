-- AbsensiMax school attendance schema

create table if not exists schools (
  id text primary key,
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists staff (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  user_id text,
  name text not null,
  email text,
  nip text,
  phone text,
  is_admin boolean not null default false,
  is_guru boolean not null default false,
  is_wali boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists staff_user_id_uidx
  on staff (user_id) where user_id is not null;
create unique index if not exists staff_school_email_uidx
  on staff (school_id, lower(email)) where email is not null;
create index if not exists staff_school_idx on staff (school_id);

create table if not exists classes (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  name text not null,
  grade int not null,
  wali_staff_id text references staff(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists classes_school_idx on classes (school_id);

create table if not exists subjects (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  name text not null,
  code text not null,
  created_at timestamptz not null default now()
);
create index if not exists subjects_school_idx on subjects (school_id);

create table if not exists students (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  class_id text not null references classes(id) on delete cascade,
  name text not null,
  nis text not null,
  gender text not null default 'L',
  created_at timestamptz not null default now()
);
create index if not exists students_class_idx on students (class_id);

create table if not exists schedules (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  class_id text not null references classes(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  teacher_staff_id text not null references staff(id) on delete cascade,
  day_of_week int not null,
  period int not null,
  start_time text not null,
  end_time text not null,
  created_at timestamptz not null default now()
);
create index if not exists schedules_teacher_idx on schedules (teacher_staff_id);
create index if not exists schedules_class_day_idx on schedules (class_id, day_of_week);

create table if not exists teacher_attendance (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  staff_id text not null references staff(id) on delete cascade,
  date date not null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  status text not null default 'hadir',
  note text,
  created_at timestamptz not null default now(),
  unique (staff_id, date)
);
create index if not exists teacher_attendance_school_date_idx
  on teacher_attendance (school_id, date);

create table if not exists leave_requests (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  staff_id text not null references staff(id) on delete cascade,
  type text not null,
  start_date date not null,
  end_date date not null,
  reason text not null,
  status text not null default 'pending',
  reviewed_by text references staff(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists leave_requests_school_status_idx
  on leave_requests (school_id, status);

create table if not exists student_attendance (
  id text primary key,
  school_id text not null references schools(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  schedule_id text not null references schedules(id) on delete cascade,
  teacher_staff_id text not null references staff(id) on delete cascade,
  date date not null,
  status text not null,
  note text,
  created_at timestamptz not null default now(),
  unique (student_id, schedule_id, date)
);
create index if not exists student_attendance_school_date_idx
  on student_attendance (school_id, date);
create index if not exists student_attendance_student_idx
  on student_attendance (student_id);
