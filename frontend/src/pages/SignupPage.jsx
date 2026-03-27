import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import TextField from "../components/ui/TextField";
import { useAuth } from "../app/useAuth";

function SignupPage() {
  const navigate = useNavigate();
  const { signup, signupState, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/plans", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await signup(formData);
      navigate("/plans", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1fr_30rem] lg:py-12">
      <div className="order-2 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(236,250,245,0.82))] p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:order-1">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
          Start saving
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-strong)] sm:text-5xl">
          Create a CraveCart account and keep the same backend session model.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-muted)]">
          Signup remains backed by Passport and MongoDB. The difference is the frontend now handles
          the experience without falling back to full page reloads.
        </p>
      </div>

      <div className="order-1 lg:order-2">
        <AuthForm
          title="Create account"
          description="Your session will be established immediately after signup."
          footerPrompt="Already have an account?"
          footerLinkLabel="Login instead"
          footerLinkTo="/login"
          onSubmit={handleSubmit}
          isPending={signupState.isPending}
          error={error}
          submitLabel="Create account"
        >
          <TextField
            id="username"
            name="username"
            label="Username"
            placeholder="Choose a username"
            autoComplete="username"
            value={formData.username}
            onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
            required
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            hint="Use the same credentials model the backend already expects."
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </AuthForm>
      </div>
    </div>
  );
}

export default SignupPage;
