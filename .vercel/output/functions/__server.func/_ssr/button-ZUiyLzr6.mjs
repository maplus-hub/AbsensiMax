import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./utils-DIMIJOCd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-ZUiyLzr6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 select-none", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg shadow-card hover:bg-primary-hover active:scale-[0.98]",
			secondary: "bg-surface text-ink shadow-card hover:bg-surface-2 active:scale-[0.98]",
			outline: "border border-border bg-transparent text-ink hover:bg-surface-2 active:scale-[0.98]",
			ghost: "text-ink hover:bg-surface-2",
			danger: "bg-alpha text-primary-fg hover:opacity-90 active:scale-[0.98]"
		},
		size: {
			sm: "h-9 rounded-[8px] px-3 text-sm",
			md: "h-11 rounded-[12px] px-4 text-sm",
			lg: "h-12 rounded-[14px] px-5 text-base",
			icon: "size-11 rounded-[12px]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
//#endregion
export { Button as t };
