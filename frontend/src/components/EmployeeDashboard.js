import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBookName, setNewBookName] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookCategory, setNewBookCategory] = useState("");
  const [newBookAvailable, setNewBookAvailable] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const [updatedAvailability, setUpdatedAvailability] = useState("");
  const [view, setView] = useState("dashboard"); 
  const [allRecords, setAllRecords] = useState([]);

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
        if (userData.role !== "employee") return navigate("/login");
        setUser(userData);
        await refreshBooks(token);
        
        // Fetch records immediately to calculate stats
        const recRes = await fetch("http://localhost:5000/api/users/all-borrow-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const recData = await recRes.json();
        if (recRes.ok) setAllRecords(recData);

      } catch (err) { navigate("/login"); }
    };
    fetchData();
  }, [navigate]);

  const refreshBooks = async (token) => {
    const booksRes = await fetch("http://localhost:5000/api/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (booksRes.ok) {
      const booksData = await booksRes.json();
      setBooks(Array.isArray(booksData) ? booksData : []);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!newBookName || !newBookAuthor || !newBookCategory) return alert("Please fill all fields");

      const res = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newBookName,
          author: newBookAuthor,
          category: newBookCategory,
          available: Number(newBookAvailable),
        }),
      });

      if (res.ok) {
        alert("Book added successfully!");
        await refreshBooks(token);
        setNewBookName(""); setNewBookAuthor(""); setNewBookCategory(""); setNewBookAvailable(1);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateAvailability = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: Number(updatedAvailability) }),
      });

      if (res.ok) {
        alert("Availability updated!");
        setEditingBookId(null);
        await refreshBooks(token);
      }
    } catch (err) { console.error(err); }
  };

  // --- STATS CALCULATIONS ---
  const totalOnShelf = books.reduce((acc, book) => acc + (book.available || 0), 0);
  
  const currentlyIssued = allRecords
    .filter(rec => rec.status === "borrowed")
    .reduce((acc, rec) => acc + (rec.books?.length || 0), 0);

  const totalCataloged = totalOnShelf + currentlyIssued;

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <div style={{ color: "white", textAlign: "center", padding: "50px" }}>Loading Dashboard...</div>;

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "radial-gradient(circle at top right, #1e293b, #0f172a)", color: "white", fontFamily: "sans-serif" }}>
      <button onClick={handleLogout} style={{ position: "fixed", top: "20px", right: "20px", padding: "10px 20px", backgroundColor: "#1e293b", color: "white", border: "1px solid #475569", borderRadius: "6px", cursor: "pointer", zIndex: 100 }}>Logout</button>

      <div style={{ ...styles.pageWrapper, padding: "80px 40px" }}>
        <h1 style={{ color: "#38bdf8" }}>{view === "dashboard" ? "👨‍💼 Employee Workspace" : "📋 All Borrow Records"}</h1>
        
        {view === "dashboard" ? (
          <>
            <p style={{ color: "#94a3b8" }}>Welcome {user.name}</p>

            {/* --- ANALYTICS GRID --- */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px", marginTop: "20px" }}>
              <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", margin: "0 0 10px 0" }}>Total Cataloged</p>
                <h2 style={{ fontSize: "2rem", margin: 0, color: "#38bdf8" }}>{totalCataloged}</h2>
              </div>
              <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", margin: "0 0 10px 0" }}>Total Issued (Sold)</p>
                <h2 style={{ fontSize: "2rem", margin: 0, color: "#fbbf24" }}>{currentlyIssued}</h2>
              </div>
              <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", margin: "0 0 10px 0" }}>Stock Remaining</p>
                <h2 style={{ fontSize: "2rem", margin: 0, color: "#4ade80" }}>{totalOnShelf}</h2>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "300px", padding: "30px", background: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
                <h2 style={{ color: "#38bdf8" }}>➕ Add New Book</h2>
                <input style={styles.input} placeholder="Book Name" value={newBookName} onChange={(e) => setNewBookName(e.target.value)} />
                <input style={styles.input} placeholder="Author" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} />
                <input style={styles.input} placeholder="Category" value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} />
                <input style={styles.input} type="number" placeholder="Initial Quantity" value={newBookAvailable} onChange={(e) => setNewBookAvailable(e.target.value)} />
                <button style={{ ...styles.mainButton, width: "100%", background: "#38bdf8", color: "#0f172a", border: "none" }} onClick={handleAddBook}>Add to Library</button>
              </div>

              <div style={{ flex: "1", minWidth: "300px", background: "#1e293b", padding: "30px", borderRadius: "12px", border: "1px solid #334155", cursor: "pointer" }} onClick={() => setView("records")}>
                <h2 style={{ color: "#38bdf8" }}>📋 Borrow Logs</h2>
                <p style={{ color: "#94a3b8" }}>Total Records Found: {allRecords.length}</p>
                <p>Click here to manage returns and track user history.</p>
              </div>
            </div>

            <div style={{ marginTop: "50px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#94a3b8" }}>Manage Inventory</h2>
              <input style={{ ...styles.input, maxWidth: "300px", background: "#0f172a" }} placeholder="🔍 Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {filteredBooks.map((book) => (
                <div key={book._id} style={{ padding: "20px", background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", color: "white" }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    <strong style={{ fontSize: "1.1rem" }}>{book.name}</strong> <br />
                    <span style={{ color: "#94a3b8" }}>✍ {book.author}</span> <br />
                    <span style={{ color: "#38bdf8" }}>Stock: {book.available}</span>
                  </p>
                  {editingBookId === book._id ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input type="number" value={updatedAvailability} onChange={(e) => setUpdatedAvailability(e.target.value)} style={{ ...styles.input, marginBottom: 0, padding: "5px" }} />
                      <button style={{ ...styles.mainButton, padding: "5px 15px", border: "none" }} onClick={() => handleUpdateAvailability(book._id)}>Save</button>
                    </div>
                  ) : (
                    <button style={{ ...styles.mainButton, background: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", padding: "5px 15px" }} onClick={() => { setEditingBookId(book._id); setUpdatedAvailability(book.available); }}>Edit Stock</button>
                  )}
                </div>
              ))}
            </div>
            {filteredBooks.length === 0 && <p style={{ color: "#94a3b8", marginTop: "20px" }}>No books match your search.</p>}
          </>
        ) : (
          <div>
            <button style={{ ...styles.navButton, marginBottom: "20px" }} onClick={() => setView("dashboard")}>← Back</button>
            <div style={{ background: "#1e293b", padding: "25px", borderRadius: "12px", border: "1px solid #334155", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "white", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #334155" }}>
                    <th style={{ padding: "12px" }}>User</th>
                    <th style={{ padding: "12px" }}>Books</th>
                    <th style={{ padding: "12px" }}>Borrowed On</th>
                    <th style={{ padding: "12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecords.map((rec) => (
                    <tr key={rec._id} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "12px" }}>
                        <strong>{rec.user?.name || "Unknown"}</strong><br/>
                        <small style={{ color: "#94a3b8" }}>{rec.user?.email}</small>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {rec.books.map((b, i) => <div key={i} style={{ fontSize: "0.9rem" }}>• {b.name}</div>)}
                      </td>
                      <td style={{ padding: "12px" }}>{new Date(rec.borrowDate).toLocaleDateString()}</td>
                      <td style={{ padding: "12px", color: rec.status === "borrowed" ? "#f59e0b" : "#4ade80" }}>
                        {rec.status.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allRecords.length === 0 && <p style={{textAlign: "center", padding: "20px", color: "#94a3b8"}}>No records found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;