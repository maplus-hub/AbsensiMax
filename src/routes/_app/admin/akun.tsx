import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/input";
import { listStaff, setStaffActive, upsertStaff } from "@/lib/school/api";
import { RoleGuard } from "@/lib/school/guard";
import type { Staff } from "@/lib/school/types";

export const Route = createFileRoute("/_app/admin/akun")({ component: Page });

function Page() {
  return (
    <RoleGuard role="admin">
      <AkunPage />
    </RoleGuard>
  );
}

function rolesText(s: Staff) {
  return [
    s.isAdmin ? "Admin" : null,
    s.isGuru ? "Guru" : null,
    s.isWali ? "Wali kelas" : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function AkunPage() {
  const [rows, setRows] = useState<Staff[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const load = () => {
    void listStaff().then(setRows).catch(() => setRows([]));
  };
  useEffect(load, []);

  return (
    <div>
      <PageHeader
        kicker="Pengaturan"
        title="Akun guru & wali kelas"
        desc="Daftarkan staf dengan email. Setelah mereka masuk memakai email yang sama, akun otomatis tertaut."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Tambah staf
          </Button>
        }
      />
      <div className="space-y-2">
        {(rows ?? []).map((s) => (
          <Card key={s.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted">{s.email}</p>
              <p className="mt-1 text-xs text-subtle">
                {rolesText(s)}
                {s.nip ? ` · NIP ${s.nip}` : ""}
                {s.userId ? " · tertaut" : " · menunggu masuk"}
                {s.active ? "" : " · nonaktif"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(s);
                  setOpen(true);
                }}
              >
                Ubah
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  void setStaffActive({ data: { id: s.id, active: !s.active } })
                    .then(() => {
                      toast.success(s.active ? "Dinonaktifkan" : "Diaktifkan");
                      load();
                    })
                    .catch((e) => toast.error(e instanceof Error ? e.message : "Gagal"));
                }}
              >
                {s.active ? "Nonaktifkan" : "Aktifkan"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <StaffDialog
        open={open}
        onOpenChange={setOpen}
        staff={editing}
        onSaved={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}

function StaffDialog({
  open,
  onOpenChange,
  staff,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  staff: Staff | null;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuru, setIsGuru] = useState(true);
  const [isWali, setIsWali] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
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
      await upsertStaff({
        data: { id: staff?.id, name, email, nip, isAdmin, isGuru, isWali },
      });
      toast.success("Staf disimpan");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={staff ? "Ubah staf" : "Staf baru"}>
        <div className="space-y-3">
          <Field label="Nama">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="NIP">
            <Input value={nip} onChange={(e) => setNip(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-3 pt-1 text-sm">
            <label className="flex h-11 items-center gap-2">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
              Admin
            </label>
            <label className="flex h-11 items-center gap-2">
              <input type="checkbox" checked={isGuru} onChange={(e) => setIsGuru(e.target.checked)} />
              Guru
            </label>
            <label className="flex h-11 items-center gap-2">
              <input type="checkbox" checked={isWali} onChange={(e) => setIsWali(e.target.checked)} />
              Wali kelas
            </label>
          </div>
          <Button className="w-full" disabled={busy} onClick={() => void save()}>
            {busy ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
