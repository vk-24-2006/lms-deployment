import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState({ type: 'all', value: null });

  // 1. Fetch User and Books from Backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch User info if logged in
      if (token) {
        const userRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) setUser(await userRes.json());
      }

      // FETCH FROM YOUR MONGODB BACKEND
      const booksRes = await fetch("http://localhost:5000/api/books");
      const data = await booksRes.json();
      
      // DEBUG: Look at your browser console (F12) to see if data arrives
      console.log("Books received from backend:", data);

      if (Array.isArray(data)) {
        setBooks(data);
        setFilteredBooks(data); // Show all by default
      }
    } catch (err) {
      console.error("Connection Error. Is your backend running on port 5000?", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Combined Logic for Search Bar and Pills
  useEffect(() => {
    let result = [...books];

    // Search by Name
    if (searchTerm.trim() !== "") {
      result = result.filter(book => 
        book.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Category
    if (activeFilter.type === "category") {
      result = result.filter(book => book.category === activeFilter.value);
    } 
    
    // Filter by Author
    else if (activeFilter.type === "author") {
      result = result.filter(book => book.author === activeFilter.value);
    }

    setFilteredBooks(result);
  }, [searchTerm, activeFilter, books]);

  // Generate unique categories/authors for the UI
  const categories = [...new Set(books.map((b) => b.category).filter(Boolean))];
  const authors = [...new Set(books.map((b) => b.author).filter(Boolean))];

  return (
    <div style={{ minHeight: "100vh", width: "100vw", backgroundColor: "#0f172a", color: "white", fontFamily: "sans-serif" }}>
      
      <header style={{ display: "flex", justifyContent: "space-between", padding: "15px 6%", background: "#1e293b", borderBottom: "1px solid #334155" }}>
        <div style={{ fontSize: "22px", fontWeight: "bold", color: "#38bdf8" }}>LMS PRO</div>
        <nav style={{ display: "flex", gap: "20px" }}>
          <button style={navBtnStyle} onClick={() => navigate("/about")}>About</button>
          {!user ? (
            <>
              <button style={navBtnStyle} onClick={() => navigate("/login")}>Login</button>
              <button style={{ ...navBtnStyle, background: "#38bdf8", color: "#0f172a", border: "none" }} onClick={() => navigate("/register")}>Register</button>
            </>
          ) : (
            <button style={navBtnStyle} onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>Logout</button>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* SEARCH INPUT */}
        <section style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Library Search</h1>
          <input 
            type="text"
            placeholder="Search books by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: "100%", maxWidth: "600px", padding: "15px 25px", borderRadius: "30px", 
              border: "1px solid #334155", background: "#1e293b", color: "white", fontSize: "1rem"
            }}
          />
        </section>

        {/* CATEGORY & AUTHOR PILLS */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px", background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <div>
            <h4 style={{ color: "#38bdf8", marginBottom: "10px" }}>Categories</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveFilter({ type: 'all', value: null })} style={pillStyle(activeFilter.type === 'all')}>All</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter({ type: 'category', value: cat })} style={pillStyle(activeFilter.value === cat)}>{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#38bdf8", marginBottom: "10px" }}>Authors</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {authors.slice(0, 6).map(auth => (
                <button key={auth} onClick={() => setActiveFilter({ type: 'author', value: auth })} style={pillStyle(activeFilter.value === auth)}>{auth}</button>
              ))}
            </div>
          </div>
        </section>

        {/* DYNAMIC GRID */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Connecting to Library...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
            {filteredBooks.map((book) => (
              <div key={book._id} style={{ background: "#1e293b", padding: "25px", borderRadius: "12px", border: "1px solid #334155" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{book.name}</h3>
                <p style={{ color: "#94a3b8", margin: "5px 0" }}>Author: {book.author}</p>
                <p style={{ color: "#38bdf8", fontSize: "0.8rem", fontWeight: "bold" }}>{book.category}</p>
                <button 
                  style={{ width: "100%", marginTop: "20px", padding: "10px", borderRadius: "6px", background: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", cursor: "pointer" }}
                  onClick={() => navigate(user ? "/search" : "/login")}
                >
                  {user ? "View Details" : "Login to Borrow"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
            No books found matching your criteria.
          </div>
        )}
      </main>
    </div>
  );
}

const navBtnStyle = { background: "none", border: "1px solid #475569", color: "white", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" };
const pillStyle = (isActive) => ({
  padding: "5px 15px", borderRadius: "20px", border: "1px solid", 
  borderColor: isActive ? "#38bdf8" : "#475569",
  background: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
  color: isActive ? "#38bdf8" : "#cbd5e1",
  cursor: "pointer"
});

export default Home;