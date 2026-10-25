# 🪺 LostNest — Workplace Lost & Found Management System

<div align="center">

![LostNest Logo](client/public/logo.png)

### **Find What Belongs.**
A modern, centralized corporate Lost & Found management platform built for modern enterprise campuses.

[![Live App](https://img.shields.io/badge/Live%20App-lostnest.vercel.app-064e3b?style=for-the-badge&logo=vercel&logoColor=white)](https://lostnest.vercel.app/)
[![API Gateway](https://img.shields.io/badge/API%20Status-Online-10b981?style=for-the-badge&logo=render&logoColor=white)](https://lostnest.onrender.com/api)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://www.mongodb.com/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[**Explore Live Demo »**](https://lostnest.vercel.app/) · [Report Bug](https://github.com/SuryaSrekanth/lostnest/issues) · [Request Feature](https://github.com/SuryaSrekanth/lostnest/issues)

</div>

---

## 📌 Overview

Misplaced laptops, charging bricks, access cards, and audio gear are everyday realities in large corporate facilities. **LostNest** replaces chaotic Slack messages and physical lost-and-found bins with a structured, secure, and searchable workplace directory.

Employees can quickly report lost or found belongings, pinpoint exact workplace coordinates (Building, Floor, and Meeting Room/Zone), and verify ownership through an anti-theft proof workflow before any handover takes place.

---

## ✨ Key Features

- 📍 **Corporate Coordinate Mapping** — Record items with exact workplace locations (`Building`, `Floor`, and `Room/Zone` e.g., *HQ Building 1 • 3rd Floor • Meeting Room 4B*).
- 🛡️ **Anti-Theft Claim Verification** — Claiming high-value gear (laptops, phones, AirPods) requires submitting proof notes (stickers, serial numbers, pouch colors) that only the true owner knows.
- ⏱️ **MongoDB TTL Auto-Purge** — When an item is marked as **Returned & Resolved**, an automated background MongoDB Time-To-Live (TTL) index cleans up the record after 24 hours to preserve database storage and protect employee privacy.
- 🔍 **Instant Dual-Feed & Filtering** — Toggle between **Lost** and **Found** items, or filter across facilities, item categories, and live keyword searches.
- 🔐 **Corporate JWT Authentication** — Secure employee accounts with department and campus location metadata stored in MongoDB Atlas.
- 🎨 **Forest Green Brand Identity** — Custom bird-nest emblem, dark emerald header, high-contrast bright red alert pins, and hardware-accelerated ambient textures with zero scroll lag.
- 📱 **Fully Responsive** — Optimized for desktops, tablets, and mobile devices across office Wi-Fi networks.

---

## 🛠️ Tech Stack & Architecture

```
[ React 19 + Tailwind v4 ]  ──( REST API )──>  [ Express 5 + Node.js ]  ──( Mongoose )──>  [ MongoDB Atlas ]
   Hosted on Vercel CDN                            Hosted on Render                           Cloud Database
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4 | High-performance SPA with modern CSS utility framework |
| **Icons & UI** | Lucide React | Clean, lightweight icon suite |
| **Routing** | React Router DOM v7 | Client-side routing with Vercel SPA rewrites |
| **HTTP Client** | Axios | Interceptor-based API client attaching JWT Bearer tokens |
| **Backend** | Node.js, Express.js 5 | RESTful API service |
| **Database** | MongoDB Atlas, Mongoose 9 | Cloud document database with TTL expiration indexing |
| **Auth & Security** | JSON Web Tokens (JWT), Bcrypt.js | Password hashing and stateless session authorization |
| **Deployment** | Vercel (Frontend) + Render (Backend) | Automated CI/CD pipelines linked to GitHub |

---

## 🌐 API Reference

Base URL: `https://lostnest.onrender.com/api` (or `http://localhost:5000/api` locally)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Server health check |
| `GET` | `/api` | Public | API Gateway status and endpoint directory |
| `POST` | `/api/auth/register` | Public | Register a new corporate employee |
| `POST` | `/api/auth/login` | Public | Authenticate employee and issue JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in employee profile |
| `GET` | `/api/items` | Public | Retrieve items with query filters (`?type=&category=&building=&search=`) |
| `GET` | `/api/items/:id` | Public | Get single item details with claimant information |
| `GET` | `/api/items/user/my-items`| Protected | Get all items reported by current authenticated user |
| `POST` | `/api/items` | Protected | Submit a new Lost or Found item report |
| `POST` | `/api/items/:id/claim` | Protected | Submit ownership proof to claim a found item |
| `PUT` | `/api/items/:id/resolve` | Protected | Mark item as returned (starts 24h auto-purge countdown) |
| `DELETE`| `/api/items/:id` | Protected | Permanently delete a listing (reporter only) |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

### 2. Clone the Repository
```bash
git clone https://github.com/SuryaSrekanth/lostnest.git
cd lostnest
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
```

Start the backend:
```bash
npm run dev   # Starts with nodemon on http://localhost:5000
# or
npm start     # Standard node server.js
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## ⚙️ Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Express server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/lostnest` |
| `JWT_SECRET` | Secret key for signing authorization tokens | `any_long_secure_secret_key` |

### Client (`client/.env` or Vercel Environment Variables)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Live backend API URL | `https://lostnest.onrender.com/api` |

---

## 📁 Project Directory Structure

```
lostnest/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets (logo.png, favicon.png)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, ItemCard, FilterBar, ClaimModal)
│   │   ├── context/            # AuthContext (global user state & token storage)
│   │   ├── pages/              # Home, Login, Register, ReportItem, MyListings
│   │   ├── services/           # Axios API service instance
│   │   ├── App.jsx             # Route definitions & layout wrappers
│   │   ├── index.css           # Tailwind v4 theme configuration
│   │   └── main.jsx            # React root mount
│   ├── vercel.json             # Vercel Single-Page-App routing rewrite rules
│   └── package.json
│
├── server/                     # Backend Express REST API
│   ├── middleware/             # JWT auth verification middleware
│   ├── models/                 # Mongoose schemas (User.js, Item.js with TTL index)
│   ├── routes/                 # Express route handlers (auth.js, items.js)
│   ├── server.js               # Server entry point & MongoDB Atlas connection
│   └── package.json
│
├── .gitignore                  # Prevents secrets, .env files, and node_modules from pushing
└── README.md
```

---

## 🔒 Security Best Practices Implemented

- **Password Hashing:** Passwords are encrypted using `bcryptjs` with salt rounds before storing in the database.
- **Credential Protection:** All `.env` and sensitive files are excluded from Git version control.
- **Access Control:** Deleting and resolving listings can only be executed by the employee who originally reported the item.
- **Input Sanitization:** Regex-escaped case-insensitive query searching prevents search injection.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <sub>Developed by <b>Surya Srekanth</b> · Built with modern MERN Stack & Tailwind CSS</sub>
</div>
