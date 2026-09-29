import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DK5aLf6n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BCMNv5Kz.js
var KEY = "absensimax.role";
function readStoredRole(profile) {
	const allowed = profile.roles;
	if (typeof window !== "undefined") {
		const stored = window.localStorage.getItem(KEY);
		if (stored && allowed.includes(stored)) return stored;
	}
	return allowed[0] ?? "guru";
}
function storeRole(role) {
	if (typeof window !== "undefined") window.localStorage.setItem(KEY, role);
}
function homeForRole(role) {
	if (role === "admin") return "/admin";
	if (role === "wali") return "/wali";
	return "/guru";
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var bootstrapSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("30d34d1c91ab4457047f23fc2c35e5fad40e99c5de59390d9f2db5dc76080212"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("87b0a2010a34598b85c52421cfef183eb2514874cbf203d7c72c059096f574a0"));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bb5add275a11266df118101e2ecdc22f5fc22a7999b65119336e6c41795f230f"));
var upsertStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c32f8ab73df332dfda25010929ce8a8dcce12f5e3b1411221de47cd741b8d3d5"));
var setStaffActive = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("6df7a3f6747e27934629941f5e861b5d1a6e58f544c18c30b4be1d1281795118"));
var listClasses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("83d61245d96baba55fda991bf3f24e3d10c690834ef02932fdd7bb661e0887dd"));
var upsertClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("40f59fc8d4d20a9d5dad6134fca3c4ec4238be450da0ccd765823ddf7c211aa0"));
var deleteClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("cd8877cc246f44be8d379ebbfcf444b635e2c85a1ab6d16e9763406cfb807752"));
var listSubjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("667b1a23e682a2bc93267be9415f48f076be55aeef3d012a56b12e05ba333d22"));
var upsertSubject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1b0251e15a9a86800471ab6d2b6dfb41a59e8ddcaf8f4961fdc94c0944b1f875"));
var deleteSubject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("98060af2d368d9ad839c6474632ee5aead3b5080a329a73fa7e1d7821c95a936"));
var listStudents = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(createSsrRpc("42357cb8f93db921ed894d829671f2ebfe2723694b41771993d6588cc40ba506"));
var upsertStudent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8df56e41f6bf062a723e4fd2470e474039aa279d9fd5e24a861f081ca941fed9"));
var deleteStudent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("401ac3a1fc48a801c4bf6890d475669be5894b7d7732408f2123beacf9ee889b"));
var listSchedules = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fab339e0b64ce5a4aaff3c4e8079391c6cf8d4b0ff9e89aeec78a2062eaa2e98"));
var upsertSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("47500b663ef0a539b2b4221f2a3fd6344938a8169d4cc10f174c7dbad4113208"));
var deleteSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("28229772d06654540375cfee10ee91b488fd5deb330fb76030782e5a5f8bf95f"));
var clockIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("6c0b1bfade14d2c04d5d73721ca6c8cdb2646b1b2e79e373927e4cf5920aef57"));
var clockOut = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("56713d41dab7c5fbeb8d681d54355c75b349dddc08aebba60eab5ec660d2b68e"));
var listTeacherAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("821e3a2513afbe40018df59368b96f598c3f4cd4109b89ce569888ccd8277105"));
var submitLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("33febdbb7c133a5869a1246f6bd76df6eb4b78a81bdbc744cf9ccbab0f1f5e42"));
var listLeaves = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(createSsrRpc("d00de24fe1efa9fd55cb646952f811c63a9c68dfbc97e1355397361a22497186"));
var reviewLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("de25b1e1989bfa9b16eb101b0971d9a17611997ca48651a820a443838b181173"));
var getTeachingDay = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(createSsrRpc("60cc33f369886b41f4a8f0032ab75322a4934b41611308e7b20a8d0405f7c56c"));
var getRoster = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("a3dfbba782f91b90e55fde2afc5880ef1838fec625e5a5b1e9adbd2283503d9a"));
var saveStudentAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("31e39bade3cf08448104f823b3f59f32bef790cdeb3073c285d36bbdc9114ab1"));
var getStudentRecap = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("33a6b1df35b685206e5a5ba13ac451b5aa068b78f3d07df67cf9deee890bb965"));
//#endregion
export { upsertSubject as A, setStaffActive as C, upsertSchedule as D, upsertClass as E, upsertStaff as O, saveStudentAttendance as S, submitLeave as T, listStudents as _, deleteSchedule as a, readStoredRole as b, getDashboard as c, getTeachingDay as d, homeForRole as f, listStaff as g, listSchedules as h, deleteClass as i, upsertStudent as k, getRoster as l, listLeaves as m, clockIn as n, deleteStudent as o, listClasses as p, clockOut as r, deleteSubject as s, bootstrapSession as t, getStudentRecap as u, listSubjects as v, storeRole as w, reviewLeave as x, listTeacherAttendance as y };
