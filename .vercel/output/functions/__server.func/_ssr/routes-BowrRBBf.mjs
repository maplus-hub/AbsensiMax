import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-BYyFvsCd.mjs";
import { b as readStoredRole, f as homeForRole, t as bootstrapSession } from "./api-BCMNv5Kz.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BowrRBBf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	const [to, setTo] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		bootstrapSession().then((p) => setTo(homeForRole(readStoredRole(p)))).catch(() => setTo("/guru"));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-full bg-surface-2" })
	});
}
//#endregion
export { Home as component };
