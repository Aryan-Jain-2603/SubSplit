function LoadingState({ title = "Loading", description = "Please wait while we prepare the page." }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-[color:var(--color-surface-subtle)] animate-pulse" />
        <div className="h-7 w-52 rounded-full bg-[color:var(--color-surface-subtle)] animate-pulse" />
        <div className="h-4 w-full max-w-xl rounded-full bg-[color:var(--color-surface-subtle)] animate-pulse" />
      </div>
      <div className="mt-5 space-y-2 text-sm text-[color:var(--color-text-muted)]">
        <p className="font-semibold text-[color:var(--color-text-strong)]">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default LoadingState;
