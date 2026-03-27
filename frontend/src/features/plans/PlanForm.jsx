import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import DateField from "../../components/ui/DateField";
import FormSection from "../../components/ui/FormSection";
import PageHeader from "../../components/ui/PageHeader";
import SelectField from "../../components/ui/SelectField";
import TextField from "../../components/ui/TextField";
import TextareaField from "../../components/ui/TextareaField";
import { PLAN_CATEGORIES, PLAN_TYPES } from "../../lib/constants";

const defaultValues = {
  name: "",
  description: "",
  type: "",
  categories: "",
  price: "",
  slots: "",
  email: "",
  password: "",
  expDate: "",
  image: "",
};

function PlanForm({
  title,
  description,
  submitLabel,
  initialValues,
  onSubmit,
  isPending,
  error,
}) {
  const [values, setValues] = useState(() => ({ ...defaultValues, ...initialValues }));

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plan management"
        title={title}
        description={description}
        actions={
          <Button variant="ghost" asChild>
            <Link to="/dashboard/subscriptions">Back to dashboard</Link>
          </Button>
        }
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormSection
          title="Basic information"
          description="Start with the subscription name and a short explanation of what the shared plan includes."
        >
          <TextField
            id="plan-name"
            label="Subscription name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Netflix Premium"
            required
          />
          <TextareaField
            id="plan-description"
            label="Description"
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Tell subscribers what this plan covers and any practical notes."
            required
          />
        </FormSection>

        <FormSection
          title="Plan configuration"
          description="Keep these values aligned with the backend model so browse and prediction flows stay consistent."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField
              id="plan-type"
              label="Plan type"
              value={values.type}
              onChange={(event) => updateField("type", event.target.value)}
              required
            >
              <option value="">Select a plan type</option>
              {PLAN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="plan-category"
              label="Category"
              value={values.categories}
              onChange={(event) => updateField("categories", event.target.value)}
              required
            >
              <option value="">Select a category</option>
              {PLAN_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>
          </div>
        </FormSection>

        <FormSection
          title="Pricing and slots"
          description="These values drive browse visibility, join eligibility, and the payment flow."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              id="plan-price"
              type="number"
              min="1"
              label="Price per slot"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="299"
              required
            />
            <TextField
              id="plan-slots"
              type="number"
              min="1"
              label="Available slots"
              value={values.slots}
              onChange={(event) => updateField("slots", event.target.value)}
              placeholder="4"
              required
            />
          </div>
        </FormSection>

        <FormSection
          title="Access details"
          description="These credentials are revealed only to users who joined the plan through the dashboard."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              id="plan-email"
              type="email"
              label="Shared account email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
            <TextField
              id="plan-password"
              type="text"
              label="Shared account password"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />
          </div>
        </FormSection>

        <FormSection
          title="Expiry and image"
          description="Set the renewal context and the visual identity used across browse and dashboard cards."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <DateField
              id="plan-expiry"
              label="Expiry date"
              value={values.expDate}
              onChange={(event) => updateField("expDate", event.target.value)}
              required
            />
            <TextField
              id="plan-image"
              type="url"
              label="Image URL"
              value={values.image}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="https://..."
            />
          </div>
        </FormSection>

        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" asChild>
              <Link to="/dashboard/subscriptions">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlanForm;
