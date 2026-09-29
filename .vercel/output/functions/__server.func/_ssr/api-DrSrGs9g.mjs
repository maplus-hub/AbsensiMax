import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DLoU5_4Q.mjs";
import { c as nid, d as weekdayDatesWib, f as wibDayOfWeek, u as todayWib } from "./utils-DIMIJOCd.mjs";
import { t as authMiddleware } from "./middleware-DK5aLf6n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DrSrGs9g.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var PERIODS = [
	{
		period: 1,
		start: "07:00",
		end: "07:40"
	},
	{
		period: 2,
		start: "07:40",
		end: "08:20"
	},
	{
		period: 3,
		start: "08:20",
		end: "09:00"
	},
	{
		period: 4,
		start: "09:20",
		end: "10:00"
	},
	{
		period: 5,
		start: "10:00",
		end: "10:40"
	},
	{
		period: 6,
		start: "10:40",
		end: "11:20"
	}
];
var SUBJECTS = [
	{
		code: "MTK",
		name: "Matematika"
	},
	{
		code: "BIN",
		name: "Bahasa Indonesia"
	},
	{
		code: "BIG",
		name: "Bahasa Inggris"
	},
	{
		code: "IPA",
		name: "Ilmu Pengetahuan Alam"
	},
	{
		code: "IPS",
		name: "Ilmu Pengetahuan Sosial"
	},
	{
		code: "PKN",
		name: "Pendidikan Pancasila"
	},
	{
		code: "PJOK",
		name: "Pendidikan Jasmani"
	},
	{
		code: "SBK",
		name: "Seni Budaya"
	}
];
var CLASS_STUDENTS = {
	"7A": [
		{
			name: "Alya Putri Rahma",
			gender: "P"
		},
		{
			name: "Bima Arya Pratama",
			gender: "L"
		},
		{
			name: "Citra Lestari",
			gender: "P"
		},
		{
			name: "Dimas Wahyu Nugroho",
			gender: "L"
		},
		{
			name: "Eka Nurhaliza",
			gender: "P"
		},
		{
			name: "Fajar Maulana",
			gender: "L"
		},
		{
			name: "Gita Savira",
			gender: "P"
		},
		{
			name: "Hendra Wijaya",
			gender: "L"
		}
	],
	"7B": [
		{
			name: "Kirana Ayu",
			gender: "P"
		},
		{
			name: "Lutfi Ramadhan",
			gender: "L"
		},
		{
			name: "Maya Salsabila",
			gender: "P"
		},
		{
			name: "Naufal Rizki",
			gender: "L"
		},
		{
			name: "Olivia Zahra",
			gender: "P"
		},
		{
			name: "Putra Aditya",
			gender: "L"
		}
	],
	"8A": [
		{
			name: "Sinta Dewi",
			gender: "P"
		},
		{
			name: "Tegar Prakoso",
			gender: "L"
		},
		{
			name: "Umi Kalsum",
			gender: "P"
		},
		{
			name: "Vino Saputra",
			gender: "L"
		},
		{
			name: "Wulan Dari",
			gender: "P"
		},
		{
			name: "Yoga Kurniawan",
			gender: "L"
		}
	]
};
function pick(arr, i) {
	return arr[i % arr.length];
}
function randStatus(seed) {
	const n = (seed * 17 + 31) % 100;
	if (n < 86) return "hadir";
	if (n < 92) return "sakit";
	if (n < 97) return "izin";
	return "alpha";
}
async function insertChunk(sql, tableSql, rows, chunkSize = 80) {
	for (let i = 0; i < rows.length; i += chunkSize) {
		const chunk = rows.slice(i, i + chunkSize);
		const cols = chunk[0]?.length ?? 0;
		const placeholders = chunk.map((row, ri) => `(${row.map((_, ci) => `$${ri * cols + ci + 1}`).join(",")})`).join(",");
		const params = chunk.flat();
		await sql.query(`${tableSql} values ${placeholders}`, params);
	}
}
async function seedSchool(sql, args) {
	const { schoolId, admin } = args;
	await sql`
    insert into schools (id, name, address)
    values (${schoolId}, ${"SMP Harapan Nusantara"}, ${"Jl. Pendidikan No. 12, Jakarta Selatan"})
  `;
	const teachers = [
		{
			id: admin.id,
			name: admin.name,
			email: admin.email ?? "admin@harapannusantara.sch.id",
			nip: "19880512 201001 1 001",
			isAdmin: true,
			isGuru: true,
			isWali: true
		},
		{
			id: nid("stf"),
			name: "Rina Wulandari",
			email: "rina.wulandari@harapannusantara.sch.id",
			nip: "19900218 201402 2 003",
			isAdmin: false,
			isGuru: true,
			isWali: true
		},
		{
			id: nid("stf"),
			name: "Budi Santoso",
			email: "budi.santoso@harapannusantara.sch.id",
			nip: "19841103 200903 1 007",
			isAdmin: false,
			isGuru: true,
			isWali: false
		},
		{
			id: nid("stf"),
			name: "Sari Melati",
			email: "sari.melati@harapannusantara.sch.id",
			nip: "19930621 201603 2 011",
			isAdmin: false,
			isGuru: true,
			isWali: false
		},
		{
			id: nid("stf"),
			name: "Agus Prasetyo",
			email: "agus.prasetyo@harapannusantara.sch.id",
			nip: "19870109 201201 1 004",
			isAdmin: false,
			isGuru: true,
			isWali: true
		}
	];
	await insertChunk(sql, `insert into staff (id, school_id, user_id, name, email, nip, is_admin, is_guru, is_wali, active)`, teachers.map((t) => [
		t.id,
		schoolId,
		t.id === admin.id ? admin.userId : null,
		t.name,
		t.email,
		t.nip,
		t.isAdmin,
		t.isGuru,
		t.isWali,
		true
	]));
	const classMeta = [
		{
			name: "7A",
			grade: 7,
			wali: teachers[0].id
		},
		{
			name: "7B",
			grade: 7,
			wali: teachers[1].id
		},
		{
			name: "8A",
			grade: 8,
			wali: teachers[4].id
		}
	];
	const classIds = {};
	const classRows = [];
	for (const c of classMeta) {
		const id = nid("cls");
		classIds[c.name] = id;
		classRows.push([
			id,
			schoolId,
			c.name,
			c.grade,
			c.wali
		]);
	}
	await insertChunk(sql, `insert into classes (id, school_id, name, grade, wali_staff_id)`, classRows);
	const subjectIds = {};
	const subjectRows = [];
	for (const s of SUBJECTS) {
		const id = nid("sub");
		subjectIds[s.code] = id;
		subjectRows.push([
			id,
			schoolId,
			s.name,
			s.code
		]);
	}
	await insertChunk(sql, `insert into subjects (id, school_id, name, code)`, subjectRows);
	const studentIds = [];
	const studentRows = [];
	for (const [className, roster] of Object.entries(CLASS_STUDENTS)) {
		const classId = classIds[className];
		let i = 1;
		for (const st of roster) {
			const id = nid("std");
			const nis = `${className.replace(/\D/g, "")}${className.includes("B") ? "02" : "01"}${String(i).padStart(3, "0")}`;
			studentRows.push([
				id,
				schoolId,
				classId,
				st.name,
				nis,
				st.gender
			]);
			studentIds.push({
				id,
				classId
			});
			i += 1;
		}
	}
	await insertChunk(sql, `insert into students (id, school_id, class_id, name, nis, gender)`, studentRows);
	const teacherForSubject = (code, className) => {
		if (code === "MTK") return className === "7A" ? teachers[0].id : teachers[2].id;
		if (code === "BIN") return teachers[1].id;
		if (code === "BIG") return teachers[3].id;
		if (code === "IPA") return teachers[2].id;
		if (code === "IPS") return teachers[4].id;
		if (code === "PKN") return teachers[0].id;
		if (code === "PJOK") return teachers[4].id;
		return teachers[3].id;
	};
	const rotation = [
		"MTK",
		"BIN",
		"BIG",
		"IPA",
		"IPS",
		"PKN",
		"PJOK",
		"SBK"
	];
	const scheduleIds = [];
	const scheduleRows = [];
	for (const className of Object.keys(classIds)) {
		const classId = classIds[className];
		for (let day = 1; day <= 5; day += 1) for (const p of PERIODS) {
			const code = pick(rotation, day * 6 + p.period + className.charCodeAt(1));
			const id = nid("sch");
			const teacherId = teacherForSubject(code, className);
			scheduleRows.push([
				id,
				schoolId,
				classId,
				subjectIds[code],
				teacherId,
				day,
				p.period,
				p.start,
				p.end
			]);
			scheduleIds.push({
				id,
				classId,
				teacherId,
				day
			});
		}
	}
	await insertChunk(sql, `insert into schedules (id, school_id, class_id, subject_id, teacher_staff_id, day_of_week, period, start_time, end_time)`, scheduleRows);
	const dates = weekdayDatesWib(8, 1);
	const teacherAttRows = [];
	for (const t of teachers) for (const [i, date] of dates.entries()) {
		const seed = t.name.length * 13 + i * 7;
		const n = seed % 100;
		const status = n > 96 ? "alpha" : n > 92 ? "izin" : "hadir";
		const checkIn = status === "hadir" ? `${date}T00:${String(40 + seed % 20).padStart(2, "0")}:00+07:00` : null;
		const checkOut = status === "hadir" ? `${date}T07:${String(10 + seed % 40).padStart(2, "0")}:00+07:00` : null;
		teacherAttRows.push([
			nid("tat"),
			schoolId,
			t.id,
			date,
			checkIn,
			checkOut,
			status
		]);
	}
	await insertChunk(sql, `insert into teacher_attendance (id, school_id, staff_id, date, check_in_at, check_out_at, status)`, teacherAttRows);
	const studentsByClass = /* @__PURE__ */ new Map();
	for (const st of studentIds) {
		const list = studentsByClass.get(st.classId) ?? [];
		list.push(st.id);
		studentsByClass.set(st.classId, list);
	}
	const studentAttRows = [];
	for (const date of dates) {
		const [y, m, d] = date.split("-").map(Number);
		const dow = wibDayOfWeek(new Date(Date.UTC(y, m - 1, d, 4)));
		for (const sch of scheduleIds.filter((s) => s.day === dow)) {
			const roster = studentsByClass.get(sch.classId) ?? [];
			for (const [si, studentId] of roster.entries()) studentAttRows.push([
				nid("sat"),
				schoolId,
				studentId,
				sch.id,
				sch.teacherId,
				date,
				randStatus(si * 11 + sch.day * 3 + date.length * 5)
			]);
		}
	}
	await insertChunk(sql, `insert into student_attendance (id, school_id, student_id, schedule_id, teacher_staff_id, date, status)`, studentAttRows);
	const last = dates[dates.length - 1];
	await sql`
    insert into leave_requests (id, school_id, staff_id, type, start_date, end_date, reason, status)
    values (
      ${nid("lvr")}, ${schoolId}, ${teachers[2].id}, ${"izin"}, ${last}::date, ${last}::date,
      ${"Mengantar orang tua ke rumah sakit"}, ${"pending"}
    )
  `;
	await sql`
    insert into leave_requests (id, school_id, staff_id, type, start_date, end_date, reason, status, reviewed_by, reviewed_at)
    values (
      ${nid("lvr")}, ${schoolId}, ${teachers[3].id}, ${"cuti"}, ${dates[0]}::date, ${dates[1] ?? dates[0]}::date,
      ${"Cuti tahunan keperluan keluarga"}, ${"approved"}, ${admin.id}, ${`${dates[0]}T01:00:00+07:00`}
    )
  `;
}
function asBool(v) {
	return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}
