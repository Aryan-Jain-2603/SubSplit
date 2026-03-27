import { cn } from "../../lib/utils";

function TextareaField({ id, label, hint, error, className, ...props }) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[color:var(--color-text-strong)]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={cn(
          "w-full rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3 text-sm text-[color:var(--color-text-strong)] shadow-sm outline-none transition placeholder:text-[color:var(--color-text-soft)] focus:border-[color:var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-primary-soft)]",
          error && "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-100",
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {hint ? <p className="text-sm text-[color:var(--color-text-muted)]">{hint}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
    </div>
  );
}

export default TextareaField;
