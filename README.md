# LIBATA COFFE SHOP - Coffee Shop Management System

A full-stack web application developed for managing a local coffee shop.  
Customers can browse the menu, add items to a cart, and place orders.  
Staff can manage menu items, process orders, and view daily summaries.

---

## Technologies Used

### Frontend
- React (Vite)
- React Router DOM
- Fetch API
- Context API (Cart state)
- Hosted on Vercel / Netlify

### Backend
- Node.js + Express.js
- Redis (Key-Value NoSQL Database)
- JWT Authentication
- Hosted on Render

### Tools
- Git & GitHub
- dotenv

---

## Features

### Customer Features
- View menu items (Coffee, Tea, Pastries, Other)
- See name, description, price and availability
- Add items to cart and update quantities
- Place an order with name and optional notes
- Receive order confirmation with unique order number

### Staff Features
- Secure staff login
- Add, update and delete menu items
- Upload pictures for menu items
- View all customer orders
- Update order status (Pending → Preparing → Ready → Collected)
- View daily order statistics and revenue

---

## API Endpoints

| Method | Endpoint                  | Access  | Description                  |
|--------|---------------------------|---------|------------------------------|
| GET    | `/api/health`             | Public  | Health check                 |
| POST   | `/api/auth/login`         | Public  | Staff login                  |
| GET    | `/api/menu`               | Public  | Get all menu items           |
| GET    | `/api/menu/:id`           | Public  | Get one menu item            |
| POST   | `/api/menu`               | Staff   | Add menu item                |
| PUT    | `/api/menu/:id`           | Staff   | Update menu item             |
| DELETE | `/api/menu/:id`           | Staff   | Delete menu item             |
| GET    | `/api/orders`             | Staff   | Get all orders               |
| GET    | `/api/orders/stats/daily` | Staff   | Daily summary                |
| GET    | `/api/orders/:id`         | Public  | Get specific order           |
| POST   | `/api/orders`             | Public  | Place an order               |
| PATCH  | `/api/orders/:id/status`  | Staff   | Update order status          |

---

## Installation & Setup

### Backend
```bash
cd coffee-shop-backend
npm install
```

Create `.env` file:
```env
PORT=5000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
STAFF_USERNAME=staff
STAFF_PASSWORD=staff123
```

Run the server:
```bash
npm run dev
```

### Frontend
```bash
cd coffee-shop-frontend
npm install
npm run dev
```

---

## Default Staff Login
- **Username:** staff  
- **Password:** staff123

---

## Deployment

- **Backend:** Render  
- **Frontend:** Vercel or Netlify  
- **Database:** Redis (Upstash / Redis Cloud)

---

## Group Members & Contributions

| #  | Member Name              | Contribution                                      |
|----|--------------------------|---------------------------------------------------|
| 1  | Tsepo Ntlhane            | Project coordination, Backend API, Authentication |
| 2  | Paballo Nkone            | Frontend UI design, Home page, Menu page          |
| 3  | Malefu Motlalehi         | Shopping Cart functionality, Order placement      |
| 4  | Monyane Ntlama           | Staff Dashboard, Order management                 |
| 5  | Mahlape Ntoko            | Menu management (Add/Edit/Delete items)           |
| 6  | Andrias Nchabeng         | Database integration (Redis), Seed data           |
| 7  | Moseli Motopi            | Testing, Documentation, README, Deployment        |

## How to Run the Project

1. Start Redis
2. Start the backend (`npm run dev` inside `coffee-shop-backend`)
3. Start the frontend (`npm run dev` inside `coffee-shop-frontend`)
4. Open `http://localhost:5173` in the browser

---

## Screenshots

Home page(image-2.png)
Menu page(image-1.png) 
Menu page(image-2.png) 
Cart & Order Confirmation(image-3.png)  
Staff Login(image-4.png)  
Staff Dashboard-Orders(image-5.png)
Staff Dashboard-Menu(image-6.png)
Staff Dashboard-Stats(image-7.png)


---

## License

This project was developed as a group assignment for **BIWA2110 – Web Application Development**.
