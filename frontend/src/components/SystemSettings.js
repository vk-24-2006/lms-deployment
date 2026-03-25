import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function SystemSettings() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleUpdate = async (id, email, password) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/system/update-user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Credential Updated successfully");
    } else {
      alert(data.message || "Error updating");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)", 
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <div style={{ ...styles.pageWrapper, padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
           <h1 style={{ color: "#38bdf8", margin: 0 }}>⚙ System Settings</h1>
           <button style={{ ...styles.navButton, borderColor: "#334155" }} onClick={() => navigate(-1)}>⬅ Back</button>
        </div>
        
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Modify user credentials and system access</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {users.map((user) => (
            <UserEditCard key={user._id} user={user} onUpdate={handleUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserEditCard({ user, onUpdate }) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  return (
    <div style={{ 
      padding: "25px", 
      background: "#1e293b", 
      borderRadius: "12px", 
      border: "1px solid #334155",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <h3 style={{ color: "#38bdf8", margin: 0 }}>{user.name}</h3>
        <span style={{ fontSize: "0.7rem", background: "#334155", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>{user.role}</span>
      </div>
      
      <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Email Address</label>
      <input 
        style={{ ...styles.input, marginBottom: "15px", background: "#0f172a", border: "1px solid #334155", color: "white" }} 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      
      <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>New Password</label>
      <input 
        style={{ ...styles.input, marginBottom: "20px", background: "#0f172a", border: "1px solid #334155", color: "white" }} 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Leave blank to keep current"
      />
      
      <button 
        style={{ ...styles.mainButton, width: "100%", background: "#38bdf8", color: "#0f172a", fontWeight: "bold" }} 
        onClick={() => onUpdate(user._id, email, password)}
      >
        Update Credentials
      </button>
    </div>
  );
}

export default SystemSettings;