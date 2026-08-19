import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../firebase/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginWithEmail(email);

      if (!result.success) {
        setError(
          "That email isn't registered yet. Please create an account first.",
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">THE ARTICULATE CLUB</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Enter the email you registered with.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Checking..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
}
