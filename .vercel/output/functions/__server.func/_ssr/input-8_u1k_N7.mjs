import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-DIMIJOCd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-8_u1k_N7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fieldClass = "h-11 w-full rounded-[12px] border border-border bg-surface px-3 text-sm text-ink outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus:shadow-[0_0_0_3px_rgba(20,92,76,0.18)]";
var Input = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn(fieldClass, className),
	...props
}));
Input.displayName = "Input";
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn(fieldClass, "h-auto min-h-24 py-2.5", className),
	...props
}));
Textarea.displayName = "Textarea";
var NativeSelect = (0, import_react.forwardRef)(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
	ref,
	className: cn(fieldClass, className),
	...props,
	children
}));
NativeSelect.displayName = "NativeSelect";
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { Textarea as i, Input as n, NativeSelect as r, Field as t };
