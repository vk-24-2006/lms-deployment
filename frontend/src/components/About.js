import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function About() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        ...styles.pageWrapper,
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        // Consistent radial gradient background
        background: "radial-gradient(circle at top right, #1e293b, #0f172a)",
        color: "white",
        fontFamily: "sans-serif"
      }}
    >
      {/* HEADER */}
      <header style={{ ...styles.header, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(10px)" }}>
        <div style={styles.logo}>📚 MyLibrary</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => navigate("/login-select")}>
            Login
          </button>
          <button style={styles.navButton} onClick={() => navigate("/register-select")}>
            Register
          </button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{ ...styles.heroSection, padding: "80px 20px" }}>
        <div style={styles.heroContainer}>
          <h1 style={{ ...styles.heroTitle, color: "#38bdf8", fontSize: "2.5rem", marginBottom: "20px" }}>
            About Our Library
          </h1>
          <p style={{ ...styles.heroSubtitle, maxWidth: "700px", margin: "0 auto", color: "#94a3b8" }}>
            Discover our modern digital library management system that makes
            learning easier, faster, and more organized.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <center>
        <section style={{ ...styles.aboutSection, paddingBottom: "60px" }}>
          <div 
            style={{ 
              ...styles.aboutContainer, 
              background: "#1e293b", 
              borderRadius: "15px", 
              border: "1px solid #334155", 
              padding: "40px",
              maxWidth: "900px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
            }}
          >
            <p style={{ ...styles.aboutText, lineHeight: "1.8", fontSize: "1.1rem" }}>
              Our Library Management System is a professional digital solution
              that streamlines library operations and enhances user experience.
              It centralizes management of books, users, and staff with
              efficiency, accuracy, and security.
            </p>

            <h2 style={{ ...styles.aboutSubTitle, color: "#38bdf8", margin: "40px 0 20px" }}>
              Library Facilities
            </h2>

            <div style={styles.facilitiesGrid}>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                📚 Comprehensive collection
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                💻 Digital library & e-books
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                🔍 Advanced search
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                🪑 Reading halls
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                👥 Discussion rooms
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                ⚙️ Automated tracking
              </div>
              <div style={{ ...styles.facilityCard, background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "8px" }}>
                🤝 Staff support
              </div>
            </div>

            <h2 style={{ ...styles.aboutSubTitle, color: "#38bdf8", marginTop: "40px" }}>Objective</h2>
            <p style={{ ...styles.aboutText, color: "#94a3b8", marginBottom: "30px" }}>
              Our goal is to modernize traditional library processes, reduce
              manual workload, and maintain accurate records through technology.
            </p>

            <div style={{ textAlign: "center" }}>
              <button 
                style={{ ...styles.mainButton, background: "#38bdf8", color: "#0f172a", fontWeight: "bold", padding: "12px 30px" }} 
                onClick={() => navigate("/")}
              >
                ⬅ Back to Home
              </button>
            </div>
          </div>
        </section>
      </center>

      {/* FOOTER */}
      <footer style={{ ...styles.footer, background: "#0f172a", borderTop: "1px solid #334155", padding: "30px 0" }}>
        <div style={styles.footerContent}>
          <p style={{ margin: 0, color: "#64748b" }}>© 2026 MyLibrary. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;