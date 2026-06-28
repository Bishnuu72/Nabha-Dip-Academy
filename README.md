# Nabha Dip Academy Secondary English School (NDASES)

A school management web app with role-based portals for students, teachers, parents, and admins.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Firebase
- **Backend:** Express.js (lightweight API)
- **Database:** Firebase Firestore (real-time)
- **Auth:** Firebase Authentication + localStorage sessions

---

## Project Structure

```
NDASES/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI (Navigation, Footer, etc.)
│   │   ├── context/      # AppContext — global state & Firebase logic
│   │   ├── pages/        # Public pages (Home, About, etc.)
│   │   ├── portals/      # Role dashboards (Admin, Teacher, etc.)
│   │   └── firebase.js   # Firebase config & init
│   └── package.json
├── server/               # Express backend (port 5001)
│   └── index.js
├── setCors.js            # Firebase Storage CORS setup script
└── cors.json             # CORS rules for Firebase Storage
```

---

## Roles & Portals

| Role    | Portal         | Default Email            | Password    |
| ------- | -------------- | ------------------------ | ----------- |
| Admin   | AdminPortal    | admin@gmail.com          | admin123    |
| Teacher | TeacherPortal  | teacher@school.edu       | teacher123  |
| Student | StudentPortal  | student@school.edu       | student123  |
| Parent  | ParentPortal   | parent@school.edu        | parent123   |

---

## Getting Started

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Run the frontend

```bash
cd client
npm run dev
```

Opens at `http://localhost:5173`.

### 3. Run the backend (optional)

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5001`.

---

## Features

- Public pages: Home, About, Academics, Admissions, Contact, Gallery
- Role-based dashboards with separate views and permissions
- Real-time updates via Firestore listeners
- Notice board, events, assignments, attendance tracking
- Admissions application & inquiry forms
- Leave management for parents
- Gallery management
- School config (logo, principal profile)
- Auto-seeds demo data on first run

---

## Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start Vite dev server         |
| `npm run build`      | Production build              |
| `npm run preview`    | Preview production build      |
| `npm run seed`       | Seed Firestore with demo data |
| `npm run set-cors`   | Apply CORS config to Storage  |

---

## License

Private — Nabha Dip Academy Secondary English School