function mapStaff(r) {
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
		active: asBool(r.active)
	};
}
function rolesOf(s) {
	const roles = [];
	if (s.isAdmin) roles.push("admin");
	if (s.isGuru) roles.push("guru");
	if (s.isWali) roles.push("wali");
	return roles;
}
function iso(v) {
	if (!v) return null;
	if (v instanceof Date) return v.toISOString();
	return String(v);
}
function dateStr(v) {
	if (!v) return "";
	if (typeof v === "string") return v.slice(0, 10);
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	return String(v).slice(0, 10);
}
async function authUser(userId) {
	const u = (await (await getSql())`
    select id, name, email from "user" where id = ${userId} limit 1
  `)[0];
	if (!u) return {
		id: userId,
		name: "Pengguna",
		email: ""
	};
	return u;
}
async function loadProfile(userId) {
	const sql = await getSql();
	const row = (await sql`
    select s.*, sc.name as school_name, sc.address as school_address
    from staff s
    join schools sc on sc.id = s.school_id
    where s.user_id = ${userId} and s.active = true
    limit 1
  `)[0];
	if (!row) throw new Error("Akun belum terhubung ke sekolah");
	const staff = mapStaff(row);
	let waliClass = null;
	if (staff.isWali) {
		const c = (await sql`
      select c.id, c.school_id, c.name, c.grade, c.wali_staff_id,
        (select count(*)::int from students st where st.class_id = c.id) as cnt
      from classes c
      where c.wali_staff_id = ${staff.id}
      limit 1
    `)[0];
		if (c) waliClass = {
			id: c.id,
			schoolId: c.school_id,
			name: c.name,
			grade: Number(c.grade),
			waliStaffId: c.wali_staff_id,
			waliName: staff.name,
			studentCount: Number(c.cnt)
		};
	}
	return {
		userId,
		school: {
			id: row.school_id,
			name: row.school_name,
			address: row.school_address
		},
		staff,
		waliClass,
		roles: rolesOf(staff)
	};
}
var inflight = /* @__PURE__ */ new Map();
async function ensureProfile(userId) {
	const hit = inflight.get(userId);
	if (hit) return hit;
	const pending = ensureProfileInner(userId).finally(() => inflight.delete(userId));
	inflight.set(userId, pending);
	return pending;
}
async function ensureProfileInner(userId) {
	const sql = await getSql();
	if ((await sql`
    select id from staff where user_id = ${userId} and active = true limit 1
  `)[0]) return loadProfile(userId);
	const user = await authUser(userId);
	if (user.email) {
		const byEmail = await sql`
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
			admin: {
				id: staffId,
				userId,
				name: displayName,
				email: user.email || null
			}
		});
	} catch {
		if ((await sql`
      select id from staff where user_id = ${userId} and active = true limit 1
    `)[0]) return loadProfile(userId);
		throw new Error("Gagal menyiapkan data sekolah");
	}
	return loadProfile(userId);
}
function requireAdmin(p) {
	if (!p.staff.isAdmin) throw new Error("Hanya admin yang dapat melakukan ini");
}
function requireTeacher(p) {
	if (!p.staff.isGuru && !p.staff.isWali && !p.staff.isAdmin) throw new Error("Hanya guru yang dapat melakukan ini");
}
var scheduleSelect = `
  sc.id, sc.school_id, sc.class_id, c.name as class_name,
  sc.subject_id, sub.name as subject_name,
  sc.teacher_staff_id, st.name as teacher_name,
  sc.day_of_week, sc.period, sc.start_time, sc.end_time
`;
function mapSchedule(r) {
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
		endTime: r.end_time
	};
}
var bootstrapSession_createServerFn_handler = createServerRpc({
	id: "30d34d1c91ab4457047f23fc2c35e5fad40e99c5de59390d9f2db5dc76080212",
	name: "bootstrapSession",
	filename: "src/lib/school/api.ts"
}, (opts) => bootstrapSession.__executeServer(opts));
var bootstrapSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(bootstrapSession_createServerFn_handler, async ({ context }) => ensureProfile(context.userId));
var getDashboard_createServerFn_handler = createServerRpc({
	id: "87b0a2010a34598b85c52421cfef183eb2514874cbf203d7c72c059096f574a0",
	name: "getDashboard",
	filename: "src/lib/school/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const profile = await ensureProfile(context.userId);
	const sql = await getSql();
	const today = todayWib();
	const dow = wibDayOfWeek();
	const att = await sql`
      select id, staff_id, date, check_in_at, check_out_at, status, note
      from teacher_attendance
      where staff_id = ${profile.staff.id} and date = ${today}::date
      limit 1
    `;
	const schedules = await sql.query(`select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.teacher_staff_id = $1 and sc.day_of_week = $2
       order by sc.period`, [profile.staff.id, dow]);
	const pending = await sql`
      select count(*)::int as n from leave_requests
      where school_id = ${profile.school.id} and status = 'pending'
    `;
	const tSum = await sql`
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
	let classSummary = null;
	if (profile.waliClass) classSummary = (await sql`
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
      `)[0] ?? {
		hadir: 0,
		sakit: 0,
		izin: 0,
		alpha: 0,
		total: 0
	};
	const leaves = await sql`
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
		teacherToday: a ? {
			id: a.id,
			staffId: a.staff_id,
			staffName: profile.staff.name,
			date: dateStr(a.date),
			checkInAt: iso(a.check_in_at),
			checkOutAt: iso(a.check_out_at),
			status: a.status,
			note: a.note
		} : null,
		todaySchedules: schedules.map(mapSchedule),
		pendingLeaves: Number(pending[0]?.n ?? 0),
		teacherSummary: tSum[0] ?? {
			hadir: 0,
			izin: 0,
			cuti: 0,
			alpha: 0,
			total: 0
		},
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
			createdAt: iso(l.created_at) ?? ""
		}))
	};
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "bb5add275a11266df118101e2ecdc22f5fc22a7999b65119336e6c41795f230f",
	name: "listStaff",
	filename: "src/lib/school/api.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	return (await (await getSql())`
      select * from staff where school_id = ${p.school.id} order by name
    `).map(mapStaff);
});
var upsertStaff_createServerFn_handler = createServerRpc({
	id: "c32f8ab73df332dfda25010929ce8a8dcce12f5e3b1411221de47cd741b8d3d5",
	name: "upsertStaff",
	filename: "src/lib/school/api.ts"
}, (opts) => upsertStaff.__executeServer(opts));
var upsertStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertStaff_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	const sql = await getSql();
	const name = data.name.trim();
	const email = data.email.trim().toLowerCase();
	if (!name || !email) throw new Error("Nama dan email wajib diisi");
	if (!data.isAdmin && !data.isGuru && !data.isWali) throw new Error("Pilih minimal satu peran");
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
var setStaffActive_createServerFn_handler = createServerRpc({
	id: "6df7a3f6747e27934629941f5e861b5d1a6e58f544c18c30b4be1d1281795118",
	name: "setStaffActive",
	filename: "src/lib/school/api.ts"
}, (opts) => setStaffActive.__executeServer(opts));
var setStaffActive = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setStaffActive_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	if (data.id === p.staff.id) throw new Error("Tidak dapat menonaktifkan akun sendiri");
	await (await getSql())`
      update staff set active = ${data.active}
      where id = ${data.id} and school_id = ${p.school.id}
    `;
	return { ok: true };
});
var listClasses_createServerFn_handler = createServerRpc({
	id: "83d61245d96baba55fda991bf3f24e3d10c690834ef02932fdd7bb661e0887dd",
	name: "listClasses",
	filename: "src/lib/school/api.ts"
}, (opts) => listClasses.__executeServer(opts));
var listClasses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClasses_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	return (await (await getSql())`
      select c.id, c.school_id, c.name, c.grade, c.wali_staff_id, st.name as wali_name,
        (select count(*)::int from students s where s.class_id = c.id) as cnt
      from classes c
      left join staff st on st.id = c.wali_staff_id
      where c.school_id = ${p.school.id}
      order by c.grade, c.name
    `).map((c) => ({
		id: c.id,
		schoolId: c.school_id,
		name: c.name,
		grade: Number(c.grade),
		waliStaffId: c.wali_staff_id,
		waliName: c.wali_name,
		studentCount: Number(c.cnt)
	}));
});
var upsertClass_createServerFn_handler = createServerRpc({
	id: "40f59fc8d4d20a9d5dad6134fca3c4ec4238be450da0ccd765823ddf7c211aa0",
	name: "upsertClass",
	filename: "src/lib/school/api.ts"
}, (opts) => upsertClass.__executeServer(opts));
var upsertClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertClass_createServerFn_handler, async ({ context, data }) => {
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
var deleteClass_createServerFn_handler = createServerRpc({
	id: "cd8877cc246f44be8d379ebbfcf444b635e2c85a1ab6d16e9763406cfb807752",
	name: "deleteClass",
	filename: "src/lib/school/api.ts"
}, (opts) => deleteClass.__executeServer(opts));
var deleteClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteClass_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	await (await getSql())`delete from classes where id = ${data.id} and school_id = ${p.school.id}`;
	return { ok: true };
});
var listSubjects_createServerFn_handler = createServerRpc({
	id: "667b1a23e682a2bc93267be9415f48f076be55aeef3d012a56b12e05ba333d22",
	name: "listSubjects",
	filename: "src/lib/school/api.ts"
}, (opts) => listSubjects.__executeServer(opts));
var listSubjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSubjects_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	return (await (await getSql())`
      select id, school_id, name, code from subjects
      where school_id = ${p.school.id} order by name
    `).map((s) => ({
		id: s.id,
		schoolId: s.school_id,
		name: s.name,
		code: s.code
	}));
});
var upsertSubject_createServerFn_handler = createServerRpc({
	id: "1b0251e15a9a86800471ab6d2b6dfb41a59e8ddcaf8f4961fdc94c0944b1f875",
	name: "upsertSubject",
	filename: "src/lib/school/api.ts"
}, (opts) => upsertSubject.__executeServer(opts));
var upsertSubject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertSubject_createServerFn_handler, async ({ context, data }) => {
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
var deleteSubject_createServerFn_handler = createServerRpc({
	id: "98060af2d368d9ad839c6474632ee5aead3b5080a329a73fa7e1d7821c95a936",
	name: "deleteSubject",
	filename: "src/lib/school/api.ts"
}, (opts) => deleteSubject.__executeServer(opts));
var deleteSubject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteSubject_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	await (await getSql())`delete from subjects where id = ${data.id} and school_id = ${p.school.id}`;
	return { ok: true };
});
var listStudents_createServerFn_handler = createServerRpc({
	id: "42357cb8f93db921ed894d829671f2ebfe2723694b41771993d6588cc40ba506",
	name: "listStudents",
	filename: "src/lib/school/api.ts"
}, (opts) => listStudents.__executeServer(opts));
var listStudents = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(listStudents_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	const sql = await getSql();
	const classId = data.classId;
	return (classId ? await sql`
          select s.id, s.school_id, s.class_id, c.name as class_name, s.name, s.nis, s.gender
          from students s join classes c on c.id = s.class_id
          where s.school_id = ${p.school.id} and s.class_id = ${classId}
          order by s.name
        ` : await sql`
          select s.id, s.school_id, s.class_id, c.name as class_name, s.name, s.nis, s.gender
          from students s join classes c on c.id = s.class_id
          where s.school_id = ${p.school.id}
          order by c.grade, c.name, s.name
        `).map((s) => ({
		id: s.id,
		schoolId: s.school_id,
		classId: s.class_id,
		className: s.class_name,
		name: s.name,
		nis: s.nis,
		gender: s.gender
	}));
});
var upsertStudent_createServerFn_handler = createServerRpc({
	id: "8df56e41f6bf062a723e4fd2470e474039aa279d9fd5e24a861f081ca941fed9",
	name: "upsertStudent",
	filename: "src/lib/school/api.ts"
}, (opts) => upsertStudent.__executeServer(opts));
var upsertStudent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertStudent_createServerFn_handler, async ({ context, data }) => {
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
var deleteStudent_createServerFn_handler = createServerRpc({
	id: "401ac3a1fc48a801c4bf6890d475669be5894b7d7732408f2123beacf9ee889b",
	name: "deleteStudent",
	filename: "src/lib/school/api.ts"
}, (opts) => deleteStudent.__executeServer(opts));
var deleteStudent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteStudent_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	await (await getSql())`delete from students where id = ${data.id} and school_id = ${p.school.id}`;
	return { ok: true };
});
var listSchedules_createServerFn_handler = createServerRpc({
	id: "fab339e0b64ce5a4aaff3c4e8079391c6cf8d4b0ff9e89aeec78a2062eaa2e98",
	name: "listSchedules",
	filename: "src/lib/school/api.ts"
}, (opts) => listSchedules.__executeServer(opts));
var listSchedules = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSchedules_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	return (await (await getSql()).query(`select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.school_id = $1
       order by sc.day_of_week, sc.period, c.name`, [p.school.id])).map(mapSchedule);
});
var upsertSchedule_createServerFn_handler = createServerRpc({
	id: "47500b663ef0a539b2b4221f2a3fd6344938a8169d4cc10f174c7dbad4113208",
	name: "upsertSchedule",
	filename: "src/lib/school/api.ts"
}, (opts) => upsertSchedule.__executeServer(opts));
var upsertSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertSchedule_createServerFn_handler, async ({ context, data }) => {
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
var deleteSchedule_createServerFn_handler = createServerRpc({
	id: "28229772d06654540375cfee10ee91b488fd5deb330fb76030782e5a5f8bf95f",
	name: "deleteSchedule",
	filename: "src/lib/school/api.ts"
}, (opts) => deleteSchedule.__executeServer(opts));
var deleteSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteSchedule_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	await (await getSql())`delete from schedules where id = ${data.id} and school_id = ${p.school.id}`;
	return { ok: true };
});
var clockIn_createServerFn_handler = createServerRpc({
	id: "6c0b1bfade14d2c04d5d73721ca6c8cdb2646b1b2e79e373927e4cf5920aef57",
	name: "clockIn",
	filename: "src/lib/school/api.ts"
}, (opts) => clockIn.__executeServer(opts));
var clockIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clockIn_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	requireTeacher(p);
	const sql = await getSql();
	const today = todayWib();
	const existing = await sql`
      select id, check_in_at, status from teacher_attendance
      where staff_id = ${p.staff.id} and date = ${today}::date
    `;
	if (existing[0]?.check_in_at) throw new Error("Anda sudah absen masuk hari ini");
	if (existing[0] && (existing[0].status === "izin" || existing[0].status === "cuti")) throw new Error("Hari ini tercatat izin/cuti");
	if ((await sql`
      select id from leave_requests
      where staff_id = ${p.staff.id} and status = 'approved'
        and start_date <= ${today}::date and end_date >= ${today}::date
      limit 1
    `)[0]) throw new Error("Pengajuan izin/cuti Anda disetujui untuk hari ini");
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
var clockOut_createServerFn_handler = createServerRpc({
	id: "56713d41dab7c5fbeb8d681d54355c75b349dddc08aebba60eab5ec660d2b68e",
	name: "clockOut",
	filename: "src/lib/school/api.ts"
}, (opts) => clockOut.__executeServer(opts));
var clockOut = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clockOut_createServerFn_handler, async ({ context }) => {
	const p = await ensureProfile(context.userId);
	requireTeacher(p);
	const sql = await getSql();
	const today = todayWib();
	const existing = await sql`
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
var listTeacherAttendance_createServerFn_handler = createServerRpc({
	id: "821e3a2513afbe40018df59368b96f598c3f4cd4109b89ce569888ccd8277105",
	name: "listTeacherAttendance",
	filename: "src/lib/school/api.ts"
}, (opts) => listTeacherAttendance.__executeServer(opts));
var listTeacherAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listTeacherAttendance_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	if (!p.staff.isAdmin) throw new Error("Hanya admin yang dapat melihat rekap guru");
	const sql = await getSql();
	return (data.staffId ? await sql`
          select a.id, a.staff_id, st.name as staff_name, a.date, a.check_in_at, a.check_out_at, a.status, a.note
          from teacher_attendance a
          join staff st on st.id = a.staff_id
          where a.school_id = ${p.school.id}
            and a.date >= ${data.from}::date and a.date <= ${data.to}::date
            and a.staff_id = ${data.staffId}
          order by a.date desc, st.name
        ` : await sql`
          select a.id, a.staff_id, st.name as staff_name, a.date, a.check_in_at, a.check_out_at, a.status, a.note
          from teacher_attendance a
          join staff st on st.id = a.staff_id
          where a.school_id = ${p.school.id}
            and a.date >= ${data.from}::date and a.date <= ${data.to}::date
          order by a.date desc, st.name
        `).map((r) => ({
		id: r.id,
		staffId: r.staff_id,
		staffName: r.staff_name,
		date: dateStr(r.date),
		checkInAt: iso(r.check_in_at),
		checkOutAt: iso(r.check_out_at),
		status: r.status,
		note: r.note
	}));
});
var submitLeave_createServerFn_handler = createServerRpc({
	id: "33febdbb7c133a5869a1246f6bd76df6eb4b78a81bdbc744cf9ccbab0f1f5e42",
	name: "submitLeave",
	filename: "src/lib/school/api.ts"
}, (opts) => submitLeave.__executeServer(opts));
var submitLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(submitLeave_createServerFn_handler, async ({ context, data }) => {
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
var listLeaves_createServerFn_handler = createServerRpc({
	id: "d00de24fe1efa9fd55cb646952f811c63a9c68dfbc97e1355397361a22497186",
	name: "listLeaves",
	filename: "src/lib/school/api.ts"
}, (opts) => listLeaves.__executeServer(opts));
var listLeaves = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(listLeaves_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	const sql = await getSql();
	return (Boolean(data.mine) || !p.staff.isAdmin ? await sql`
          select l.id, l.staff_id, st.name as staff_name, l.type, l.start_date, l.end_date,
            l.reason, l.status, rv.name as reviewed_by_name, l.created_at
          from leave_requests l
          join staff st on st.id = l.staff_id
          left join staff rv on rv.id = l.reviewed_by
          where l.staff_id = ${p.staff.id}
          order by l.created_at desc
        ` : await sql`
          select l.id, l.staff_id, st.name as staff_name, l.type, l.start_date, l.end_date,
            l.reason, l.status, rv.name as reviewed_by_name, l.created_at
          from leave_requests l
          join staff st on st.id = l.staff_id
          left join staff rv on rv.id = l.reviewed_by
          where l.school_id = ${p.school.id}
          order by case l.status when 'pending' then 0 else 1 end, l.created_at desc
        `).map((l) => ({
		id: l.id,
		staffId: l.staff_id,
		staffName: l.staff_name,
		type: l.type,
		startDate: dateStr(l.start_date),
		endDate: dateStr(l.end_date),
		reason: l.reason,
		status: l.status,
		reviewedByName: l.reviewed_by_name,
		createdAt: iso(l.created_at) ?? ""
	}));
});
var reviewLeave_createServerFn_handler = createServerRpc({
	id: "de25b1e1989bfa9b16eb101b0971d9a17611997ca48651a820a443838b181173",
	name: "reviewLeave",
	filename: "src/lib/school/api.ts"
}, (opts) => reviewLeave.__executeServer(opts));
var reviewLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(reviewLeave_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireAdmin(p);
	const sql = await getSql();
	const leave = (await sql`
      select id, staff_id, type, start_date, end_date, status
      from leave_requests where id = ${data.id} and school_id = ${p.school.id}
    `)[0];
	if (!leave) throw new Error("Pengajuan tidak ditemukan");
	if (leave.status !== "pending") throw new Error("Pengajuan sudah diproses");
	await sql`
      update leave_requests
      set status = ${data.status}, reviewed_by = ${p.staff.id}, reviewed_at = now()
      where id = ${leave.id}
    `;
	if (data.status === "approved") {
		const start = /* @__PURE__ */ new Date(`${dateStr(leave.start_date)}T04:00:00+07:00`);
		const end = /* @__PURE__ */ new Date(`${dateStr(leave.end_date)}T04:00:00+07:00`);
		for (let t = start.getTime(); t <= end.getTime(); t += 864e5) {
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
var getTeachingDay_createServerFn_handler = createServerRpc({
	id: "60cc33f369886b41f4a8f0032ab75322a4934b41611308e7b20a8d0405f7c56c",
	name: "getTeachingDay",
	filename: "src/lib/school/api.ts"
}, (opts) => getTeachingDay.__executeServer(opts));
var getTeachingDay = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(getTeachingDay_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireTeacher(p);
	const date = data.date || todayWib();
	const [y, m, d] = date.split("-").map(Number);
	const dow = wibDayOfWeek(new Date(Date.UTC(y, m - 1, d, 4)));
	return {
		date,
		dayOfWeek: dow,
		schedules: (await (await getSql()).query(`select ${scheduleSelect}
       from schedules sc
       join classes c on c.id = sc.class_id
       join subjects sub on sub.id = sc.subject_id
       join staff st on st.id = sc.teacher_staff_id
       where sc.teacher_staff_id = $1 and sc.day_of_week = $2
       order by sc.period`, [p.staff.id, dow])).map(mapSchedule)
	};
});
var getRoster_createServerFn_handler = createServerRpc({
	id: "a3dfbba782f91b90e55fde2afc5880ef1838fec625e5a5b1e9adbd2283503d9a",
	name: "getRoster",
	filename: "src/lib/school/api.ts"
}, (opts) => getRoster.__executeServer(opts));
var getRoster = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getRoster_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireTeacher(p);
	const sql = await getSql();
	const schedule = (await sql`
      select id, class_id, teacher_staff_id from schedules
      where id = ${data.scheduleId} and school_id = ${p.school.id}
    `)[0];
	if (!schedule) throw new Error("Jadwal tidak ditemukan");
	if (schedule.teacher_staff_id !== p.staff.id && !p.staff.isAdmin) throw new Error("Anda bukan pengampu jam ini");
	return (await sql`
      select s.id as student_id, s.name, s.nis, s.gender,
        sa.status, sa.note, sa.id as attendance_id
      from students s
      left join student_attendance sa
        on sa.student_id = s.id and sa.schedule_id = ${data.scheduleId} and sa.date = ${data.date}::date
      where s.class_id = ${schedule.class_id}
      order by s.name
    `).map((r) => ({
		studentId: r.student_id,
		name: r.name,
		nis: r.nis,
		gender: r.gender,
		status: r.status,
		note: r.note,
		attendanceId: r.attendance_id
	}));
});
var saveStudentAttendance_createServerFn_handler = createServerRpc({
	id: "31e39bade3cf08448104f823b3f59f32bef790cdeb3073c285d36bbdc9114ab1",
	name: "saveStudentAttendance",
	filename: "src/lib/school/api.ts"
}, (opts) => saveStudentAttendance.__executeServer(opts));
var saveStudentAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveStudentAttendance_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	requireTeacher(p);
	const sql = await getSql();
	const sch = await sql`
      select id, teacher_staff_id from schedules
      where id = ${data.scheduleId} and school_id = ${p.school.id}
    `;
	if (!sch[0]) throw new Error("Jadwal tidak ditemukan");
	if (sch[0].teacher_staff_id !== p.staff.id && !p.staff.isAdmin) throw new Error("Anda bukan pengampu jam ini");
	for (const mark of data.marks) await sql`
        insert into student_attendance (
          id, school_id, student_id, schedule_id, teacher_staff_id, date, status, note
        ) values (
          ${nid("sat")}, ${p.school.id}, ${mark.studentId}, ${data.scheduleId},
          ${p.staff.id}, ${data.date}::date, ${mark.status}, ${mark.note ?? null}
        )
        on conflict (student_id, schedule_id, date) do update
          set status = excluded.status, note = excluded.note, teacher_staff_id = excluded.teacher_staff_id
      `;
	return {
		ok: true,
		count: data.marks.length
	};
});
var getStudentRecap_createServerFn_handler = createServerRpc({
	id: "33a6b1df35b685206e5a5ba13ac451b5aa068b78f3d07df67cf9deee890bb965",
	name: "getStudentRecap",
	filename: "src/lib/school/api.ts"
}, (opts) => getStudentRecap.__executeServer(opts));
var getStudentRecap = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getStudentRecap_createServerFn_handler, async ({ context, data }) => {
	const p = await ensureProfile(context.userId);
	const sql = await getSql();
	let classId = data.classId;
	if (!p.staff.isAdmin) {
		if (!p.staff.isWali || !p.waliClass) throw new Error("Hanya wali kelas yang dapat melihat rekap ini");
		classId = p.waliClass.id;
	}
	if (!classId) throw new Error("Pilih kelas");
	return (data.subjectId ? await sql`
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
        ` : await sql`
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
        `).map((r) => ({
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
		percent: Number(r.total) ? Math.round(Number(r.hadir) / Number(r.total) * 1e3) / 10 : 0
	}));
});
//#endregion
export { bootstrapSession_createServerFn_handler, clockIn_createServerFn_handler, clockOut_createServerFn_handler, deleteClass_createServerFn_handler, deleteSchedule_createServerFn_handler, deleteStudent_createServerFn_handler, deleteSubject_createServerFn_handler, getDashboard_createServerFn_handler, getRoster_createServerFn_handler, getStudentRecap_createServerFn_handler, getTeachingDay_createServerFn_handler, listClasses_createServerFn_handler, listLeaves_createServerFn_handler, listSchedules_createServerFn_handler, listStaff_createServerFn_handler, listStudents_createServerFn_handler, listSubjects_createServerFn_handler, listTeacherAttendance_createServerFn_handler, reviewLeave_createServerFn_handler, saveStudentAttendance_createServerFn_handler, setStaffActive_createServerFn_handler, submitLeave_createServerFn_handler, upsertClass_createServerFn_handler, upsertSchedule_createServerFn_handler, upsertStaff_createServerFn_handler, upsertStudent_createServerFn_handler, upsertSubject_createServerFn_handler };
