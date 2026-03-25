import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const userRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) return navigate("/login");
        const userData = await userRes.json();
        if (userData.role !== "owner") return navigate("/login");
        setUser(userData);

        const usersRes = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const uData = await usersRes.json();
          const usersList = Array.isArray(uData) ? uData : (uData.users || []);
          setUsers(usersList);
        }

        const booksRes = await fetch("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (booksRes.ok) {
          const bData = await booksRes.json();
          const booksList = Array.isArray(bData) ? bData : (bData.books || []);
          setBooks(booksList);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchData();
  }, [navigate]);

  if (!user) return null;

  const employees = users.filter(u => u.role === "employee");
  const normalUsers = users.filter(u => u.role === "user");

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)", 
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <button 
        onClick={handleLogout} 
        style={{ 
          position: "fixed", 
          top: "20px", 
          right: "20px", 
          padding: "10px 20px", 
          backgroundColor: "#ef4444", 
          color: "white", 
          border: "none", 
          borderRadius: "6px", 
          cursor: "pointer", 
          fontWeight: "bold",
          zIndex: 100 
        }}
      >
        Logout
      </button>

      <div style={{ ...styles.pageWrapper, padding: "80px 40px", color: "white" }}>
        <h1 style={{ color: "#38bdf8" }}>👑 Owner Control Panel</h1>
        <p style={{ color: "#94a3b8" }}>Welcome back, {user.name}</p>

        <div style={styles.featuresSection}>
          <div style={{ ...styles.featureCard, background: "#1e293b", border: "1px solid #334155" }}>
            <h2 style={{ color: "#38bdf8" }}>👤 Total Users</h2>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{normalUsers.length}</p>
          </div>
          <div style={{ ...styles.featureCard, background: "#1e293b", border: "1px solid #334155" }}>
            <h2 style={{ color: "#38bdf8" }}>👨‍💼 Employees</h2>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{employees.length}</p>
          </div>
          <div style={{ ...styles.featureCard, background: "#1e293b", border: "1px solid #334155" }}>
            <h2 style={{ color: "#38bdf8" }}>📚 Total Books</h2>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{books.length}</p>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <button style={{ ...styles.mainButton, background: "#38bdf8", color: "#0f172a", fontWeight: "bold", border: "none" }} onClick={() => navigate("/dashboard", { state: { view: "history" } })}>Manage Users</button>
          <button style={{ ...styles.mainButton, marginLeft: "10px", background: "transparent", border: "1px solid #38bdf8", color: "#38bdf8" }} onClick={() => navigate("/system-settings")}>System Settings</button>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;