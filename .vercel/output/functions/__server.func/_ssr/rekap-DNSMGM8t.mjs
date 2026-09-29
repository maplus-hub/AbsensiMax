import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatDateId, i as downloadCsv, l as printPage, r as daysAgoWib, u as todayWib } from "./utils-DIMIJOCd.mjs";
import { u as getStudentRecap, v as listSubjects } from "./api-BCMNv5Kz.mjs";
import { d as Download, o as Printer } from "../_libs/lucide-react.mjs";
import { o as useSchool, r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-8_u1k_N7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rekap-DNSMGM8t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "wali",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RekapKelas, {})
	});
}
function RekapKelas() {
	const { profile } = useSchool();
	const [from, setFrom] = (0, import_react.useState)(daysAgoWib(14));
	const [to, setTo] = (0, import_react.useState)(todayWib);
	const [subjectId, setSubjectId] = (0, import_react.useState)("");
	const [subjects, setSubjects] = (0, import_react.useState)([]);
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listSubjects().then(setSubjects);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!profile.waliClass) return;
		getStudentRecap({ data: {
			from,
			to,
			subjectId: subjectId || void 0,
			classId: profile.waliClass.id
		} }).then(setRows).catch(() => setRows([]));
	}, [
		from,
		to,
		subjectId,
		profile.waliClass
	]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const list = map.get(r.studentId) ?? [];
			list.push(r);
			map.set(r.studentId, list);
		}
		return [...map.values()];
	}, [rows]);
	const download = () => {
		downloadCsv(`rekap-kelas-${profile.waliClass?.name ?? "kelas"}-${from}-${to}.csv`, [
			"NIS",
			"Nama",
			"Pelajaran",
			"Hadir",
			"Sakit",
			"Izin",
			"Alpha",
			"Total",
			"% Hadir"
		], rows.map((r) => [
			r.nis,
			r.studentName,
			r.subjectName,
			r.hadir,
			r.sakit,
			r.izin,
			r.alpha,
			r.total,
			r.percent
		]));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `Kelas ${profile.waliClass?.name ?? ""}`,
			title: "Rekap absensi murid",
			desc: "Semua pelajaran di kelas ini, bisa disaring per mapel, dicetak, dan diunduh.",
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
					label: "Pelajaran",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: subjectId,
						onChange: (e) => setSubjectId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Semua pelajaran"
						}), subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
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
						"Kelas ",
						profile.waliClass?.name,
						" · ",
						formatDateId(from),
						" — ",
						formatDateId(to)
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-[24px] bg-surface shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Murid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Pelajaran"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "H"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "S"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "I"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "%"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: grouped.flatMap((group) => group.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: i === 0 ? r.studentName : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: r.subjectName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.hadir
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.sakit
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.izin
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.alpha
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: r.percent
						})
					]
				}, `${r.studentId}-${r.subjectName}`))) })]
			})
		})
	] });
}
//#endregion
export { Page as component };
