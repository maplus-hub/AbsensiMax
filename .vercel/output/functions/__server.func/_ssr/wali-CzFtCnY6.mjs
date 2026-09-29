import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as getDashboard } from "./api-BCMNv5Kz.mjs";
import { o as useSchool, r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as ClockPanel } from "./clock-panel-Bb9iqcEH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wali-CzFtCnY6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "wali",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaliHome, {})
	});
}
function WaliHome() {
	const { profile } = useSchool();
	const [data, setData] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(() => {
		getDashboard().then(setData);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-[24px] bg-surface-2" });
	const c = data.classSummary;
	const pct = c && c.total ? Math.round(c.hadir / c.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Wali kelas",
				title: profile.waliClass ? `Kelas ${profile.waliClass.name}` : "Kelas Anda",
				desc: profile.waliClass ? `${profile.waliClass.studentCount} murid · kehadiran 14 hari ${pct}%` : "Anda belum ditetapkan sebagai wali kelas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockPanel, {
				attendance: data.teacherToday,
				onChange: load
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Ringkasan murid"
				}), c ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hadir" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: c.hadir
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sakit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: c.sakit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Izin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: c.izin
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alpha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: c.alpha
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Belum ada data kelas."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Akses cepat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium",
						to: "/wali/murid",
						children: "Absensi jam mengajar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium",
						to: "/wali/rekap",
						children: "Rekap semua pelajaran"
					})]
				})] })]
			})
		]
	});
}
//#endregion
export { Page as component };
