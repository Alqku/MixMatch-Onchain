"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserRole, type SignupRequest } from "@themixmatch/types";
import { register, AuthClientError } from "@/auth/auth-client";
import { useAuth } from "@/auth/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password || !role || loading) return;
    setLoading(true);
    setError(null);

    const payload: SignupRequest = {
      email: email.trim(),
      password,
      role: role as UserRole,
    };

    try {
      const session = await register(payload);
      signIn(session);
      router.push("/dashboard");
    } catch (caught) {
      setError(
        caught instanceof AuthClientError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : "Unable to create account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <h1 className="headline">Create your MixMatch account</h1>
        <p className="lede">
          Create a secure auth session and continue to your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              required
              disabled={loading}
            >
              <option value="">Select your role</option>
              <option value={UserRole.DJ}>DJ</option>
              <option value={UserRole.PLANNER}>Planner</option>
              <option value={UserRole.MUSIC_LOVER}>Music Lover</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
