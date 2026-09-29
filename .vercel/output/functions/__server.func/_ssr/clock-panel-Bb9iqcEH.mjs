import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as formatTimeWib } from "./utils-DIMIJOCd.mjs";
import { n as clockIn, r as clockOut } from "./api-BCMNv5Kz.mjs";
import { c as LogIn, s as LogOut } from "../_libs/lucide-react.mjs";
import { t as Card } from "./guard-BY2euWX_.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clock-panel-Bb9iqcEH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClockPanel({ attendance, onChange }) {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [busy, setBusy] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => window.clearInterval(t);
	}, []);
	const clock = new Intl.DateTimeFormat("id-ID", {
		timeZone: "Asia/Jakarta",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).format(now);
	const date = new Intl.DateTimeFormat("id-ID", {
		timeZone: "Asia/Jakarta",
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(now);
	const onIn = async () => {
		setBusy("in");
		try {
			await clockIn();
			toast.success("Absen masuk tercatat");
			onChange();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal absen masuk");
		} finally {
			setBusy(null);
		}
	};
	const onOut = async () => {
		setBusy("out");
		try {
			await clockOut();
			toast.success("Absen pulang tercatat");
			onChange();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal absen pulang");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden bg-primary p-0 text-primary-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-primary-fg/70 uppercase",
					children: "Absensi hari ini"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display mt-2 text-4xl tabular-nums tracking-tight",
					children: clock
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-primary-fg/80",
					children: [date, " · WIB"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2 text-sm text-primary-fg/85",
					children: attendance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						attendance.status === "hadir" ? "Hadir" : attendance.status,
						" · Masuk",
						" ",
						formatTimeWib(attendance.checkInAt),
						" · Pulang ",
						formatTimeWib(attendance.checkOutAt)
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Belum absen masuk" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "bg-primary-fg text-primary hover:bg-primary-fg/90",
						disabled: busy !== null || Boolean(attendance?.checkInAt),
						onClick: () => void onIn(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), busy === "in" ? "Menyimpan…" : "Masuk"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "border-primary-fg/30 text-primary-fg hover:bg-primary-fg/10",
						disabled: busy !== null || !attendance?.checkInAt || Boolean(attendance?.checkOutAt),
						onClick: () => void onOut(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), busy === "out" ? "Menyimpan…" : "Pulang"]
					})]
				})
			]
		})
	});
}
//#endregion
export { ClockPanel as t };
