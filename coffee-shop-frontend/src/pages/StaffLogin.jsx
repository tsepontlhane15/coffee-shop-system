import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.token);
      navigate("/staff/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2.8rem 2.5rem",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>☕</div>
          <h2 style={{ color: "#3c2f2f", marginBottom: "0.3rem" }}>Staff Login</h2>
          <p style={{ color: "#777", fontSize: "0.95rem" }}>
            LIBATA COFFE SHOP
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "500", color: "#444" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.8rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "500", color: "#444" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#c0392b", marginBottom: "1.2rem", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#3c2f2f",
              color: "white",
              border: "none",
              padding: "0.95rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "1.05rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#888", fontSize: "0.9rem" }}>
          Default: <strong>staff</strong> / <strong>staff123</strong>
        </p>
      </div>
    </div>
  );
}

export default StaffLogin;