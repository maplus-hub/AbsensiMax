import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { n as useCurrentUserState } from "./use-current-user-BYyFvsCd.mjs";
import { t as GROK_PROVIDERS } from "./server-DsEMvhlX.mjs";
import { n as LogoMark, t as BrandWord } from "./logo-BepTcmVa.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as Input, t as Field } from "./input-8_u1k_N7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BAhLt87d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-full bg-surface-2" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	const submit = async () => {
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					name,
					email,
					password,
					callbackURL: "/"
				});
				if (res.error) throw new Error(res.error.message);
			} else {
				const res = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/"
				});
				if (res.error) throw new Error(res.error.message);
			}
			window.location.href = "/";
		} catch (e) {
			setError(e instanceof Error ? e.message : "Gagal masuk");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(20,92,76,0.12),transparent)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWord, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-8 text-4xl font-medium tracking-tight text-ink sm:text-5xl",
						children: "Absensi guru dan murid, rapi setiap jam pelajaran."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-muted",
						children: "Masuk-pulang, izin dan cuti, absensi kelas, plus rekap yang siap dicetak. Admin mengatur sekolah; guru dan wali kelas bekerja dari genggaman."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-8 space-y-2 text-sm text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-[16px] bg-surface px-4 py-3 shadow-card",
								children: "Admin — akun, jadwal, persetujuan, rekap guru"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-[16px] bg-surface px-4 py-3 shadow-card",
								children: "Guru — absen masuk/pulang dan murid di jam mengajar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-[16px] bg-surface px-4 py-3 shadow-card",
								children: "Wali kelas — rekap seluruh pelajaran di kelasnya"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[28px] bg-surface p-6 shadow-card sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: "Masuk AbsensiMax"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: mode === "in" ? "Gunakan akun yang didaftarkan sekolah." : "Daftar dengan email yang dicatat admin."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full",
							onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
							children: ["Lanjut dengan ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs tracking-wide text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							"atau email",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							submit();
						},
						children: [
							mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nama lengkap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									autoComplete: "email"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Kata sandi",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 8,
									autoComplete: mode === "up" ? "new-password" : "current-password"
								})
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-alpha",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy || false,
								children: busy ? "Memproses…" : mode === "in" ? "Masuk" : "Daftar"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 text-sm text-muted underline-offset-4 hover:text-ink hover:underline",
						onClick: () => setMode(mode === "in" ? "up" : "in"),
						children: mode === "in" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"
					})
				]
			})]
		})]
	});
}
//#endregion
export { Login as component };
