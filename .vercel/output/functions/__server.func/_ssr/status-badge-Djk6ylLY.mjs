import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-DIMIJOCd.mjs";
import { i as STATUS_LABEL } from "./app-shell-CbbBbChM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-Djk6ylLY.js
var import_jsx_runtime = require_jsx_runtime();
var attClass = {
	hadir: "bg-hadir/12 text-hadir",
	sakit: "bg-sakit/12 text-sakit",
	izin: "bg-izin/12 text-izin",
	alpha: "bg-alpha/12 text-alpha",
	cuti: "bg-cuti/12 text-cuti"
};
var leaveClass = {
	pending: "bg-pending/12 text-pending",
	approved: "bg-hadir/12 text-hadir",
	rejected: "bg-alpha/12 text-alpha"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium", attClass[status]),
		children: STATUS_LABEL[status]
	});
}
function LeaveBadge({ status }) {
	const label = {
		pending: "Menunggu",
		approved: "Disetujui",
		rejected: "Ditolak"
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium", leaveClass[status]),
		children: label
	});
}
//#endregion
export { StatusBadge as n, LeaveBadge as t };
