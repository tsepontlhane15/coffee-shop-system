import { useState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setMessage("Please enter your name");
      return;
    }
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const orderData = {
        customerName: customerName.trim(),
        notes: notes.trim(),
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await placeOrder(orderData);
      setOrderId(res.data.id);
      clearCart();
      setMessage("Order placed successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Success state after placing order
  if (orderId) {
    return (
      <div
        style={{
          maxWidth: "520px",
          margin: "3rem auto",
          textAlign: "center",
          background: "white",
          padding: "3rem 2rem",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
        <h1 style={{ color: "#3c2f2f", marginBottom: "0.8rem" }}>
          Order Confirmed!
        </h1>
        <p style={{ color: "#555", marginBottom: "0.5rem" }}>
          Thank you, <strong>{customerName}</strong>!
        </p>
        <p style={{ color: "#777", marginBottom: "1.8rem" }}>
          Your order number is:
        </p>
        <div
          style={{
            background: "#f8f4f0",
            padding: "1rem",
            borderRadius: "12px",
            fontSize: "1.3rem",
            fontWeight: "700",
            color: "#3c2f2f",
            marginBottom: "2rem",
          }}
        >
          {orderId}
        </div>
        <Link
          to="/menu"
          style={{
            background: "#3c2f2f",
            color: "white",
            padding: "0.85rem 2rem",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
        <h1 style={{ color: "#3c2f2f", marginBottom: "0.8rem" }}>Your Cart is Empty</h1>
        <p style={{ color: "#777", marginBottom: "2rem" }}>
          Looks like you haven’t added anything yet.
        </p>
        <Link
          to="/menu"
          style={{
            background: "#3c2f2f",
            color: "white",
            padding: "0.9rem 2.2rem",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.4rem", color: "#3c2f2f" }}>Your Cart</h1>
      <p style={{ color: "#777", marginBottom: "2rem" }}>
        Review your items and place your order
      </p>

      {/* Cart Items */}
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2.5rem" }}>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "1.3rem 1.5rem",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "0.3rem" }}>{item.name}</h3>
              <p style={{ color: "#888" }}>R{item.price.toFixed(2)} each</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  background: "#f8f4f0",
                  padding: "0.4rem 0.7rem",
                  borderRadius: "50px",
                }}
              >
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={qtyBtnStyle}
                >
                  −
                </button>
                <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={qtyBtnStyle}
                >
                  +
                </button>
              </div>

              <strong style={{ minWidth: "70px", textAlign: "right" }}>
                R{(item.price * item.quantity).toFixed(2)}
              </strong>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c0392b",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total + Order Form */}
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "18px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.8rem",
            paddingBottom: "1.2rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <h2 style={{ color: "#3c2f2f" }}>Total</h2>
          <h2 style={{ color: "#3c2f2f" }}>R{total.toFixed(2)}</h2>
        </div>

        <h3 style={{ marginBottom: "1.2rem" }}>Customer Details</h3>

        <input
          type="text"
          placeholder="Your Name *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Special instructions or notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          style={{ ...inputStyle, resize: "vertical", marginTop: "1rem" }}
        />

        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.includes("successfully") ? "#2e7d32" : "#c0392b",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "1.5rem",
            background: "#3c2f2f",
            color: "white",
            border: "none",
            padding: "1rem",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "0.9rem 1.1rem",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  outline: "none",
};

const qtyBtnStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "none",
  background: "#3c2f2f",
  color: "white",
  fontSize: "1.1rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default CartPage;