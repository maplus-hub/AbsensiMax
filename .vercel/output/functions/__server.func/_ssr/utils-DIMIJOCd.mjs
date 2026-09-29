import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DIMIJOCd.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid(prefix) {
	return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}
function todayWib() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(/* @__PURE__ */ new Date());
}
function formatDateId(isoDate) {
	const [y, m, d] = isoDate.split("-").map(Number);
	if (!y || !m || !d) return isoDate;
	return new Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(Date.UTC(y, m - 1, d, 4, 0, 0)));
}
function formatTimeWib(iso) {
	if (!iso) return "—";
	return new Intl.DateTimeFormat("id-ID", {
		timeZone: "Asia/Jakarta",
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(iso));
}
var DAY_NAMES = [
	"",
	"Senin",
	"Selasa",
	"Rabu",
	"Kamis",
	"Jumat",
	"Sabtu"
];
function wibDayOfWeek(date = /* @__PURE__ */ new Date()) {
	return {
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6,
		Sun: 7
	}[new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Jakarta",
		weekday: "short"
	}).format(date)] ?? 1;
}
function weekdayDatesWib(count, beforeToday = 0) {
	const dates = [];
	let cursor = /* @__PURE__ */ new Date();
	cursor = /* @__PURE__ */ new Date(cursor.getTime() - beforeToday * 24 * 60 * 60 * 1e3);
	let guard = 0;
	while (dates.length < count && guard < 40) {
		const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(cursor);
		const dow = wibDayOfWeek(cursor);
		if (dow >= 1 && dow <= 5) dates.push(iso);
		cursor = /* @__PURE__ */ new Date(cursor.getTime() - 864e5);
		guard += 1;
	}
	return dates.reverse();
}
function csvEscape(value) {
	const s = value == null ? "" : String(value);
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
	return s;
}
function downloadCsv(filename, header, rows) {
	const lines = [header.map(csvEscape).join(","), ...rows.map((r) => r.map(csvEscape).join(","))];
	const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function printPage() {
	window.print();
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "AM";
}
function daysAgoWib(n) {
	const d = /* @__PURE__ */ new Date();
	d.setTime(d.getTime() - n * 864e5);
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}
//#endregion
export { formatDateId as a, nid as c, weekdayDatesWib as d, wibDayOfWeek as f, downloadCsv as i, printPage as l, cn as n, formatTimeWib as o, daysAgoWib as r, initials as s, DAY_NAMES as t, todayWib as u };
