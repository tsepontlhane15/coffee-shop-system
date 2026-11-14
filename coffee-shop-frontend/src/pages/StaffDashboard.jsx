import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getOrders,
  updateOrderStatus,
  getDailyStats,
} from "../services/api";

function StaffDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

const [newItem, setNewItem] = useState({
  name: "",
  description: "",
  price: "",
  category: "coffee",
  available: true,
  image: null,          // <-- add this
});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/staff");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, menuRes, statsRes] = await Promise.all([
        getOrders(),
        getMenu(),
        getDailyStats(),
      ]);
      setOrders(ordersRes.data || []);
      setMenu(menuRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      setMessage(err.message);
      if (err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("denied")) {
        localStorage.removeItem("token");
        navigate("/staff");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/staff");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setMessage("Order status updated successfully");
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

const handleAddMenuItem = async (e) => {
  e.preventDefault();
  try {
    await createMenuItem({
      ...newItem,
      price: Number(newItem.price),
    });
    setMessage("Menu item added successfully");
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "coffee",
      available: true,
      image: null,
    });
    loadData();
  } catch (err) {
    setMessage(err.message);
  }
};

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMenuItem(id);
      setMessage("Item deleted successfully");
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ color: "#3c2f2f", marginBottom: "0.3rem" }}>Staff Dashboard</h1>
          <p style={{ color: "#777" }}>Manage orders, menu and view daily stats</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#c0392b",
            color: "white",
            border: "none",
            padding: "0.7rem 1.4rem",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            background: message.toLowerCase().includes("success") ? "#e8f5e9" : "#fdecea",
            color: message.toLowerCase().includes("success") ? "#2e7d32" : "#c0392b",
            padding: "0.9rem 1.2rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
          }}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.8rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {["orders", "menu", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.7rem 1.5rem",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              background: activeTab === tab ? "#3c2f2f" : "#e8e0d8",
              color: activeTab === tab ? "white" : "#3c2f2f",
              fontWeight: "500",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========== ORDERS TAB ========== */}
      {activeTab === "orders" && (
        <div>
          <h2 style={{ marginBottom: "1.2rem", color: "#3c2f2f" }}>Customer Orders</h2>

          {orders.length === 0 ? (
            <p style={{ color: "#777" }}>No orders yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "1.2rem" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "white",
                    padding: "1.4rem",
                    borderRadius: "14px",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <strong style={{ fontSize: "1.15rem" }}>{order.customerName}</strong>
                    <span style={{ fontWeight: "600", color: "#3c2f2f" }}>
                      R{order.total.toFixed(2)}
                    </span>
                  </div>

                  <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
                    {order.id} • {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <ul style={{ margin: "0.6rem 0 1rem", paddingLeft: "1.3rem", color: "#555" }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}× {item.name} — R{item.subtotal.toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <p style={{ fontStyle: "italic", color: "#666", marginBottom: "1rem" }}>
                      Note: {order.notes}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <label style={{ fontWeight: "500" }}>Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: "0.5rem 0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Collected">Collected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== MENU TAB ========== */}
      {activeTab === "menu" && (
        <div>
          <h2 style={{ marginBottom: "1.2rem", color: "#3c2f2f" }}>Manage Menu</h2>

          {/* Add Item Form */}
          {/* Add Item Form */}
<form
  onSubmit={handleAddMenuItem}
  style={{
    background: "white",
    padding: "1.8rem",
    borderRadius: "16px",
    marginBottom: "2.5rem",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  }}
>
  <h3 style={{ marginBottom: "1.2rem" }}>Add New Menu Item</h3>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
    <input
      placeholder="Item name"
      value={newItem.name}
      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      required
      style={inputStyle}
    />
    <input
      type="number"
      step="0.01"
      placeholder="Price (M)"
      value={newItem.price}
      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      required
      style={inputStyle}
    />
    <input
      placeholder="Description"
      value={newItem.description}
      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
      required
      style={{ ...inputStyle, gridColumn: "1 / -1" }}
    />
    <select
      value={newItem.category}
      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
      style={inputStyle}
    >
      <option value="coffee">Coffee</option>
      <option value="tea">Tea</option>
      <option value="pastry">Pastry</option>
      <option value="other">Other</option>
    </select>

    {/* IMAGE UPLOAD */}
    <div>
      <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "500" }}>
        Item Picture
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setNewItem({ ...newItem, image: reader.result }); // base64
            };
            reader.readAsDataURL(file);
          }
        }}
        style={{ width: "100%" }}
      />
    </div>

    <button
      type="submit"
      style={{
        background: "#3c2f2f",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        gridColumn: "1 / -1",
        padding: "0.9rem",
      }}
    >
      Add Item
    </button>
  </div>

  {/* Preview of selected image */}
  {newItem.image && (
    <div style={{ marginTop: "1.2rem" }}>
      <p style={{ marginBottom: "0.5rem", fontWeight: "500" }}>Preview:</p>
      <img
        src={newItem.image}
        alt="Preview"
        style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
      />
    </div>
  )}
</form>

          {/* Menu List */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {menu.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  padding: "1.2rem 1.4rem",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                }}
              >
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>{item.name}</strong>
                  <span style={{ margin: "0 0.8rem", color: "#888" }}>•</span>
                  <span>R{item.price.toFixed(2)}</span>
                  <span
                    style={{
                      marginLeft: "1rem",
                      padding: "0.25rem 0.7rem",
                      borderRadius: "50px",
                      fontSize: "0.85rem",
                      background: item.available ? "#e8f5e9" : "#fdecea",
                      color: item.available ? "#2e7d32" : "#c0392b",
                    }}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => toggleAvailability(item)}
                    style={smallBtnStyle}
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    style={{ ...smallBtnStyle, background: "#c0392b", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== STATS TAB ========== */}
      {activeTab === "stats" && stats && (
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#3c2f2f" }}>
            Daily Summary — {stats.date}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.2rem",
              marginBottom: "2rem",
            }}
          >
            <div style={statCardStyle}>
              <p style={{ color: "#888", marginBottom: "0.3rem" }}>Total Orders</p>
              <h3 style={{ fontSize: "1.8rem", color: "#3c2f2f" }}>{stats.totalOrders}</h3>
            </div>
            <div style={statCardStyle}>
              <p style={{ color: "#888", marginBottom: "0.3rem" }}>Revenue</p>
              <h3 style={{ fontSize: "1.8rem", color: "#3c2f2f" }}>
                R{stats.totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>

          <h3 style={{ marginBottom: "1rem" }}>Status Breakdown</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} style={statCardStyle}>
                <p style={{ color: "#888", marginBottom: "0.3rem" }}>{status}</p>
                <h3 style={{ fontSize: "1.5rem" }}>{count}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable styles
const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  outline: "none",
};

const smallBtnStyle = {
  padding: "0.45rem 0.9rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "500",
};

const statCardStyle = {
  background: "#f8f4f0",
  padding: "1.2rem",
  borderRadius: "12px",
  textAlign: "center",
};

export default StaffDashboard;