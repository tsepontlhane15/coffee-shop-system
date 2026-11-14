function ContactPage() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "#3c2f2f" }}>Contact Us</h1>

      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ marginBottom: "1.5rem", lineHeight: "1.7" }}>
          We would love to hear from you! Visit us or send a message.
        </p>

        <div style={{ marginBottom: "1.2rem" }}>
          <strong>📍 Address</strong>
          <p>Main Street, Maseru, Lesotho</p>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <strong>📞 Phone</strong>
          <p>+266 5708 4681</p>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <strong>✉️ Email</strong>
          <p>info@libatcoffe.com</p>
        </div>

        <div>
          <strong>🕐 Opening Hours</strong>
          <p>Monday – Friday: 07:00 – 18:00</p>
          <p>Saturday: 08:00 – 16:00</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;