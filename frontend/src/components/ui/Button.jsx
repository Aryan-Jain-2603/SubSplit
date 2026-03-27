import { cloneElement, isValidElement } from "react";
import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-[color:var(--color-primary-strong)] text-white shadow-[var(--shadow-soft)] hover:bg-[color:var(--color-primary)]",
  secondary:
    "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary-strong)] hover:bg-[color:var(--color-surface-elevated)]",
  ghost:
    "bg-transparent text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-surface-subtle)]",
  outline:
    "border border-[color:var(--color-border-strong)] bg-white text-[color:var(--color-text-strong)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary-strong)]",
  danger:
    "bg-rose-600 text-white shadow-[var(--shadow-soft)] hover:bg-rose-700",
};

function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] disabled:pointer-events-none disabled:opacity-55",
    size === "md" && "min-h-11 px-5 text-sm",
    size === "lg" && "min-h-12 px-6 text-sm",
    variants[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
      ...props,
    });
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
