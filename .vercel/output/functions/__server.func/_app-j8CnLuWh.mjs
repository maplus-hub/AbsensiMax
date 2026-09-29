import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, g as Outlet, p as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./_ssr/use-current-user-BYyFvsCd.mjs";
import { b as readStoredRole, f as homeForRole, t as bootstrapSession, w as storeRole } from "./_ssr/api-BCMNv5Kz.mjs";
import { a as SchoolContext, t as AppShell } from "./_ssr/app-shell-CbbBbChM.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-j8CnLuWh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [role, setRoleState] = (0, import_react.useState)("guru");
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const load = (0, import_react.useCallback)(() => {
		setError(null);
		bootstrapSession().then((p) => {
			setProfile(p);
			const fromPath = pathname.startsWith("/admin") ? "admin" : pathname.startsWith("/wali") ? "wali" : pathname.startsWith("/guru") ? "guru" : null;
			const next = fromPath && p.roles.includes(fromPath) ? fromPath : readStoredRole(p);
			setRoleState(next);
			storeRole(next);
		}).catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat sekolah"));
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		if (user) load();
	}, [user, load]);
	const setRole = (0, import_react.useCallback)((next) => {
		setRoleState(next);
		storeRole(next);
		const home = homeForRole(next);
		if (!pathname.startsWith(home)) navigate({ to: home });
	}, [navigate, pathname]);
	const ctx = (0, import_react.useMemo)(() => profile ? {
		profile,
		role,
		setRole,
		reload: load
	} : null, [
		profile,
		role,
		setRole,
		load
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, { label: "Memeriksa sesi" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Tidak dapat membuka sekolah"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: error
		})] })
	});
	if (!ctx) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, { label: "Menyiapkan sekolah" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolContext.Provider, {
		value: ctx,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
function BootScreen({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-10 animate-pulse rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [label, "…"]
			})]
		})
	});
}
//#endregion
export { AppLayout as component };
