import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { t as useCurrentUser } from "./use-current-user-BYyFvsCd.mjs";
import { a as hasGateSessionMarker } from "./server-DsEMvhlX.mjs";
import { n as cn, s as initials } from "./utils-DIMIJOCd.mjs";
import { f as homeForRole } from "./api-BCMNv5Kz.mjs";
import { n as LogoMark, t as BrandWord } from "./logo-BepTcmVa.mjs";
import { a as School, f as ClipboardCheck, l as House, m as BookOpen, n as Users, p as CalendarDays, r as UserRound, s as LogOut, u as FileSpreadsheet } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CbbBbChM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SchoolContext = (0, import_react.createContext)(null);
function useSchool() {
	const ctx = (0, import_react.useContext)(SchoolContext);
	if (!ctx) throw new Error("useSchool must be used inside the app shell");
	return ctx;
}
var STATUS_LABEL = {
	hadir: "Hadir",
	sakit: "Sakit",
	izin: "Izin",
	alpha: "Alpha",
	cuti: "Cuti"
};
var ROLE_LABEL = {
	admin: "Admin",
	guru: "Guru",
	wali: "Wali Kelas"
};
function navFor(role) {
	if (role === "admin") return [
		{
			to: "/admin",
			label: "Beranda",
			icon: House
		},
		{
			to: "/admin/akun",
			label: "Akun guru",
			icon: Users
		},
		{
			to: "/admin/master",
			label: "Master data",
			icon: School
		},
		{
			to: "/admin/izin",
			label: "Izin & cuti",
			icon: ClipboardCheck
		},
		{
			to: "/admin/rekap",
			label: "Rekap guru",
			icon: FileSpreadsheet
		}
	];
	if (role === "wali") return [
		{
			to: "/wali",
			label: "Beranda",
			icon: House
		},
		{
			to: "/wali/murid",
			label: "Absen murid",
			icon: BookOpen
		},
		{
			to: "/wali/rekap",
			label: "Rekap kelas",
			icon: FileSpreadsheet
		},
		{
			to: "/wali/izin",
			label: "Izin / cuti",
			icon: CalendarDays
		}
	];
	return [
		{
			to: "/guru",
			label: "Beranda",
			icon: House
		},
		{
			to: "/guru/murid",
			label: "Absen murid",
			icon: BookOpen
		},
		{
			to: "/guru/izin",
			label: "Izin / cuti",
			icon: CalendarDays
		}
	];
}
function isActive(pathname, to) {
	if (to === "/admin" || to === "/guru" || to === "/wali") return pathname === to;
	return pathname === to || pathname.startsWith(`${to}/`);
}
var subscribeToNothing = () => () => {};
function AppShell({ children }) {
	const { profile, role, setRole } = useSchool();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = navFor(role);
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, () => false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "no-print sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: homeForRole(role),
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWord, { className: "hidden sm:inline" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden min-w-0 flex-1 truncate text-sm text-muted md:block",
							children: profile.school.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								profile.roles.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "Pilih peran",
									value: role,
									onChange: (e) => setRole(e.target.value),
									className: "h-10 max-w-[9.5rem] rounded-[12px] border border-border bg-surface px-2 text-xs font-medium",
									children: profile.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: ROLE_LABEL[r]
									}, r))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-fg",
									children: initials(profile.staff.name)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden max-w-[9rem] truncate text-sm font-medium sm:block",
									children: profile.staff.name
								}),
								user && !gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: signingOut,
									onClick: () => {
										setSigningOut(true);
										signOut("/login").catch(() => setSigningOut(false));
									},
									className: "grid size-10 place-items-center rounded-[12px] text-muted hover:bg-surface-2",
									"aria-label": "Keluar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mx-auto flex max-w-6xl", role === "admin" ? "md:grid md:grid-cols-[220px_1fr]" : "flex-col"),
				children: [role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "no-print hidden border-r border-border/80 p-3 md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "sticky top-20 flex flex-col gap-1",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							item,
							active: isActive(pathname, item.to)
						}, item.to))
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "no-print hidden px-4 pt-4 md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-wrap gap-2",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("inline-flex h-11 items-center gap-2 rounded-[14px] px-4 text-sm font-medium", isActive(pathname, item.to) ? "bg-primary text-primary-fg" : "bg-surface text-ink shadow-card"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}) }, item.to))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 pt-5 pb-28 md:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-lg grid-flow-col",
					children: items.map((item) => {
						const Icon = item.icon;
						const active = isActive(pathname, item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-primary" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.8
							}), item.label]
						}) }, item.to);
					})
				})
			})
		]
	});
}
function NavLink({ item, active }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		className: cn("flex h-11 items-center gap-2 rounded-[14px] px-3 text-sm font-medium", active ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2 hover:text-ink"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
	});
}
function PageHeader({ kicker, title, desc, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			kicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-xs font-medium tracking-[0.14em] text-muted uppercase",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium text-ink",
				children: title
			}),
			desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: desc
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-print flex flex-wrap gap-2",
			children: actions
		})]
	});
}
function EmptyState({ icon: Icon = UserRound, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center rounded-[24px] bg-surface px-6 py-14 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mb-3 size-8 text-subtle" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted",
				children: desc
			})
		]
	});
}
//#endregion
export { SchoolContext as a, STATUS_LABEL as i, EmptyState as n, useSchool as o, PageHeader as r, AppShell as t };
