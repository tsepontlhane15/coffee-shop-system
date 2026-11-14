import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      {/* HERO SECTION - Full width */}
      <section
        style={{
          height: "90vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/coppermug-coffee-10.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "0 1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
              marginBottom: "1.2rem",
              fontWeight: "700",
              letterSpacing: "1px",
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            LIBATA COFFE SHOP
          </h1>
          <p
            style={{
              fontSize: "1.35rem",
              marginBottom: "2.2rem",
              maxWidth: "620px",
              marginInline: "auto",
              opacity: 0.95,
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
            }}
          >
            Specialty fine coffee • Fresh pastries • Warm atmosphere
          </p>
          <Link
            to="/menu"
            style={{
              background: "#d4a574",
              color: "#2c211c",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.15rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
          >
            View Our Menu
          </Link>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section
        style={{
          maxWidth: "900px",
          margin: "5rem auto",
          padding: "0 1.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.1rem",
            marginBottom: "1.2rem",
            color: "#3c2f2f",
          }}
        >
          Welcome to Libata
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.75",
            color: "#555",
          }}
        >
          We serve carefully crafted coffee, freshly baked pastries and a cozy
          space where you can relax, work or catch up with friends. Every cup is
          made with love.
        </p>
      </section>
    </div>
  );
}

export default HomePage;