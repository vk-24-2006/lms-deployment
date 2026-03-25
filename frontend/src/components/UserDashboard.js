import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchUser();
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, [navigate]);

  // Handle Real-time Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const res = await fetch(`http://localhost:5000/api/books/search?q=${searchQuery}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce to prevent excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addToCart = (book) => {
    if (cartItems.some((item) => item._id === book._id)) {
      alert("Book already in cart!");
      return;
    }
    const updatedCart = [...cartItems, book];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cartItems.filter((item) => item._id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!user) return null;

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)", 
      color: "white",
      fontFamily: "sans-serif",
      overflowX: "hidden"
    }}>
      <div style={{ ...styles.pageWrapper, padding: "40px", color: "white" }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: "#38bdf8", margin: 0 }}>📚 Welcome {user.name}</h1>
            <p style={{ color: "#94a3b8", margin: "5px 0 0 0" }}>Email: {user.email}</p>
          </div>

          <div style={{ 
            textAlign: "right", 
            background: "#1e293b", 
            padding: "15px", 
            borderRadius: "12px", 
            border: user.isBlocked ? "2px solid #ef4444" : "1px solid #334155" 
          }}>
            <h3 style={{ margin: 0, color: user.isBlocked ? "#ef4444" : "#4ade80" }}>
                {user.isBlocked ? "🚫 Account Blocked" : "✅ Account Active"}
            </h3>
            <p style={{ margin: "5px 0 10px 0", fontSize: "1.2rem", fontWeight: "bold" }}>
              Pending Fine: ₹{user.fine || 0}
            </p>
            {user.fine > 0 && (
              <button 
                style={{ ...styles.mainButton, background: "#f59e0b", color: "#0f172a", padding: "5px 15px", fontSize: "0.9rem", border: "none", fontWeight: "bold" }}
                onClick={() => navigate("/payment", { state: { isFinePayment: true, amount: user.fine } })}
              >
                💳 Pay Fine Now
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR SECTION */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ position: "relative", maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Search books by name, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 20px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "white",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            {isSearching && (
              <div style={{ position: "absolute", right: "15px", top: "15px", color: "#38bdf8" }}>
                Searching...
              </div>
            )}
          </div>

          {/* SEARCH RESULTS DROP-DOWN/AREA */}
          {searchResults.length > 0 && (
            <div style={{ 
              marginTop: "10px", 
              background: "#1e293b", 
              borderRadius: "10px", 
              border: "1px solid #334155",
              maxHeight: "300px",
              overflowY: "auto",
              maxWidth: "600px"
            }}>
              {searchResults.map((book) => (
                <div key={book._id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "15px", 
                  borderBottom: "1px solid #334155" 
                }}>
                  <div>
                    <strong style={{ color: "#38bdf8" }}>{book.name}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{book.author} | {book.category}</div>
                  </div>
                  <button 
                    onClick={() => addToCart(book)}
                    disabled={book.available <= 0}
                    style={{
                      background: book.available > 0 ? "#38bdf8" : "#475569",
                      color: "#0f172a",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: "5px",
                      cursor: book.available > 0 ? "pointer" : "not-allowed",
                      fontWeight: "bold"
                    }}
                  >
                    {book.available > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DASHBOARD ACTIONS SECTION */}
        <div style={styles.featuresSection}>
          {/* BORROW / CART CARD */}
          <div style={{ ...styles.featureCard, background: "#1e293b", border: "1px solid #334155", cursor: "default" }}>
            <h2 style={{ color: "#38bdf8" }}>📘 Borrow Books (Cart)</h2>
            {cartItems.length > 0 ? (
              <div style={{ textAlign: "left", marginTop: "10px" }}>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cartItems.map((book, index) => (
                    <li key={index} style={{ marginBottom: "10px", fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "5px" }}>
                      <span>• {book.name}</span>
                      <button onClick={() => removeFromCart(book._id)} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "3px", padding: "2px 8px", cursor: "pointer", fontSize: "0.7rem" }}>Remove</button>
                    </li>
                  ))}
                </ul>
                <button 
                  style={{ 
                    ...styles.mainButton, 
                    marginTop: "15px", 
                    width: "100%", 
                    background: user.isBlocked ? "#475569" : "#38bdf8",
                    color: user.isBlocked ? "#94a3b8" : "#0f172a",
                    cursor: user.isBlocked ? "not-allowed" : "pointer",
                    fontWeight: "bold", border: "none"
                  }}
                  onClick={() => !user.isBlocked && navigate("/payment")}
                  disabled={user.isBlocked}
                >
                  {user.isBlocked ? "Pay Fines to Borrow" : "Confirm & Borrow"}
                </button>
              </div>
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Your cart is empty.</p>
            )}
          </div>

          {/* HISTORY CARD */}
          <div style={{ ...styles.featureCard, background: "#1e293b", border: "1px solid #334155" }} onClick={() => navigate("/borrow-track")}>
            <h2 style={{ color: "#38bdf8" }}>📋 Borrow History</h2>
            <p style={{ color: "#94a3b8" }}>View your past records</p>
          </div>
        </div>
        
        <button style={{ ...styles.navButton, marginTop: "40px", borderColor: "#475569" }} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
      </div>
    </div>
  );
}

export default UserDashboard;