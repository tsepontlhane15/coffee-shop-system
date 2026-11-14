function Footer() {
  return (
    <footer
      style={{
        background: "#2c211c",
        color: "#f5f0eb",
        padding: "3rem 1.5rem 1.5rem",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#d4a574" }}>LIBATA COFFE SHOP</h3>
          <p style={{ lineHeight: "1.6", opacity: 0.9 }}>
            Specialty coffee, fresh pastries and warm hospitality.  
            Come experience the difference.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: "0.8rem" }}>Quick Links</h4>
          <p><a href="/" style={{ color: "#f5f0eb", textDecoration: "none" }}>Home</a></p>
          <p><a href="/menu" style={{ color: "#f5f0eb", textDecoration: "none" }}>Menu</a></p>
          <p><a href="/cart" style={{ color: "#f5f0eb", textDecoration: "none" }}>Cart</a></p>
          <p><a href="/contact" style={{ color: "#f5f0eb", textDecoration: "none" }}>Contact</a></p>
        </div>

        <div>
          <h4 style={{ marginBottom: "0.8rem" }}>Contact</h4>
          <p>📍 Maseru, Lesotho</p>
          <p>📞 +266 5708 4681</p>
          <p>✉️ info@libatcoffe.com</p>
        </div>

        <div>
          <h4 style={{ marginBottom: "0.8rem" }}>Opening Hours</h4>
          <p>Mon – Fri: 07:00 – 18:00</p>
          <p>Saturday: 08:00 – 16:00</p>
          <p>Sunday: Closed</p>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "2.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontSize: "0.9rem",
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} LIBATA COFFE SHOP. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;