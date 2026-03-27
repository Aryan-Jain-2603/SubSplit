import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "./Button";

function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm transition data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-6 shadow-2xl transition data-[closed]:scale-95 data-[closed]:opacity-0">
          <DialogTitle className="text-lg font-semibold text-[color:var(--color-text-strong)]">
            {title}
          </DialogTitle>
          <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
            {description}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isPending}>
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} disabled={isPending}>
              {isPending ? "Working..." : confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
