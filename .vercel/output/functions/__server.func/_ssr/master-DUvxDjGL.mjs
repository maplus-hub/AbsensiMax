import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as DAY_NAMES } from "./utils-DIMIJOCd.mjs";
import { A as upsertSubject, D as upsertSchedule, E as upsertClass, _ as listStudents, a as deleteSchedule, g as listStaff, h as listSchedules, i as deleteClass, k as upsertStudent, o as deleteStudent, p as listClasses, s as deleteSubject, v as listSubjects } from "./api-BCMNv5Kz.mjs";
import { r as PageHeader } from "./app-shell-CbbBbChM.mjs";
import { i as RoleGuard, t as Card } from "./guard-BY2euWX_.mjs";
import { t as Button } from "./button-ZUiyLzr6.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CbtUJCtq.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-8_u1k_N7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/master-DUvxDjGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuard, {
		role: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterPage, {})
	});
}
function MasterPage() {
	const [tab, setTab] = (0, import_react.useState)("kelas");
	const [classes, setClasses] = (0, import_react.useState)([]);
	const [subjects, setSubjects] = (0, import_react.useState)([]);
	const [staff, setStaff] = (0, import_react.useState)([]);
	const [schedules, setSchedules] = (0, import_react.useState)([]);
	const [students, setStudents] = (0, import_react.useState)([]);
	const load = () => {
		Promise.all([
			listClasses(),
			listSubjects(),
			listStaff(),
			listSchedules(),
			listStudents({ data: {} })
		]).then(([c, s, st, sch, mu]) => {
			setClasses(c);
			setSubjects(s);
			setStaff(st);
			setSchedules(sch);
			setStudents(mu);
		});
	};
	(0, import_react.useEffect)(load, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Master data",
			title: "Kelas, pelajaran, jadwal",
			desc: "Atur struktur sekolah dan pengampu setiap jam pelajaran."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-print mb-4 flex gap-1 overflow-x-auto rounded-[16px] bg-surface p-1 shadow-card",
			children: [
				{
					id: "kelas",
					label: "Kelas"
				},
				{
					id: "pelajaran",
					label: "Pelajaran"
				},
				{
					id: "jadwal",
					label: "Jadwal"
				},
				{
					id: "murid",
					label: "Murid"
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(t.id),
				className: cn("h-10 shrink-0 rounded-[12px] px-4 text-sm font-medium", tab === t.id ? "bg-primary text-primary-fg" : "text-muted"),
				children: t.label
			}, t.id))
		}),
		tab === "kelas" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KelasTab, {
			rows: classes,
			staff,
			onChange: load
		}),
		tab === "pelajaran" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PelajaranTab, {
			rows: subjects,
			onChange: load
		}),
		tab === "jadwal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JadwalTab, {
			rows: schedules,
			classes,
			subjects,
			staff,
			onChange: load
		}),
		tab === "murid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuridTab, {
			rows: students,
			classes,
			onChange: load
		})
	] });
}
function KelasTab({ rows, staff, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [grade, setGrade] = (0, import_react.useState)(7);
	const [waliStaffId, setWaliStaffId] = (0, import_react.useState)("");
	const start = (row) => {
		setEditing(row ?? null);
		setName(row?.name ?? "");
		setGrade(row?.grade ?? 7);
		setWaliStaffId(row?.waliStaffId ?? "");
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mb-3",
			onClick: () => start(),
			children: "Tambah kelas"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [
						c.name,
						" · tingkat ",
						c.grade
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Wali ",
						c.waliName ?? "—",
						" · ",
						c.studentCount,
						" murid"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => start(c),
						children: "Ubah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => void deleteClass({ data: { id: c.id } }).then(() => {
							toast.success("Kelas dihapus");
							onChange();
						}),
						children: "Hapus"
					})]
				})]
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: editing ? "Ubah kelas" : "Kelas baru",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nama (contoh 7A)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tingkat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: grade,
								onChange: (e) => setGrade(Number(e.target.value)),
								children: [
									7,
									8,
									9,
									10,
									11,
									12
								].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: g,
									children: g
								}, g))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Wali kelas",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: waliStaffId,
								onChange: (e) => setWaliStaffId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), staff.filter((s) => s.isWali || s.isGuru).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => void upsertClass({ data: {
								id: editing?.id,
								name,
								grade,
								waliStaffId: waliStaffId || null
							} }).then(() => {
								toast.success("Kelas disimpan");
								setOpen(false);
								onChange();
							}),
							children: "Simpan"
						})
					]
				})
			})
		})
	] });
}
function PelajaranTab({ rows, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const start = (row) => {
		setEditing(row ?? null);
		setName(row?.name ?? "");
		setCode(row?.code ?? "");
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mb-3",
			onClick: () => start(),
			children: "Tambah pelajaran"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: s.code
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => start(s),
						children: "Ubah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => void deleteSubject({ data: { id: s.id } }).then(() => {
							toast.success("Pelajaran dihapus");
							onChange();
						}),
						children: "Hapus"
					})]
				})]
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: editing ? "Ubah pelajaran" : "Pelajaran baru",
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
							label: "Kode",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: code,
								onChange: (e) => setCode(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => void upsertSubject({ data: {
								id: editing?.id,
								name,
								code
							} }).then(() => {
								toast.success("Pelajaran disimpan");
								setOpen(false);
								onChange();
							}),
							children: "Simpan"
						})
					]
				})
			})
		})
	] });
}
var PERIOD_TIMES = {
	1: {
		start: "07:00",
		end: "07:40"
	},
	2: {
		start: "07:40",
		end: "08:20"
	},
	3: {
		start: "08:20",
		end: "09:00"
	},
	4: {
		start: "09:20",
		end: "10:00"
	},
	5: {
		start: "10:00",
		end: "10:40"
	},
	6: {
		start: "10:40",
		end: "11:20"
	}
};
function JadwalTab({ rows, classes, subjects, staff, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [classId, setClassId] = (0, import_react.useState)("");
	const [subjectId, setSubjectId] = (0, import_react.useState)("");
	const [teacherStaffId, setTeacherStaffId] = (0, import_react.useState)("");
	const [dayOfWeek, setDayOfWeek] = (0, import_react.useState)(1);
	const [period, setPeriod] = (0, import_react.useState)(1);
	const start = (row) => {
		setEditing(row ?? null);
		setClassId(row?.classId ?? classes[0]?.id ?? "");
		setSubjectId(row?.subjectId ?? subjects[0]?.id ?? "");
		setTeacherStaffId(row?.teacherStaffId ?? staff[0]?.id ?? "");
		setDayOfWeek(row?.dayOfWeek ?? 1);
		setPeriod(row?.period ?? 1);
		setOpen(true);
	};
	const grouped = [
		1,
		2,
		3,
		4,
		5
	].map((d) => ({
		day: d,
		items: rows.filter((r) => r.dayOfWeek === d)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mb-3",
			onClick: () => start(),
			children: "Tambah jadwal"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 font-display text-lg",
				children: DAY_NAMES[g.day]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: g.items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							"Jam ",
							s.period,
							" · ",
							s.className,
							" · ",
							s.subjectName
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							s.startTime,
							"–",
							s.endTime,
							" · ",
							s.teacherName
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => start(s),
							children: "Ubah"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => void deleteSchedule({ data: { id: s.id } }).then(() => {
								toast.success("Jadwal dihapus");
								onChange();
							}),
							children: "Hapus"
						})]
					})]
				}, s.id))
			})] }, g.day))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: editing ? "Ubah jadwal" : "Jadwal baru",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kelas",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: classId,
								onChange: (e) => setClassId(e.target.value),
								children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pelajaran",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: subjectId,
								onChange: (e) => setSubjectId(e.target.value),
								children: subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pengampu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: teacherStaffId,
								onChange: (e) => setTeacherStaffId(e.target.value),
								children: staff.filter((s) => s.isGuru).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Hari",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: dayOfWeek,
								onChange: (e) => setDayOfWeek(Number(e.target.value)),
								children: [
									1,
									2,
									3,
									4,
									5,
									6
								].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: DAY_NAMES[d]
								}, d))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Jam ke",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: period,
								onChange: (e) => setPeriod(Number(e.target.value)),
								children: [
									1,
									2,
									3,
									4,
									5,
									6
								].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p,
									children: p
								}, p))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => {
								const t = PERIOD_TIMES[period] ?? {
									start: "07:00",
									end: "07:40"
								};
								upsertSchedule({ data: {
									id: editing?.id,
									classId,
									subjectId,
									teacherStaffId,
									dayOfWeek,
									period,
									startTime: t.start,
									endTime: t.end
								} }).then(() => {
									toast.success("Jadwal disimpan");
									setOpen(false);
									onChange();
								});
							},
							children: "Simpan"
						})
					]
				})
			})
		})
	] });
}
function MuridTab({ rows, classes, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [nis, setNis] = (0, import_react.useState)("");
	const [classId, setClassId] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("L");
	const start = (row) => {
		setEditing(row ?? null);
		setName(row?.name ?? "");
		setNis(row?.nis ?? "");
		setClassId(row?.classId ?? classes[0]?.id ?? "");
		setGender(row?.gender ?? "L");
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mb-3",
			onClick: () => start(),
			children: "Tambah murid"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						s.className,
						" · NIS ",
						s.nis,
						" · ",
						s.gender === "L" ? "Laki-laki" : "Perempuan"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => start(s),
						children: "Ubah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => void deleteStudent({ data: { id: s.id } }).then(() => {
							toast.success("Murid dihapus");
							onChange();
						}),
						children: "Hapus"
					})]
				})]
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: editing ? "Ubah murid" : "Murid baru",
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
							label: "NIS",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nis,
								onChange: (e) => setNis(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kelas",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: classId,
								onChange: (e) => setClassId(e.target.value),
								children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Jenis kelamin",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: gender,
								onChange: (e) => setGender(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "L",
									children: "Laki-laki"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "P",
									children: "Perempuan"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => void upsertStudent({ data: {
								id: editing?.id,
								name,
								nis,
								classId,
								gender
							} }).then(() => {
								toast.success("Murid disimpan");
								setOpen(false);
								onChange();
							}),
							children: "Simpan"
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { Page as component };
