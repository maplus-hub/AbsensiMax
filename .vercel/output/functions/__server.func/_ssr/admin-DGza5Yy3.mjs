import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatDateId } from "./utils-DIMIJOCd.mjs";
import { c as getDashboard } from "./api-BCMNv5Kz.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as LeaveBadge } from "./status-badge-Djk6ylLY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DGza5Yy3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHome, {})
	});
}
function AdminHome() {
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getDashboard().then(setData).catch(() => setData(null));
	}, []);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-[24px] bg-surface-2" });
	const t = data.teacherSummary;
	const hadirPct = t.total ? Math.round(t.hadir / t.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: data.profile.school.name,
			title: "Ringkasan sekolah",
			desc: "Kelola akun, jadwal, persetujuan izin, dan rekap kehadiran guru."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Hadir guru 14 hari",
					value: `${hadirPct}%`,
					hint: `${t.hadir} dari ${t.total} catatan`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Izin menunggu",
					value: String(data.pendingLeaves),
					hint: "Perlu persetujuan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Jam Anda hari ini",
					value: String(data.todaySchedules.length),
					hint: formatDateId(data.today)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Akses cepat"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium",
						to: "/admin/akun",
						children: "Atur akun guru & wali kelas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium",
						to: "/admin/master",
						children: "Kelas, pelajaran, dan jadwal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-[14px] bg-surface-2 px-4 py-3 text-sm font-medium",
						to: "/admin/rekap",
						children: "Cetak rekap absensi guru"
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Pengajuan terbaru"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-3",
				children: [data.recentLeaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: l.staffName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							l.type,
							" · ",
							l.startDate
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveBadge, { status: l.status })]
				}, l.id)), data.recentLeaves.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Belum ada pengajuan."
				})]
			})] })]
		})
	] });
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted uppercase",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-2 text-3xl tabular-nums",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: hint
		})
	] });
}
//#endregion
export { Page as component };
