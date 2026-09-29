import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatDateId, u as todayWib } from "./utils-DIMIJOCd.mjs";
import { T as submitLeave, m as listLeaves, x as reviewLeave } from "./api-BCMNv5Kz.mjs";
import { n as EmptyState } from "./app-shell-CbbBbChM.mjs";
import { n as CardDesc, r as CardTitle, t as Card } from "./guard-BY2euWX_.mjs";
import { t as LeaveBadge } from "./status-badge-Djk6ylLY.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { i as Textarea, n as Input, r as NativeSelect, t as Field } from "./input-8_u1k_N7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leave-panel-DHjesg6E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaveForm({ onSaved }) {
	const [type, setType] = (0, import_react.useState)("izin");
	const [startDate, setStartDate] = (0, import_react.useState)(todayWib);
	const [endDate, setEndDate] = (0, import_react.useState)(todayWib);
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		setBusy(true);
		try {
			await submitLeave({ data: {
				type,
				startDate,
				endDate,
				reason
			} });
			toast.success("Pengajuan terkirim");
			setReason("");
			onSaved?.();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal mengajukan");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ajukan izin atau cuti" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Pengajuan akan ditinjau admin sebelum masuk ke rekap." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Jenis",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: type,
						onChange: (e) => setType(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "izin",
							children: "Izin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cuti",
							children: "Cuti"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mulai",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: startDate,
						onChange: (e) => setStartDate(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Selesai",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: endDate,
						onChange: (e) => setEndDate(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Alasan",
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						rows: 3
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			disabled: busy,
			onClick: () => void submit(),
			children: busy ? "Mengirim…" : "Kirim pengajuan"
		})
	] });
}
function LeaveList({ admin, refreshKey }) {
	const [rows, setRows] = (0, import_react.useState)(null);
	const load = () => {
		listLeaves({ data: { mine: !admin } }).then(setRows).catch(() => setRows([]));
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [admin, refreshKey]);
	const decide = async (id, status) => {
		try {
			await reviewLeave({ data: {
				id,
				status
			} });
			toast.success(status === "approved" ? "Pengajuan disetujui" : "Pengajuan ditolak");
			load();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal memproses");
		}
	};
	if (!rows) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[24px] bg-surface-2" });
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Belum ada pengajuan",
		desc: admin ? "Izin dan cuti guru akan muncul di sini." : "Ajukan izin atau cuti dari formulir di atas."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: admin ? row.staffName : row.type === "cuti" ? "Cuti" : "Izin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveBadge, { status: row.status })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [formatDateId(row.startDate), row.endDate !== row.startDate ? ` — ${formatDateId(row.endDate)}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: row.reason
				})
			] }), admin && row.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => void decide(row.id, "approved"),
					children: "Setujui"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => void decide(row.id, "rejected"),
					children: "Tolak"
				})]
			})]
		}, row.id))
	});
}
//#endregion
export { LeaveList as n, LeaveForm as t };
