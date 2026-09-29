import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as DAY_NAMES, u as todayWib } from "./utils-DIMIJOCd.mjs";
import { S as saveStudentAttendance, d as getTeachingDay, l as getRoster } from "./api-BCMNv5Kz.mjs";
import { i as STATUS_LABEL, n as EmptyState, r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { t as Card } from "./guard-BY2euWX_.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-8_u1k_N7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/murid-absen-DBaeKeSN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MARKS = [
	"hadir",
	"sakit",
	"izin",
	"alpha"
];
var markClass = {
	hadir: "border-hadir bg-hadir text-primary-fg",
	sakit: "border-sakit bg-sakit text-primary-fg",
	izin: "border-izin bg-izin text-primary-fg",
	alpha: "border-alpha bg-alpha text-primary-fg",
	cuti: "border-cuti bg-cuti text-primary-fg"
};
function MuridAbsenPage() {
	const [date, setDate] = (0, import_react.useState)(todayWib);
	const [day, setDay] = (0, import_react.useState)(null);
	const [scheduleId, setScheduleId] = (0, import_react.useState)("");
	const [roster, setRoster] = (0, import_react.useState)(null);
	const [marks, setMarks] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDay(null);
		setRoster(null);
		setScheduleId("");
		getTeachingDay({ data: { date } }).then((res) => {
			setDay(res);
			const first = res.schedules[0]?.id ?? "";
			setScheduleId(first);
		}).catch(() => setDay({
			dayOfWeek: 0,
			schedules: []
		}));
	}, [date]);
	(0, import_react.useEffect)(() => {
		if (!scheduleId) {
			setRoster([]);
			return;
		}
		setRoster(null);
		getRoster({ data: {
			scheduleId,
			date
		} }).then((rows) => {
			setRoster(rows);
			const next = {};
			for (const r of rows) next[r.studentId] = r.status ?? "hadir";
			setMarks(next);
		}).catch(() => setRoster([]));
	}, [scheduleId, date]);
	const selected = (0, import_react.useMemo)(() => day?.schedules.find((s) => s.id === scheduleId) ?? null, [day, scheduleId]);
	const save = async () => {
		if (!scheduleId || !roster) return;
		setBusy(true);
		try {
			await saveStudentAttendance({ data: {
				scheduleId,
				date,
				marks: roster.map((r) => ({
					studentId: r.studentId,
					status: marks[r.studentId] ?? "hadir"
				}))
			} });
			toast.success("Absensi murid disimpan");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
		} finally {
			setBusy(false);
		}
	};
	const setAll = (status) => {
		if (!roster) return;
		const next = {};
		for (const r of roster) next[r.studentId] = status;
		setMarks(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Jam mengajar",
			title: "Absensi murid",
			desc: "Tandai kehadiran di kelas yang Anda ampu pada jam tersebut."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tanggal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Jam pelajaran",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: scheduleId,
					onChange: (e) => setScheduleId(e.target.value),
					children: [(day?.schedules ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: s.id,
						children: [
							"Jam ke-",
							s.period,
							" · ",
							s.className,
							" · ",
							s.subjectName
						]
					}, s.id)), day && day.schedules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Tidak ada jadwal"
					})]
				})
			})]
		}),
		day && day.schedules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: `Tidak ada jam mengajar ${DAY_NAMES[day.dayOfWeek] ?? ""}`,
			desc: "Pilih hari lain, atau minta admin menambahkan jadwal pengampu."
		}),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Kelas yang diampu"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display mt-1 text-2xl",
					children: [
						selected.className,
						" · ",
						selected.subjectName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Jam ke-",
						selected.period,
						" · ",
						selected.startTime,
						"–",
						selected.endTime
					]
				})
			]
		}),
		roster && roster.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mb-3 flex flex-wrap gap-2",
			children: [MARKS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => setAll(m),
				children: ["Semua ", STATUS_LABEL[m]]
			}, m)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "ml-auto",
				disabled: busy,
				onClick: () => void save(),
				children: busy ? "Menyimpan…" : "Simpan absensi"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: roster.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-[18px] bg-surface p-3 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-start justify-between gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["NIS ", row.nis]
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-4 gap-1.5",
					children: MARKS.map((m) => {
						const on = (marks[row.studentId] ?? "hadir") === m;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMarks((prev) => ({
								...prev,
								[row.studentId]: m
							})),
							className: cn("h-10 rounded-[10px] border text-xs font-medium", on ? markClass[m] : "border-border bg-background text-muted"),
							children: STATUS_LABEL[m]
						}, m);
					})
				})]
			}, row.studentId))
		})] })
	] });
}
//#endregion
export { MuridAbsenPage as t };
