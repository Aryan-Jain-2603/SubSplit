import { cn } from "../../lib/utils";

function TextField({
  id,
  label,
  hint,
  error,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[color:var(--color-text-strong)]"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 text-sm text-[color:var(--color-text-strong)] shadow-sm outline-none transition placeholder:text-[color:var(--color-text-soft)] focus:border-[color:var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-primary-soft)]",
          error &&
            "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-100",
          inputClassName,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-[color:var(--color-text-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default TextField;
