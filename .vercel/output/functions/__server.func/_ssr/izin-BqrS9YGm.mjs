import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard } from "./guard-BY2euWX_.mjs";
import { n as LeaveList, t as LeaveForm } from "./leave-panel-DHjesg6E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/izin-BqrS9YGm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "guru",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IzinPage, {})
	});
}
function IzinPage() {
	const [key, setKey] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Pengajuan",
				title: "Izin dan cuti",
				desc: "Ajukan izin harian atau cuti. Admin akan meninjau sebelum masuk rekap."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveForm, { onSaved: () => setKey((k) => k + 1) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveList, { refreshKey: key })
		]
	});
}
//#endregion
export { Page as component };
