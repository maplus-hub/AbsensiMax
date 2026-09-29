import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard } from "./guard-BY2euWX_.mjs";
import { n as LeaveList } from "./leave-panel-DHjesg6E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/izin-j2l6zJxB.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoleGuard, {
		role: "admin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Persetujuan",
			title: "Izin dan cuti guru",
			desc: "Setujui atau tolak pengajuan. Jika disetujui, rekap guru menandai hari tersebut."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveList, { admin: true })]
	});
}
//#endregion
export { Page as component };
