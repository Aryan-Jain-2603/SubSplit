import Button from "./Button";
import SelectField from "./SelectField";
import { PLAN_TYPES } from "../../lib/constants";

function FilterPanel({ filters, onChange, onClear }) {
  return (
    <div className="space-y-5 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
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
