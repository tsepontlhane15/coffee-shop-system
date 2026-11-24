const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// MENU
export const getMenu = () => request("/menu");
export const getMenuItem = (id) => request(`/menu/${id}`);
export const createMenuItem = (item) =>
  request("/menu", { method: "POST", body: JSON.stringify(item) });
export const updateMenuItem = (id, item) =>
  request(`/menu/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteMenuItem = (id) =>
  request(`/menu/${id}`, { method: "DELETE" });

// ORDERS
export const getOrders = (status) =>
  request(status ? `/orders?status=${status}` : "/orders");
export const getOrder = (id) => request(`/orders/${id}`);
export const placeOrder = (order) =>
  request("/orders", { method: "POST", body: JSON.stringify(order) });
export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
export const getDailyStats = () => request("/orders/stats/daily");

// AUTH
export const login = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
