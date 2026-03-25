import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFinePayment = location.state?.isFinePayment || false;
  const fineAmount = location.state?.amount || 0;

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!isFinePayment) {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
    }
  }, [isFinePayment]);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      if (isFinePayment) {
        const res = await fetch("http://localhost:5000/api/users/pay-fine", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          alert("Fine Paid! Your restrictions have been removed.");
          navigate("/user-dashboard");
        }
        return;
      }

      const res = await fetch("http://localhost:5000/api/users/confirm-borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cartItems }),
      });

      if (res.ok) {
        alert("Payment Successful!");
        localStorage.removeItem("cart");
        navigate("/borrow-track"); 
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      // UPDATED BACKGROUND STYLE
      background: "radial-gradient(circle at bottom left, #1e293b, #0f172a)", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <div style={{ 
        ...styles.formCard, 
        background: "#1e293b", 
        color: "white", 
        width: "450px", 
        border: "1px solid #334155",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        <h2 style={{ textAlign: "center", color: "#38bdf8" }}>
          {isFinePayment ? "💳 Pay Pending Fine" : "💳 Checkout"}
        </h2>
        <hr style={{ border: "0", borderTop: "1px solid #334155", margin: "20px 0" }} />

        {isFinePayment ? (
          <div style={{ textAlign: "center" }}>
             <p style={{ fontSize: "1.2rem" }}>Amount Due: <strong>₹{fineAmount}</strong></p>
             <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "15px 0" }}>
               Once paid, your account will be unblocked automatically.
             </p>
             <button style={{ ...styles.mainButton, width: "100%", background: "#4ade80", color: "#0f172a" }} onClick={handlePayment}>
                Pay Fine Now
             </button>
          </div>
        ) : cartItems.length > 0 ? (
          <div>
            <p style={{ color: "#94a3b8" }}>Items in your queue:</p>
            <ul style={{ paddingLeft: "20px", listStyleType: "none" }}>
              {cartItems.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #334155", paddingBottom: "5px" }}>
                  📖 {item.name}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "20px", background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
              <p style={{ margin: 0 }}><strong>Total Deposit:</strong> ₹{cartItems.length * 50}</p>
            </div>
            <button style={{ ...styles.mainButton, width: "100%", marginTop: "20px", background: "#38bdf8", color: "#0f172a" }} onClick={handlePayment}>
              Confirm & Pay
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}><p>Your cart is empty.</p></div>
        )}

        <button 
          style={{ ...styles.navButton, marginTop: "15px", width: "100%", borderColor: "#475569" }} 
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Payment;