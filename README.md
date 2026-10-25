# LostNest — Workplace Lost & Found Management System

<div align="center">

<img src="client/public/logo.png" alt="LostNest Logo" width="115" />

# **LostNest**
### *Find What Belongs.*

A modern, centralized corporate Lost & Found management platform engineered for enterprise campuses, tech parks, and workplace facilities.

[![Live App](https://img.shields.io/badge/Live%20App-lostnest.vercel.app-064e3b?style=for-the-badge&logo=vercel&logoColor=white)](https://lostnest.vercel.app/)
[![API Gateway](https://img.shields.io/badge/API%20Status-Online-10b981?style=for-the-badge&logo=render&logoColor=white)](https://lostnest.onrender.com/api)
[![React 19](https://img.shields.io/badge/React%2019-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express%205-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

[**Explore Live Demo**](https://lostnest.vercel.app/) • [**API Gateway**](https://lostnest.onrender.com/api) • [**Report Bug**](https://github.com/SuryaSrekanth/lostnest/issues) • [**Request Feature**](https://github.com/SuryaSrekanth/lostnest/issues)

<br/>

<img src="client/public/preview.png" alt="LostNest Application Dashboard" width="900" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />

</div>

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [The Problem & The Solution](#-the-problem--the-solution)
- [Key Features](#-key-features)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Tech Stack](#-tech-stack)
- [Database Models & TTL Expiration](#-database-models--ttl-expiration)
- [REST API Reference](#-rest-api-reference)
- [Getting Started Locally](#-getting-started-locally)
- [Environment Variables](#-environment-variables)
- [Security & Production Hardening](#-security--production-hardening)
- [Deployment](#-deployment)
- [Contributing & Author](#-author)

---

## 📌 Overview

In large corporate campuses and multi-floor office buildings, misplaced items—such as company laptops, USB-C chargers, access badges, wireless earbuds, and keys—lead to fragmented communication across Slack channels, email threads, and physical security desks.

**LostNest** provides a centralized, secure workplace directory that streamlines the recovery lifecycle:
1. **Report:** Employees log lost or found items with 3-tier corporate coordinates.
2. **Discover:** Colleagues browse dual real-time feeds with instant multi-criteria filtering.
3. **Verify:** Claimants submit confidential proof notes to prevent unauthorized pickups.
4. **Resolve & Auto-Purge:** Completed handovers trigger an automated 24-hour database TTL cleanup to maintain privacy.

---

## 💡 The Problem & The Solution

| The Traditional Way | The LostNest Way |
| :--- | :--- |
| **Scattered chat alerts:** Messages get lost in busy Slack or Microsoft Teams channels. | **Dedicated Central Directory:** Searchable repository categorized by item type, building, and date. |
| **Vague location descriptions:** "Found a mouse near the 3rd floor lounge." | **3-Tier Workplace Coordinates:** Exact location tracking (`Building` • `Floor` • `Room/Zone`). |
| **Vulnerable handovers:** Anyone can claim high-value hardware without verification. | **Anti-Theft Proof Verification:** Claimants must submit confidential distinguishing marks (stickers, serials). |
| **Data clutter & privacy risks:** Old records linger forever on company servers. | **Automated MongoDB TTL Purge:** Documents self-delete 24 hours after resolution. |

---

## ✨ Key Features

- **📍 Corporate Coordinate Mapping**  
  Every item is recorded with granular office hierarchy (`Building`, `Floor`, and `Room/Zone`, e.g., *HQ Building 1 • 4th Floor • Quiet Pod 4C*).
  
- **🛡️ Anti-Theft Claim Verification**  
  Claiming high-value items requires providing proof notes (e.g., sticker details, case color, engraved initials, serial numbers). Only the reporter and claimant can view these sensitive details.

- **⏳ MongoDB TTL 24-Hour Auto-Purge**  
  When an item is marked as **Returned & Resolved**, a MongoDB Time-To-Live index (`{ resolvedAt: 1 }, { expireAfterSeconds: 86400 }`) automatically deletes the document after 24 hours to preserve database storage and protect employee data privacy.

- **⚡ Instant Dual-Feed & Smart Filtering**  
  Toggle between **Lost** and **Found** items, or filter concurrently across facilities, item categories, active/returned statuses, and live keyword queries.

- **🔐 Stateless Corporate JWT Authentication**  
  Enterprise employee accounts with encrypted credentials (`bcryptjs`) and department/location profiling (`Engineering`, `HR`, `Operations`, `Finance`, etc.).

- **🎨 Forest Green Corporate Brand Identity**  
  Crafted with an emerald-dark corporate theme, high-contrast alert tags, smooth card hover interactions, and responsive layouts built with Tailwind CSS v4 and Lucide React icons.

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Frontend (React 19 + Tailwind v4 on Vercel)"]
        UI["Corporate User Interface"]
        Feed["Dual Feed (Lost / Found)"]
        Filter["Filter Bar & Live Search"]
        Modal["Report & Claim Modals"]
    end

    subgraph Server["Backend API Gateway (Express 5 on Render)"]
        Router["Express REST Router (/api)"]
        AuthMid["JWT Auth Middleware"]
        ItemCtrl["Item Management Controller"]
        AuthCtrl["Authentication Controller"]
    end

    subgraph Database["Database (MongoDB Atlas)"]
        Users[("User Collection")]
        Items[("Item Collection")]
        TTL[("24-Hour TTL Auto-Purge Index")]
    end

    UI --> Feed & Filter & Modal
    Feed & Filter & Modal -->|Axios HTTP Requests| Router
    Router --> AuthMid
    AuthMid --> ItemCtrl & AuthCtrl
    AuthCtrl -->|Bcrypt Hashing / Tokens| Users
    ItemCtrl -->|Mongoose Queries| Items
    Items -.->|Status: Returned (resolvedAt + 24h)| TTL
```

### **Item Lifecycle Workflow**
```
[Report Item] ──> [Active in Feed] ──> [Colleague Submits Claim / Found Note]
                                                │
                                                ▼
[Document Purged via TTL (24h)] <── [Resolved as Returned] <── [Reporter Reviews & Approves]
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/) (configured with JWT request interceptors)
- **Hosting:** [Vercel](https://vercel.com/) (configured with SPA rewrite rules)

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/) (ES6+)
- **Framework:** [Express.js 5](https://expressjs.com/)
- **Database ODM:** [Mongoose 9](https://mongoosejs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Security:** [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js), CORS, Regex Query Sanitization
- **Hosting:** [Render](https://render.com/) (Cloud Web Service)

---

## 🗄️ Database Models & TTL Expiration

### **Item Schema Highlights**
```javascript
const itemSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  type:         { type: String, enum: ['Lost', 'Found'], required: true },
  category:     { 
    type: String, 
    enum: ['Tech & Hardware', 'Badges & Access', 'Audio & Gadgets', 'Personal & Apparel', 'Documents & Wallets', 'Other'],
    required: true 
  },
  building:     { type: String, required: true },
  floor:        { type: String, required: true },
  roomZone:     { type: String, required: true },
  status:       { type: String, enum: ['Active', 'Claim Pending', 'Returned'], default: 'Active' },
  resolvedAt:   { type: Date, default: null },
  claimDetails: {
    claimedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimNote:    { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    claimDate:    { type: Date, default: null }
  },
  reportedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// ⏱️ Auto-Purge: Removes resolved items from database exactly 24 hours after resolution
itemSchema.index({ resolvedAt: 1 }, { expireAfterSeconds: 86400 });
```

---

## 🔌 REST API Reference

**Base URL (Production):** `https://lostnest.onrender.com/api`  
**Base URL (Local):** `http://localhost:5000/api`

### **1. Authentication Endpoints**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new employee account |
| `POST` | `/auth/login` | Public | Authenticate employee and return JWT |
| `GET` | `/auth/me` | Protected | Retrieve authenticated user profile |

#### **Example: Register Request**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@company.com",
  "password": "SecurePassword123",
  "department": "Engineering",
  "officeLocation": "HQ Building 1",
  "phone": "+1 555-0199"
}
```

### **2. Items Management Endpoints**
| Method | Endpoint | Access | Description | Query Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/items` | Public | List items with filters | `type`, `category`, `building`, `status`, `search` |
| `GET` | `/items/:id` | Public | Get item details by ID | — |
| `GET` | `/items/user/my-items` | Protected | Fetch current user's reported items | — |
| `POST` | `/items` | Protected | Report a new Lost or Found item | — |
| `POST` | `/items/:id/claim` | Protected | Submit claim / found verification | — |
| `PUT` | `/items/:id/resolve` | Protected | Mark item as returned (starts TTL clock) | — |
| `DELETE`| `/items/:id` | Protected | Delete listing (Reporter only) | — |

#### **Example: Report Item Request**
```json
POST /api/items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Logitech MX Master 3S Mouse",
  "description": "Graphite grey color, small scratch near thumb wheel.",
  "type": "Found",
  "category": "Tech & Hardware",
  "building": "HQ Building 1",
  "floor": "3",
  "roomZone": "Meeting Room 3B",
  "contactEmail": "finder@company.com",
  "contactPhone": "+1 555-0144"
}
```

---

## 💻 Getting Started Locally

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance running on `localhost:27017`)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/SuryaSrekanth/lostnest.git
cd lostnest
```

---

### **2. Backend Configuration & Setup**
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lostnest?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

Start the backend development server:
```bash
npm run dev
```
> The API server will boot up with `nodemon` on **http://localhost:5000**.

---

### **3. Frontend Configuration & Setup**
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory (optional for local, defaults to localhost):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
> Open your browser and navigate to **http://localhost:5173**.

---

## ⚙️ Environment Variables

### **Backend (`server/.env`)**
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Port on which Express server listens | `5000` |
| `MONGODB_URI` | **Yes** | MongoDB connection string (Atlas or Local) | `mongodb+srv://user:pass@cluster.mongodb.net/lostnest` |
| `JWT_SECRET` | **Yes** | Secret cryptographic key for signing JWTs | `a_long_random_secure_string_here` |

### **Frontend (`client/.env`)**
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | No | Base URL to the Express backend API gateway | `http://localhost:5000/api` or `https://lostnest.onrender.com/api` |

---

## 🔒 Security & Production Hardening

- **Bcrypt Password Encryption:** User passwords are never stored in plaintext; salted with 10 rounds of bcrypt hashing before saving.
- **Strict Authorization:** Only the original reporter of an item has permission to execute `PUT /api/items/:id/resolve` or `DELETE /api/items/:id`.
- **Anti-Theft Confidentiality:** Claim notes (which contain sensitive identification details) are protected and restricted to the item reporter and claimant.
- **Search Injection Defense:** User search inputs are sanitized with escaped regular expressions to prevent query injection attacks.
- **Repository Hygiene:** All environment configurations, secrets, and local databases are strictly shielded via `.gitignore`.

---

## 🚀 Deployment

- **Frontend on Vercel:**  
  Configured with `client/vercel.json` rewrite rules to seamlessly handle client-side routing on React Router DOM:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Backend on Render:**  
  Configured as a Web Service running `node server.js` with automatic GitHub deployments on pushes to `main`.
- **Database on MongoDB Atlas:**  
  Cloud-hosted M0/M10 cluster with automated IP access whitelisting and auto-indexing enabled for TTL purge.

---

## 👤 Author

**Surya Srekanth**
- **GitHub:** [@SuryaSrekanth](https://github.com/SuryaSrekanth)
- **LinkedIn:** [linkedin.com/in/surya-srekanth](https://www.linkedin.com/in/surya-srekanth)
- **Portfolio:** [suryasrekanth.vercel.app](https://suryasrekanth.vercel.app)

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use, modify, and distribute it as needed.

<div align="center">
  <sub>Engineered with ❤️ by <b>Surya Srekanth</b> • Built with React 19, Express 5, MongoDB Atlas & Tailwind CSS v4</sub>
</div>
