import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../services/api";
import { useCart } from "../context/CartContext";

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await getMenu();
        setMenu(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  if (loading) return <p style={{ textAlign: "center", padding: "3rem" }}>Loading menu...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  const categories = [...new Set(menu.map((item) => item.category))];

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem", color: "#3c2f2f", fontSize: "2.2rem" }}>
        Our Menu
      </h1>
      <p style={{ marginBottom: "2.5rem", color: "#666" }}>
        Freshly made every day with quality ingredients
      </p>

      {categories.map((category) => (
        <div key={category} style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              textTransform: "capitalize",
              marginBottom: "1.3rem",
              color: "#3c2f2f",
              borderBottom: "2px solid #d4a574",
              paddingBottom: "0.4rem",
              display: "inline-block",
            }}
          >
            {category}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.4rem",
            }}
          >
            {menu
              .filter((item) => item.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Show image only if it exists */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div style={{ padding: "1.4rem" }}>
                    <h3 style={{ marginBottom: "0.4rem", fontSize: "1.2rem" }}>
                      {item.name}
                    </h3>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "0.95rem",
                        marginBottom: "1.1rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ color: "#3c2f2f", fontSize: "1.2rem" }}>
                        M{item.price.toFixed(2)}
                      </strong>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        style={{
                          background: item.available ? "#3c2f2f" : "#ccc",
                          color: "white",
                          border: "none",
                          padding: "0.55rem 1.2rem",
                          borderRadius: "50px",
                          cursor: item.available ? "pointer" : "not-allowed",
                          fontWeight: "500",
                        }}
                      >
                        {item.available ? "Add to Cart" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuPage;