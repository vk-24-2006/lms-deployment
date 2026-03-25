import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function BorrowTrack() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("http://localhost:5000/api/users/borrow-history", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleReturn = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/users/return-book/${id}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (res.ok) {
      alert("Books Returned!");
      fetchHistory(); // Refresh list
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1 style={{ color: "#38bdf8" }}>📋 My Borrowing History</h1>
        <button onClick={() => navigate("/user-dashboard")} style={styles.navButton}>Back</button>
      </div>

      {loading ? (
        <h3>Loading your records...</h3>
      ) : history.length > 0 ? (
        <div style={{ display: "grid", gap: "20px" }}>
          {history.map((record) => (
            <div key={record._id} style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                <span style={{ color: record.status === "returned" ? "#4ade80" : "#fbbf24", fontWeight: "bold" }}>
                  Status: {record.status.toUpperCase()}
                </span>
                <span style={{ color: "#94a3b8" }}>Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</span>
              </div>
              
              <div style={{ padding: "15px 0" }}>
                {record.books.map((book, i) => (
                  <p key={i} style={{ margin: "5px 0" }}>📖 {book.name} <span style={{ color: "#64748b" }}>by {book.author}</span></p>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <p style={{ color: "#38bdf8", margin: 0 }}>📅 Due: {new Date(record.dueDate).toLocaleDateString()}</p>
                {record.status === "borrowed" && (
                  <button onClick={() => handleReturn(record._id)} style={{ ...styles.mainButton, background: "#4ade80", color: "#0f172a", padding: "8px 20px" }}>
                    Return Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <p style={{ color: "#94a3b8" }}>You haven't borrowed any books yet.</p>
          <button style={styles.mainButton} onClick={() => navigate("/user-dashboard")}>Go to Search</button>
        </div>
      )}
    </div>
  );
}

export default BorrowTrack;