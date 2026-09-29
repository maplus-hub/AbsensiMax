import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as setStaffActive, O as upsertStaff, g as listStaff } from "./api-BCMNv5Kz.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CbtUJCtq.mjs";
import { n as Input, t as Field } from "./input-8_u1k_N7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/akun-CA8r8N52.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkunPage, {})
	});
}
function rolesText(s) {
	return [
		s.isAdmin ? "Admin" : null,
		s.isGuru ? "Guru" : null,
		s.isWali ? "Wali kelas" : null
	].filter(Boolean).join(" · ");
}
function AkunPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const load = () => {
		listStaff().then(setRows).catch(() => setRows([]));
	};
	(0, import_react.useEffect)(load, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Pengaturan",
			title: "Akun guru & wali kelas",
			desc: "Daftarkan staf dengan email. Setelah mereka masuk memakai email yang sama, akun otomatis tertaut.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "Tambah staf"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: (rows ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: s.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: s.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: [
							rolesText(s),
							s.nip ? ` · NIP ${s.nip}` : "",
							s.userId ? " · tertaut" : " · menunggu masuk",
							s.active ? "" : " · nonaktif"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							setEditing(s);
							setOpen(true);
						},
						children: "Ubah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => {
							setStaffActive({ data: {
								id: s.id,
								active: !s.active
							} }).then(() => {
								toast.success(s.active ? "Dinonaktifkan" : "Diaktifkan");
								load();
							}).catch((e) => toast.error(e instanceof Error ? e.message : "Gagal"));
						},
						children: s.active ? "Nonaktifkan" : "Aktifkan"
					})]
				})]
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffDialog, {
			open,
			onOpenChange: setOpen,
			staff: editing,
			onSaved: () => {
				setOpen(false);
				load();
			}
		})
	] });
}
function StaffDialog({ open, onOpenChange, staff, onSaved }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [nip, setNip] = (0, import_react.useState)("");
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [isGuru, setIsGuru] = (0, import_react.useState)(true);
	const [isWali, setIsWali] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setName(staff?.name ?? "");
		setEmail(staff?.email ?? "");
		setNip(staff?.nip ?? "");
		setIsAdmin(staff?.isAdmin ?? false);
		setIsGuru(staff?.isGuru ?? true);
		setIsWali(staff?.isWali ?? false);
	}, [staff, open]);
	const save = async () => {
		setBusy(true);
		try {
			await upsertStaff({ data: {
				id: staff?.id,
				name,
				email,
				nip,
				isAdmin,
				isGuru,
				isWali
			} });
			toast.success("Staf disimpan");
			onSaved();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: staff ? "Ubah staf" : "Staf baru",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nama",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "NIP",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: nip,
							onChange: (e) => setNip(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 pt-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-11 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isAdmin,
									onChange: (e) => setIsAdmin(e.target.checked)
								}), "Admin"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-11 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isGuru,
									onChange: (e) => setIsGuru(e.target.checked)
								}), "Guru"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-11 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isWali,
									onChange: (e) => setIsWali(e.target.checked)
								}), "Wali kelas"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: busy,
						onClick: () => void save(),
						children: busy ? "Menyimpan…" : "Simpan"
					})
				]
			})
		})
	});
}
//#endregion
export { Page as component };
