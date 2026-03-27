import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import TextField from "../components/ui/TextField";
import { useAuth } from "../app/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginState, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.redirectTo || "/plans", { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate(location.state?.redirectTo || "/plans", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1fr_28rem] lg:py-12">
      <div className="order-2 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(231,238,255,0.72))] p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:order-1">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary-strong)]">
          Welcome back
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-strong)] sm:text-5xl">
          Pick up where your subscription workflow left off.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-muted)]">
          Sign in with your existing CraveCart account to keep your wallet, hosted listings, and
          joined subscriptions attached to the same Express session.
        </p>
      </div>

      <div className="order-1 lg:order-2">
        <AuthForm
          title="Sign in"
          description="Use your existing username and password. Session cookies stay on the backend."
          footerPrompt="Need an account?"
          footerLinkLabel="Create one"
          footerLinkTo="/signup"
          onSubmit={handleSubmit}
          isPending={loginState.isPending}
          error={error}
          submitLabel="Login"
        >
          <TextField
            id="username"
            name="username"
            label="Username"
            placeholder="Enter your username"
            autoComplete="username"
            value={formData.username}
            onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
            required
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </AuthForm>
      </div>
    </div>
  );
}

export default LoginPage;
