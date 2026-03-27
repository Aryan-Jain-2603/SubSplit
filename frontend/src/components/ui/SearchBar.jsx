import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

function SearchBar({
  value,
  onChange,
  placeholder = "Search plans by name, type, or category",
  className,
}) {
  return (
    <label
      className={cn(
        "flex h-13 items-center gap-3 rounded-full border border-[color:var(--color-border)] bg-white px-5 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <MagnifyingGlassIcon className="h-5 w-5 text-[color:var(--color-text-muted)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[color:var(--color-text-strong)] outline-none placeholder:text-[color:var(--color-text-soft)]"
      />
    </label>
  );
}

export default SearchBar;
