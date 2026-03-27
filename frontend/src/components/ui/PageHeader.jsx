function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white/92 p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary-strong)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text-strong)] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-base leading-7 text-[color:var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
