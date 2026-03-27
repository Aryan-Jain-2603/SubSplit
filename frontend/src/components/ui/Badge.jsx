import { cn } from "../../lib/utils";

const toneClasses = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary-strong)]",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

function Badge({ children, tone = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
