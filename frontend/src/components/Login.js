import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      loginUser(data);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.role === "owner") navigate("/owner-dashboard");
        else if (data.role === "employee") navigate("/employee-dashboard");
        else navigate("/user-dashboard");
      }, 1500);

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <div style={{ ...styles.formCard, background: "#1e293b", color: "white", border: "1px solid #334155", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
        <h2 style={{ textAlign: "center", color: "#38bdf8", marginBottom: "20px" }}>Library Login</h2>
        {error && <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "#4ade80", textAlign: "center" }}>{success}</p>}
        <form onSubmit={handleLogin}>
          <input style={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" style={{ ...styles.mainButton, background: "#38bdf8", color: "#0f172a", fontWeight: "bold" }}>Login</button>
          <button type="button" style={{ ...styles.navButton, marginTop: "10px", borderColor: "#475569" }} onClick={() => navigate("/")}>Home</button>
        </form>
        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#94a3b8" }}>
          Don’t have an account? <Link to="/register" style={{ color: "#38bdf8", textDecoration: "none" }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;