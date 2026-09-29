import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-DIMIJOCd.mjs";
import { f as homeForRole } from "./api-BCMNv5Kz.mjs";
import { o as useSchool } from "./app-shell-CbbBbChM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guard-BY2euWX_.js
var import_jsx_runtime = require_jsx_runtime();
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[24px] bg-surface p-4 shadow-card sm:p-5", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-lg font-medium text-ink", className),
		...props
	});
}
function CardDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function RoleGuard({ role, children }) {
	const { profile } = useSchool();
	if (!profile.roles.includes(role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: homeForRole(profile.roles[0] ?? "guru") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { RoleGuard as i, CardDesc as n, CardTitle as r, Card as t };
