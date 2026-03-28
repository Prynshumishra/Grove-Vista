# 🏠 Grove Vista — Luxury Real Estate Platform

A full-stack MERN application for browsing, booking, and managing luxury real estate properties. Grove Vista features JWT-based authentication, an admin dashboard with full CRUD management, property booking with lead capture, and a premium dark-mode UI.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Making a User an Admin](#making-a-user-an-admin)
- [API Reference](#api-reference)
- [Pages & Components](#pages--components)
- [Design System](#design-system)

---

## 🛠 Tech Stack

### Backend (`/server`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express.js | ^5.2.1 | Web framework |
| MongoDB | — | Database |
| Mongoose | ^9.3.3 | ODM |
| JSON Web Tokens | ^9.0.3 | Authentication |
| bcrypt | ^6.0.0 | Password hashing |
| dotenv | ^17.3.1 | Environment config |
| cors | ^2.8.6 | Cross-Origin handling |
| nodemon | ^3.1.14 | Dev auto-restart |

### Frontend (`/vite-project`)
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI framework |
| Vite | ^8.0.1 | Build tool & dev server |
| React Router DOM | ^7.13.2 | Client-side routing |
| Framer Motion | ^12.38.0 | Animations |
| Lucide React | ^1.7.0 | Icon library |
| Tailwind CSS | ^3.4.19 | Utility-first styling |

---

## 📁 Project Structure

```
Pro/
├── elevate_user.js              # Script to grant admin privileges
│
├── server/                      # Backend (Express + MongoDB)
│   ├── server.js                # Entry point
│   ├── .env                     # Environment variables
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema (name, email, password, isAdmin)
│   │   ├── Property.js          # Property schema
│   │   ├── Booking.js           # Booking schema
│   │   └── Lead.js              # Lead schema
│   ├── controllers/
│   │   └── authController.js    # Register & Login logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT protect + admin guards
│   ├── routes/
│   │   ├── authRoutes.js        # POST /login, POST /register
│   │   ├── propertyRoutes.js    # CRUD for properties
│   │   ├── bookingRoutes.js     # CRUD for bookings + lead creation
│   │   └── dashboardRoutes.js   # Admin CRUD for leads, tasks, users
│   └── seeds/
│       └── propertySeed.js      # Seed initial property data
│
└── vite-project/                # Frontend (React + Vite)
    ├── index.html
    ├── .env                     # Frontend environment variables
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Routes definition
        ├── main.jsx             # App entry with AuthProvider
        ├── index.css            # Global styles
        ├── context/
        │   └── AuthContext.jsx  # Global auth state (user, login, logout)
        ├── components/
        │   ├── Navbar.jsx       # Fixed top nav with user dropdown
        │   ├── Footer.jsx       # Site footer
        │   ├── Layout.jsx       # Shared layout (Navbar + Footer)
        │   ├── Button.jsx       # Reusable button component
        │   ├── PropertyCard.jsx # Property display + booking modal
        │   └── ProtectedRoute.jsx # Route guard for authenticated pages
        └── pages/
            ├── Home.jsx         # Landing page
            ├── Properties.jsx   # All properties listing
            ├── About.jsx        # About page
            ├── Login.jsx        # Login page
            ├── Signup.jsx       # Registration page
            └── Dashboard.jsx    # User/Admin dashboard with full CRUD
```

---

## ✨ Features

### Public
- **Home Page** — Hero section, featured listings (from DB or fallback), "Why Choose Us" features, client testimonials
- **Properties Page** — Full grid of all luxury properties with booking capability
- **About Page** — Company information
- **Login / Signup** — JWT authentication with form validation

### Authenticated Users
- **Property Booking** — Book a property via modal form (name, email, phone)
- **My Bookings Dashboard** — View and cancel active bookings

### Admins Only
- **Properties CRUD** — Add, edit, delete property listings
- **Leads Management** — View and manage property inquiry leads
- **Tasks Management** — Track internal tasks with priority & status
- **Users Management** — Manage platform users and roles
- **Dashboard Summary** — Stats for total leads, pending tasks, active users, properties

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher recommended) — [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (or a local MongoDB instance) — [Sign up](https://www.mongodb.com/atlas)

---

## 🔑 Environment Variables

### Backend — `server/.env`

Create a file at `server/.env` with the following content:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/grove_vista` |
| `JWT_SECRET` | Secret key for signing JWTs | Any long, random string |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |



---

### Frontend — `vite-project/.env`

Create a file at `vite-project/.env`:

```env
VITE_API_URL=http://localhost:5000
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |


---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Pro
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../vite-project
npm install
```

---

## ▶️ Running the Application

You need to run **both** the backend and frontend simultaneously — open two separate terminal windows.

### Terminal 1 — Start the Backend

```bash
cd Pro/server
npm run dev
```

Server will start on: **http://localhost:5000**

You should see:
```
Server running on port 5000
MongoDB Connected: <your-cluster-host>
```

### Terminal 2 — Start the Frontend

```bash
cd Pro/vite-project
npm run dev
```

App will be available at: **http://localhost:5173**

---

## 🌱 Database Seeding

To populate your MongoDB database with sample luxury property listings, run the seed script from inside the `server` directory:

```bash
cd Pro/server
node seeds/propertySeed.js
```

This will insert 4 sample properties (Sky-High Penthouse, Azure Bay Mansion, Royal Heritage Villa, Emerald Forest Retreat) **only if the properties collection is empty**. It is safe to run multiple times.

---

## 👑 Making a User an Admin

After signing up a user via the `/signup` page, you can grant them admin privileges using the `elevate_user.js` script located at the project root.

```bash
cd Pro
node elevate_user.js <user-email>
```

**Example:**
```bash
node elevate_user.js admin@grovevista.com
```

On success you will see:
```
Success: admin@grovevista.com is now an Admin.
```

Admin users gain access to the full dashboard including:
- Properties, Leads, Tasks, and Users management tabs

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Auth — `/api/auth`

| Method | Endpoint | Access | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | Register a new user |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Login and receive JWT token |

**Login Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "<JWT_TOKEN>"
}
```

---

### Properties — `/api/properties`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/properties` | Public | Get all properties |
| `POST` | `/api/properties` | Admin only | Add a new property |
| `PUT` | `/api/properties/:id` | Admin only | Update a property |
| `DELETE` | `/api/properties/:id` | Admin only | Delete a property |

**Property Object:**
```json
{
  "title": "Sky-High Penthouse",
  "location": "Worli, Mumbai",
  "price": 450000000,
  "beds": 5,
  "baths": 6,
  "sqft": 8500,
  "type": "Penthouse",
  "image": "https://...",
  "description": "..."
}
```

---

### Bookings — `/api/bookings`

All booking routes require authentication (`Authorization: Bearer <token>`).

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings` | Authenticated | Get logged-in user's bookings |
| `POST` | `/api/bookings` | Authenticated | Book a property (also creates a Lead) |
| `DELETE` | `/api/bookings/:id` | Authenticated (owner) | Cancel a booking |

**Booking Request Body:**
```json
{
  "propertyId": 1,
  "title": "Modern Glass Villa",
  "location": "Bandra West, Mumbai",
  "price": 450000000,
  "beds": 5,
  "baths": 6,
  "sqft": 6500,
  "image": "https://...",
  "name": "Your Name",
  "email": "you@email.com",
  "phone": "+91 9876543210"
}
```

---

### Dashboard — `/api/dashboard`

All dashboard routes require authentication. Write operations (POST, PUT, DELETE) require admin.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Stats: leads, tasks, users, properties |
| `GET` | `/api/dashboard/leads` | List all leads |
| `POST` | `/api/dashboard/leads` | Add a lead *(Admin)* |
| `PUT` | `/api/dashboard/leads/:id` | Update a lead *(Admin)* |
| `DELETE` | `/api/dashboard/leads/:id` | Delete a lead *(Admin)* |
| `GET` | `/api/dashboard/tasks` | List all tasks |
| `POST` | `/api/dashboard/tasks` | Add a task *(Admin)* |
| `PUT` | `/api/dashboard/tasks/:id` | Update a task *(Admin)* |
| `DELETE` | `/api/dashboard/tasks/:id` | Delete a task *(Admin)* |
| `GET` | `/api/dashboard/users` | List all users |
| `POST` | `/api/dashboard/users` | Add a user *(Admin)* |
| `PUT` | `/api/dashboard/users/:id` | Update a user *(Admin)* |
| `DELETE` | `/api/dashboard/users/:id` | Delete a user *(Admin)* |

---

## 🖥 Pages & Components

### Pages

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `Home.jsx` | Public | Landing page with hero, features, listings, testimonials |
| `/properties` | `Properties.jsx` | Public | Full property grid with booking |
| `/about` | `About.jsx` | Public | Company about page |
| `/login` | `Login.jsx` | Public | Login form |
| `/signup` | `Signup.jsx` | Public | Registration form |
| `/dashboard` | `Dashboard.jsx` | Protected | User/Admin dashboard |

### Key Components

| Component | Description |
|---|---|
| `Navbar.jsx` | Fixed glassmorphism navbar — desktop nav, mobile full-screen overlay, user dropdown with logout |
| `PropertyCard.jsx` | Property listing card — displays image, price, specs, and handles booking with modal form |
| `ProtectedRoute.jsx` | Redirects unauthenticated users to `/login` |
| `Layout.jsx` | Wraps pages with shared `<Navbar>` and `<Footer>` |
| `Button.jsx` | Reusable styled button with primary/secondary variants |
| `AuthContext.jsx` | React Context providing `user`, `login()`, `logout()`, and `loading` state app-wide |

### Dashboard Tabs

| Tab | Visible To | Description |
|---|---|---|
| Overview | All users | Summary stats + quick action cards |
| My Bookings | All users | Grid of booked properties with cancel option |
| Properties | Admin | CRUD table for managing property listings |
| Leads | Admin | CRUD table for managing inquiry leads |
| Tasks | Admin | CRUD table for managing team tasks |
| Users | Admin | CRUD table for managing platform users |

---

## 🎨 Design System

The app uses a custom dark-mode design system via Tailwind CSS.

### Custom Colors (in `tailwind.config.js`)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0B1120` | Page background |
| `accent` | `#D4AF37` | Gold highlights, CTAs, active states |
| `teal` | `#14B8A6` | Secondary accent, status indicators |

### Typography

- **Font:** Inter (Google Fonts), configured as `font-sans` default

### UI Patterns

- **Glassmorphism** — `.glass` utility class (backdrop blur + translucent background) used on cards, navbar, modals
- **Micro-animations** — Framer Motion `initial/animate/whileHover` on all major elements
- **Skeleton Loaders** — Animated pulse placeholders while data loads
- **Status Badges** — Color-coded pill badges for Lead, Task, Booking statuses
- **Portal Modals** — CRUD modals rendered via `createPortal` to `document.body` for correct z-index stacking

---

## 📌 Quick Start Checklist

- [ ] `cd server && npm install`
- [ ] Create `server/.env` with `MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`
- [ ] `cd vite-project && npm install`
- [ ] Create `vite-project/.env` with `VITE_API_URL`
- [ ] Terminal 1: `cd server && npm run dev`
- [ ] Terminal 2: `cd vite-project && npm run dev`
- [ ] Open `http://localhost:5173`
- [ ] Seed properties: `cd server && node seeds/propertySeed.js`
- [ ] Sign up, then run `node elevate_user.js <your-email>` from the `Pro/` root to become admin

---

