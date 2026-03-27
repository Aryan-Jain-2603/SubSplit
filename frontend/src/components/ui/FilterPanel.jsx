import Button from "./Button";
import SelectField from "./SelectField";
import { PLAN_TYPES } from "../../lib/constants";
import { cn } from "../../lib/utils";

function FilterPanel({ filters, onChange, onClear, mode = "dialog" }) {
  const hasActiveFilters = Boolean(filters.type || filters.availability);

  if (mode === "dropdown") {
    return (
      <div className="w-[22rem] space-y-4 rounded-[var(--radius-xl)] border border-[color:color-mix(in_srgb,var(--color-border)_74%,white)] bg-white p-4 shadow-[0_24px_70px_-36px_rgba(30,41,59,0.42)]">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[color:var(--color-text-strong)]">Refine plans</p>
          <p className="text-xs leading-5 text-[color:var(--color-text-muted)]">
            Narrow the list by tier and availability.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            id="type-filter"
            label="Type"
            className="space-y-1"
            value={filters.type}
            onChange={(event) => onChange("type", event.target.value)}
          >
            <option value="">All</option>
            {PLAN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="availability-filter"
            label="Availability"
            className="space-y-1"
            value={filters.availability}
            onChange={(event) => onChange("availability", event.target.value)}
          >
            <option value="">Any</option>
            <option value="open">Open</option>
          </SelectField>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-3">
          <p className="text-xs font-medium text-[color:var(--color-text-soft)]">
            {hasActiveFilters ? "Filters applied" : "No active filters"}
          </p>
          <Button className="min-w-24" variant="ghost" onClick={onClear} disabled={!hasActiveFilters}>
            Clear
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-5 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]",
        mode === "dialog" && "p-5",
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Filters</h2>
        <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">
          Narrow the marketplace by plan tier and slot availability.
        </p>
      </div>

      <SelectField
        id="type-filter"
        label="Plan type"
        value={filters.type}
        onChange={(event) => onChange("type", event.target.value)}
      >
        <option value="">All types</option>
        {PLAN_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="availability-filter"
        label="Availability"
        value={filters.availability}
        onChange={(event) => onChange("availability", event.target.value)}
      >
        <option value="">Any status</option>
        <option value="open">Open slots only</option>
      </SelectField>

      <Button className="w-full" variant="ghost" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

export default FilterPanel;
