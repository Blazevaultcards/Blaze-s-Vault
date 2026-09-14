import { useState, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FG, MUTED, GOLD, CARD_BG, BORDER, RED } from "@/theme";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    const from = location.state?.from?.pathname || "/account";
    navigate(from, { replace: true });
  }

  return (
    <div className="page-fade px-6 pt-32 pb-24">
      <div className="max-w-sm mx-auto">
        <h1 className="font-display font-black text-3xl mb-1" style={{ color: FG }}>
          SIGN IN
        </h1>
        <p className="text-sm mb-8" style={{ color: MUTED }}>
          Sign in to check out, track orders, and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value={password} onChange={setPassword} />

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg" style={{ background: "rgba(196,26,26,0.12)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: MUTED }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: GOLD }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs mb-1 block" style={{ color: MUTED }}>
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
      />
    </label>
  );
}
