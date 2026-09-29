import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as wibDayOfWeek, t as DAY_NAMES } from "./utils-DIMIJOCd.mjs";
import { c as getDashboard } from "./api-BCMNv5Kz.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as ClockPanel } from "./clock-panel-Bb9iqcEH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guru-BIOvkL_V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "guru",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuruHome, {})
	});
}
function GuruHome() {
	const [data, setData] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(() => {
		getDashboard().then(setData);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-[24px] bg-surface-2" });
	const day = DAY_NAMES[wibDayOfWeek()];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: `Halo, ${data.profile.staff.name.split(" ")[0]}`,
				title: "Hari mengajar",
				desc: `${data.profile.school.name} · ${day}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockPanel, {
				attendance: data.teacherToday,
				onChange: load
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Jadwal hari ini"
			}), data.todaySchedules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Tidak ada jam mengajar hari ini."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: data.todaySchedules.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-[14px] bg-surface-2 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							"Jam ",
							s.period,
							" · ",
							s.className
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							s.subjectName,
							" · ",
							s.startTime,
							"–",
							s.endTime
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/guru/murid",
						className: "text-sm font-medium text-primary",
						children: "Absen"
					})]
				}, s.id))
			})] })
		]
	});
}
//#endregion
export { Page as component };
