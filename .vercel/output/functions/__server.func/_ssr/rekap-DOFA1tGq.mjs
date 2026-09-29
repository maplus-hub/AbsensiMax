import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatDateId, i as downloadCsv, l as printPage, o as formatTimeWib, r as daysAgoWib, u as todayWib } from "./utils-DIMIJOCd.mjs";
import { g as listStaff, y as listTeacherAttendance } from "./api-BCMNv5Kz.mjs";
import { d as Download, o as Printer } from "../_libs/lucide-react.mjs";
import { o as useSchool, r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { n as StatusBadge } from "./status-badge-Djk6ylLY.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-8_u1k_N7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rekap-DOFA1tGq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RekapGuru, {})
	});
}
function RekapGuru() {
	const { profile } = useSchool();
	const [from, setFrom] = (0, import_react.useState)(daysAgoWib(14));
	const [to, setTo] = (0, import_react.useState)(todayWib);
	const [staffId, setStaffId] = (0, import_react.useState)("");
	const [staff, setStaff] = (0, import_react.useState)([]);
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listStaff().then(setStaff).catch(() => setStaff([]));
	}, []);
	(0, import_react.useEffect)(() => {
		listTeacherAttendance({ data: {
			from,
			to,
			staffId: staffId || void 0
		} }).then(setRows).catch(() => setRows([]));
	}, [
		from,
		to,
		staffId
	]);
	const summary = (0, import_react.useMemo)(() => {
		const hadir = rows.filter((r) => r.status === "hadir").length;
		return {
			total: rows.length,
			hadir,
			pct: rows.length ? Math.round(hadir / rows.length * 100) : 0
		};
	}, [rows]);
	const download = () => {
		downloadCsv(`rekap-guru-${from}-${to}.csv`, [
			"Tanggal",
			"Nama",
			"Status",
			"Masuk",
			"Pulang",
			"Catatan"
		], rows.map((r) => [
			r.date,
			r.staffName,
			r.status,
			formatTimeWib(r.checkInAt),
			formatTimeWib(r.checkOutAt),
			r.note
		]));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Rekap",
			title: "Absensi guru",
			desc: "Filter rentang tanggal, unduh CSV, atau cetak untuk arsip sekolah.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: download,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Unduh CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: printPage,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Cetak"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mb-4 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Dari",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Sampai",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Guru",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: staffId,
						onChange: (e) => setStaffId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Semua guru"
						}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "print-sheet mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted uppercase",
					children: "Dokumen rekap"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-1 text-2xl",
					children: profile.school.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Rekap absensi guru · ",
						formatDateId(from),
						" — ",
						formatDateId(to)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						summary.hadir,
						" hadir dari ",
						summary.total,
						" catatan (",
						summary.pct,
						"%)"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-[24px] bg-surface shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Tanggal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Nama"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Masuk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Pulang"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: r.staffName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: formatTimeWib(r.checkInAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: formatTimeWib(r.checkOutAt)
						})
					]
				}, r.id)) })]
			})
		})
	] });
}
//#endregion
export { Page as component };
