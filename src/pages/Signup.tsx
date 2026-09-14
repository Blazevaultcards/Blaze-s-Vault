import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FG, MUTED, GOLD, RED } from "@/theme";
import { useAuth } from "@/context/AuthContext";
import { Field } from "@/pages/Login";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="page-fade px-6 pt-32 pb-24 max-w-sm mx-auto text-center">
        <h1 className="font-display font-black text-2xl mb-3" style={{ color: FG }}>
          Check Your Email
        </h1>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          We sent a confirmation link to {email}. Confirm it, then sign in to start shopping.
        </p>
        <Link to="/login" style={{ color: GOLD }} className="text-sm">
          Go to Sign In →
        </Link>
      </div>
    );
  }

  return (
    <div className="page-fade px-6 pt-32 pb-24">
      <div className="max-w-sm mx-auto">
        <h1 className="font-display font-black text-3xl mb-1" style={{ color: FG }}>
          CREATE ACCOUNT
        </h1>
        <p className="text-sm mb-8" style={{ color: MUTED }}>
          Customer accounts only — this is for checking out and tracking your orders.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" type="text" value={fullName} onChange={setFullName} />
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: MUTED }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: GOLD }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
