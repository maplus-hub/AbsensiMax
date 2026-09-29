import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clockIn, clockOut } from "@/lib/school/api";
import type { TeacherAttendance } from "@/lib/school/types";
import { formatTimeWib } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ClockPanel({
  attendance,
  onChange,
}: {
  attendance: TeacherAttendance | null;
  onChange: () => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [busy, setBusy] = useState<"in" | "out" | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const clock = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
  const date = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

  return (
    <Card className="overflow-hidden bg-primary p-0 text-primary-fg">
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium tracking-[0.16em] text-primary-fg/70 uppercase">
          Absensi hari ini
        </p>
        <p className="font-display mt-2 text-4xl tabular-nums tracking-tight">{clock}</p>
        <p className="mt-1 text-sm text-primary-fg/80">{date} · WIB</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-primary-fg/85">
          {attendance ? (
            <span>
              {attendance.status === "hadir" ? "Hadir" : attendance.status} · Masuk{" "}
              {formatTimeWib(attendance.checkInAt)} · Pulang {formatTimeWib(attendance.checkOutAt)}
            </span>
          ) : (
            <span>Belum absen masuk</span>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            className="bg-primary-fg text-primary hover:bg-primary-fg/90"
            disabled={busy !== null || Boolean(attendance?.checkInAt)}
            onClick={() => void onIn()}
          >
            <LogIn className="size-4" />
            {busy === "in" ? "Menyimpan…" : "Masuk"}
          </Button>
          <Button
            variant="outline"
            className="border-primary-fg/30 text-primary-fg hover:bg-primary-fg/10"
            disabled={busy !== null || !attendance?.checkInAt || Boolean(attendance?.checkOutAt)}
            onClick={() => void onOut()}
          >
            <LogOut className="size-4" />
            {busy === "out" ? "Menyimpan…" : "Pulang"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
