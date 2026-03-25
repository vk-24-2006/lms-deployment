const styles = {
  /* ================= PAGE WRAPPER ================= */
  pageWrapper: {
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative",
    background: "transparent",
  },

  /* ================= NAVBAR ================= */
  navbar: {
    width: "100%",
    padding: "10px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    height: "65px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  navButton: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    background: "white",
    color: "#0a0b0dff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  navButtonHover: {
    background: "#3b3fc1",
    color: "white",
  },

  logo: {
    fontWeight: "bold",
    fontSize: "24px",
    color: "white",
  },

nav: {
  display: "flex",
  gap: "15px",
  marginLeft: "auto",   // pushes nav to the right
  alignItems: "center",
},

header: {
  display: "flex",
  alignItems: "center",
},

  /* ================= HERO/BANNER ================= */
  heroBackground: {
    background: "transparent",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  heroSection: {
    background: "transparent",
    textAlign: "center",
    padding: "100px 20px 60px 20px",
  },

  heroContent: {
    textAlign: "center",
    paddingTop: "60px",
    paddingBottom: "40px",
  },

  heroTitle: {
    fontSize: "38px",
    fontWeight: "700",
    color: "white",
    marginBottom: "12px",
  },

  heroSubtitle: {
    fontSize: "18px",
    color: "white",
    maxWidth: "700px",
    margin: "0 auto 25px auto",
  },

  heroContainer: {
    padding: "65px 85px",
    borderRadius: "18px",
    textAlign: "center",
    background: "rgba(0,0,0,0.48)",
    maxWidth: "900px",
    margin: "0 auto",
  },

  /* ================= FEATURES ================= */
  featuresSection: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    margin: "40px 20px",
    flexWrap: "wrap",
  },

  featureCard: {
    width: "260px",
    padding: "35px",
    background: "transparent",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  featureCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
  },

  /* ================= BUTTON ================= */
  mainButton: {
    padding: "12px 28px",
    borderRadius: "25px",
    background: "#eaebf0ff",
    color: "black",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 5px 14px rgba(78,84,200,0.45)",
    transition: "all 0.3s ease",
  },

  mainButtonHover: {
    background: "#3b3fc1",
    boxShadow: "0 6px 18px rgba(78,84,200,0.55)",
  },

  /* ================= FORM BACKGROUND ================= */
  formBackground: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    color: "black",
  },

  /* ================= FORM CARD (LOGIN / REGISTER) ================= */
  formCard: {
    width: "360px",
    padding: "32px",
    background: "rgba(0,0,0,0.28)",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    color: "white",
    transition: "all 0.3s ease",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #f4efefff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
  },

  inputFocus: {
    borderColor: "#4e54c8",
    boxShadow: "0 0 6px rgba(78,84,200,0.3)",
  },

  /* ================= ROLE SELECTION ================= */
  roleCard: {
    width: "380px",
    padding: "30px",
    background: "rgba(0,0,0,0.48)",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
    textAlign: "center",
  },

  roleButton: {
    width: "100%",
    padding: "14px",
    margin: "12px 0",
    borderRadius: "25px",
    background: "#4e54c8",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 5px 14px rgba(78,84,200,0.45)",
    transition: "all 0.3s ease",
  },

  roleButtonHover: {
    background: "#3b3fc1",
  },

  back: {
    marginTop: "14px",
    color: "#4e54c8",
    cursor: "pointer",
    fontWeight: "bold",
  },

  /* ================= ABOUT PAGE ================= */
  aboutBackground: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dde5ff, #eef2ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 20px",
    boxSizing: "border-box",
  },

  aboutContainer: {
    maxWidth: "900px",
    width: "100%",
    padding: "65px 85px",
    background: "rgba(0,0,0,0.48)",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
    lineHeight: "1.8",
    fontFamily: "'Segoe UI', sans-serif",
  },

  aboutTitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "white",
    fontSize: "32px",
    fontWeight: "700",
  },

  aboutSubTitle: {
    marginTop: "25px",
    marginBottom: "15px",
    color: "white",
    fontSize: "22px",
    fontWeight: "600",
  },

  aboutText: {
    fontSize: "18px",
    color: "white",
    marginBottom: "25px",
    textAlign: "center",
  },

  aboutList: {
    listStyleType: "disc",
    paddingLeft: "20px",
    marginBottom: "25px",
    color: "#34495E",
    lineHeight: "1.7",
  },

  facilitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  facilityCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    background: "rgba(0, 0, 0, 0.48)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    color: "white",
  },

  icon: {
    color: "#4e54c8",
    fontSize: "22px",
  },

  /* ================= FOOTER ================= */
  footer: {
    background: "#2b2d42",
    color: "white",
    padding: "25px 20px",
    marginTop: "auto",
  },

  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  footerImages: {
    display: "flex",
    gap: "15px",
  },

  /* ================= DASHBOARD ================= */
  loggedInContainer: {
    minHeight: "100vh",
    background: "#eef2ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "360px",
    padding: "32px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    textAlign: "center",
  },
};

export default styles;