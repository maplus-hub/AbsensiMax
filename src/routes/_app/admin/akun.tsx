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
  return [s.isAdmin ? "Admin" : null, s.isGuru ? "Guru" : null, s.isWali ? "Wali kelas" : null]
    .filter(Boolean)
    .join(" · ");
}

function AkunPage() {
  const [rows, setRows] = useState<Staff[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [accountNotice, setAccountNotice] = useState<{
    name: string;
    email: string;
    created: boolean;
  } | null>(null);

  const load = () => {
    void listStaff()
      .then(setRows)
      .catch(() => setRows([]));
  };
  useEffect(load, []);

  return (
    <div>
      <PageHeader
        kicker="Pengaturan"
        title="Akun guru & wali kelas"
        desc="Tambahkan staf untuk langsung membuat akun Guru atau Wali Kelas di aplikasi Android."
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
      {accountNotice && (
        <Card
          className={`mb-4 border ${
            accountNotice.created ? "border-primary/20 bg-surface-2" : "border-alpha/30 bg-alpha/5"
          }`}
        >
          {accountNotice.created ? (
            <>
              <p className="font-medium">Akun Android untuk {accountNotice.name} siap digunakan.</p>
              <p className="mt-1 text-sm text-muted">
                Email: {accountNotice.email} · Kata sandi awal: <strong>AbsensiMax</strong>. Minta
                staf menggantinya saat pertama masuk.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                Data staf {accountNotice.name} tersimpan, tetapi akun Android belum dibuat.
              </p>
              <p className="mt-1 text-sm text-muted">
                Perbarui backend Supabase terlebih dahulu. Setelah itu, pilih Ubah staf ini lalu
                Simpan untuk membuat akunnya.
              </p>
            </>
          )}
        </Card>
      )}
      <div className="space-y-2">
        {(rows ?? []).map((s) => (
          <Card
            key={s.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
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
        onSaved={(status, account) => {
          setOpen(false);
          setAccountNotice(
            status === "saved" ? null : { ...account, created: status === "created" },
          );
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
  onSaved: (
    status: "created" | "pending" | "saved",
    account: { name: string; email: string },
  ) => void;
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
      const result = await upsertStaff({
        data: { id: staff?.id, name, email, nip, isAdmin, isGuru, isWali },
      });
      const accountExpected = !staff?.userId && !isAdmin && (isGuru || isWali);
      const status = result.accountCreated ? "created" : accountExpected ? "pending" : "saved";
      if (status === "created") {
        toast.success(
          "Akun dibuat. Kata sandi awal: AbsensiMax. Staf akan diminta menggantinya saat masuk.",
        );
      } else if (status === "pending") {
        toast.error("Data staf disimpan, tetapi akun Android belum dibuat oleh backend.");
      } else {
        toast.success("Staf disimpan");
      }
      onSaved(status, { name, email });
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
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={Boolean(staff?.userId)}
            />
          </Field>
          {staff?.userId && (
            <p className="text-xs text-muted">
              Email akun yang sudah terhubung tidak dapat diubah di sini.
            </p>
          )}
          {!staff && !isAdmin && (isGuru || isWali) && (
            <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-muted">
              Akun Android dibuat langsung. Kata sandi awal <strong>AbsensiMax</strong> dan wajib
              diganti saat pertama masuk.
            </p>
          )}
          {!staff && isAdmin && (isGuru || isWali) && (
            <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-muted">
              Staf dengan peran Admin hanya menggunakan aplikasi web. Akun Android tidak dibuat.
            </p>
          )}
          <Field label="NIP">
            <Input value={nip} onChange={(e) => setNip(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-3 pt-1 text-sm">
            <label className="flex h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Admin
            </label>
            <label className="flex h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={isGuru}
                onChange={(e) => setIsGuru(e.target.checked)}
              />
              Guru
            </label>
            <label className="flex h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={isWali}
                onChange={(e) => setIsWali(e.target.checked)}
              />
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
