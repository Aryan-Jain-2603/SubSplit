function FormSection({ title, description, children }) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-strong)]">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">{description}</p>
        ) : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default FormSection;
