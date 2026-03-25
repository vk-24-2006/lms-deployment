import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const view = location.state?.view;

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  // Inventory Form States
  const [newBookName, setNewBookName] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookCategory, setNewBookCategory] = useState("");
  const [newBookAvailable, setNewBookAvailable] = useState("");

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUser(await res.json());
      else navigate("/login");
    } catch (error) { navigate("/login"); }
  }, [navigate]);

  const loadBooks = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      }
    } catch (error) { console.error("Error loading books", error); }
  }, []);

  const loadAllHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users/all-borrow-history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setBorrowHistory(await res.json());
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      if (view === "history") loadAllHistory();
      else if (user.role === "employee" || user.role === "owner") loadBooks();
    }
  }, [user, view, loadAllHistory, loadBooks]);

  const issueFine = async (borrowId) => {
    const amount = prompt("Enter fine amount (₹):");
    if (!amount) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/users/add-fine/${borrowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    if (res.ok) { alert("Fine Issued and User Blocked!"); loadAllHistory(); }
  };

  const handleReturn = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/users/return-book/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadAllHistory();
  };

  const addBook = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        name: newBookName, 
        author: newBookAuthor, 
        category: newBookCategory, 
        available: Number(newBookAvailable) 
      }),
    });
    if (res.ok) {
      setNewBookName(""); setNewBookAuthor(""); setNewBookCategory(""); setNewBookAvailable("");
      loadBooks();
    }
  };

  const deleteBook = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadBooks();
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "radial-gradient(circle at top right, #1e293b, #0f172a)", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ ...styles.pageWrapper, padding: "40px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ color: "#38bdf8", margin: 0 }}>
              {view === "history" ? "👥 Manage Records" : "🛡 Inventory Portal"}
            </h1>
            <p style={{ color: "#94a3b8" }}>Access: {user.role.toUpperCase()}</p>
          </div>
          <button style={{ ...styles.navButton, borderColor: "#334155" }} onClick={() => navigate(-1)}>⬅ Back</button>
        </div>

        {view === "history" ? (
          /* MANAGE RECORDS VIEW */
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
            {borrowHistory.length > 0 ? (
              borrowHistory.map((rec) => (
                <div key={rec._id} style={{ borderBottom: "1px solid #334155", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 style={{ margin: 0, color: "#38bdf8" }}>{rec.user?.name}</h3>
                      {/* Return Status Badge */}
                      <span style={{ fontSize: "0.7rem", padding: "3px 8px", borderRadius: "10px", background: rec.status === "returned" ? "#4ade80" : "#fbbf24", color: "#0f172a", fontWeight: "bold" }}>
                        {rec.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "5px 0" }}>
                      Due: {new Date(rec.dueDate).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: "0.9rem", margin: "5px 0" }}>Books: {rec.books.map(b => b.name).join(", ")}</p>
                  </div>

                  {/* Fine Status Section */}
                  <div style={{ flex: 1, textAlign: "right", marginRight: "20px" }}>
                    {rec.user?.fine > 0 ? (
                      <div>
                        <p style={{ color: "#ef4444", fontWeight: "bold", margin: 0 }}>Fine: ₹{rec.user.fine}</p>
                        <p style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}>UNPAID (BLOCKED)</p>
                      </div>
                    ) : (
                      <p style={{ color: "#4ade80", fontWeight: "bold", margin: 0 }}>No Fines / Paid</p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {rec.status === "borrowed" && (
                      <button style={{ ...styles.mainButton, background: "#4ade80", color: "#0f172a", padding: "8px 15px" }} onClick={() => handleReturn(rec._id)}>Return</button>
                    )}
                    {user.role === "owner" && (
                      <button style={{ ...styles.mainButton, background: "#f59e0b", color: "#0f172a", padding: "8px 15px" }} onClick={() => issueFine(rec._id)}>Issue Fine</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: "20px", color: "#94a3b8" }}>No records found.</p>
            )}
          </div>
        ) : (
          /* INVENTORY VIEW */
          <div>
            <div style={{ background: "#1e293b", padding: "25px", borderRadius: "12px", border: "1px solid #334155", marginBottom: "40px" }}>
              <h2 style={{ color: "#38bdf8", marginTop: 0 }}>Add New Book</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input style={{ ...styles.input, flex: 2, background: "#0f172a" }} value={newBookName} onChange={(e) => setNewBookName(e.target.value)} placeholder="Title" />
                <input style={{ ...styles.input, flex: 2, background: "#0f172a" }} value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} placeholder="Author" />
                <input style={{ ...styles.input, flex: 1, background: "#0f172a" }} value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} placeholder="Category" />
                <input style={{ ...styles.input, flex: 1, background: "#0f172a" }} value={newBookAvailable} onChange={(e) => setNewBookAvailable(e.target.value)} placeholder="Qty" type="number" />
                <button style={{ ...styles.mainButton, background: "#38bdf8", color: "#0f172a", padding: "0 20px" }} onClick={addBook}>Add</button>
              </div>
            </div>

            <h2 style={{ color: "#38bdf8", marginBottom: "20px" }}>Current Inventory</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {books.map((book) => (
                <div key={book._id} style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ margin: 0, color: "#38bdf8" }}>{book.name}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{book.author} | {book.category}</p>
                  <p style={{ color: book.available > 0 ? "#4ade80" : "#ef4444", fontWeight: "bold" }}>Stock: {book.available}</p>
                  <button style={{ ...styles.mainButton, background: "#ef4444", width: "100%", marginTop: "10px", padding: "8px" }} onClick={() => deleteBook(book._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;