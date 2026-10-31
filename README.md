# Aman Jaiswal — Full Stack Developer Portfolio

A premium, production-ready personal portfolio website built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features a modern dark UI with blue/purple gradient accents, smooth Framer Motion animations, and a full-stack contact form backed by MongoDB.

---

## ✨ Features

- **Premium Dark UI** — Deep navy backgrounds, electric blue/purple gradients, glass-inspired cards
- **Smooth Animations** — Framer Motion scroll-reveal effects and hero animations
- **Responsive Design** — Works flawlessly across mobile, tablet, and desktop
- **Active Nav Tracking** — IntersectionObserver-based section detection
- **Contact Form** — Full client + server validation, MongoDB storage, loading/success/error states
- **Rate Limiting** — 5 contact submissions per IP per hour
- **Security Headers** — Helmet, CORS, request size limits
- **Resume Download** — One-click PDF download
- **404 Page** — Gradient styled not-found page
- **SEO Ready** — Meta tags, Open Graph, semantic HTML

---

## 🗂️ Project Structure

```
portfolio/
├── client/                    # React + Vite frontend
│   ├── public/
│   │   ├── resume.pdf         # ← REPLACE with your actual resume
│   │   ├── favicon.svg
│   │   └── images/            # Project screenshots go here
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── TimelineItem.jsx
│   │   │   ├── SectionReveal.jsx
│   │   │   └── icons.jsx      # Custom SVG brand icons
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Experience.jsx
│   │   │   └── Contact.jsx
│   │   ├── data/
│   │   │   ├── skills.js      # ← Edit your skills here
│   │   │   ├── projects.js    # ← Add your projects here
│   │   │   └── experience.js  # ← Add education/experience here
│   │   ├── hooks/
│   │   │   └── useActiveSection.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Design system & global styles
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── server/                    # Express + MongoDB backend
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── contactController.js
    │   │   └── profileController.js
    │   ├── middleware/
    │   │   ├── validate.js
    │   │   └── errorHandler.js
    │   ├── models/
    │   │   └── ContactMessage.js
    │   ├── routes/
    │   │   ├── contact.js
    │   │   └── profile.js
    │   ├── app.js
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9
- MongoDB Atlas account (or local MongoDB for dev)

### 1. Clone the repository

```bash
git clone https://github.com/yourgithub/portfolio.git
cd portfolio
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and CORS origin
npm install
npm run dev
```

The server starts on **http://localhost:5000**

### 3. Setup the Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

> The Vite dev server automatically proxies `/api/*` requests to `localhost:5000`.

---

## ⚙️ Environment Variables

### Backend — `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,https://your-portfolio.vercel.app` |

### Frontend — `client/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL (leave empty in dev) | `https://your-backend.onrender.com/api` |

---

## 📝 Personalizing Your Portfolio

### 1. Update your personal info

Edit `client/src/sections/About.jsx`:
- Replace the placeholder bio, goal, and interests
- Replace `📍 India`, email, and degree placeholders
- To add a profile photo: save it as `client/public/images/profile.jpg` and replace the `<User>` icon placeholder in About.jsx

Edit `client/src/sections/Hero.jsx`:
- Update GitHub and LinkedIn links

Edit `client/src/components/Footer.jsx`:
- Update GitHub, LinkedIn, and email links

### 2. Add your real projects

Edit `client/src/data/projects.js`:
```js
{
  id: 1,
  title: 'My Real Project',
  description: 'Description of what it does and the problems it solves.',
  tech: ['React.js', 'Node.js', 'MongoDB'],
  image: '/images/project1.jpg',   // Save screenshot to client/public/images/
  liveUrl: 'https://my-project.vercel.app',
  githubUrl: 'https://github.com/yourgithub/project',
  featured: true,
}
```

### 3. Update your skills

Edit `client/src/data/skills.js` — add, remove, or change skill entries and levels.

### 4. Add your education & experience

Edit `client/src/data/experience.js` — fill in real institution names, durations, and descriptions.

### 5. Replace the resume

Replace `client/public/resume.pdf` with your actual resume PDF.  
The file **must** be named `resume.pdf` for the download button to work.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/profile` | Public profile data |
| `GET` | `/api/projects` | Projects list |
| `GET` | `/api/skills` | Skills list |
| `POST` | `/api/contact` | Submit contact message |

### POST `/api/contact` — Request Body

```json
{
  "name": "Recruiter Name",
  "email": "recruiter@company.com",
  "subject": "Collaboration opportunity",
  "message": "Hi Aman, I would love to discuss a role..."
}
```

### POST `/api/contact` — Success Response (201)

```json
{
  "success": true,
  "message": "Your message has been sent successfully! I will get back to you soon.",
  "id": "64abc123..."
}
```

### POST `/api/contact` — Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed. Please check your input.",
  "errors": [
    { "field": "email", "message": "Enter a valid email address." }
  ]
}
```

---

## 🏗️ Production Build

### Build the Frontend

```bash
cd client
npm run build
```

Outputs to `client/dist/`. Deploy this folder to Vercel.

### Deploy the Backend

For **Render**:
1. Create a new Web Service pointing to the `server/` folder
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add all environment variables from `server/.env.example`

---

## 🚢 Deployment Guide

### Frontend → Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy ✅

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service → Connect repo
2. Set **Root Directory** to `server`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas URI
   - `CORS_ORIGINS` — your Vercel frontend URL
   - `NODE_ENV` — `production`
6. Deploy ✅

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist all IPs (`0.0.0.0/0`) for Render access
5. Copy the connection URI and set it as `MONGODB_URI` in Render

---

## 🛡️ Security Features

- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricts origins via environment variable
- **Rate Limiting** — 5 contact submissions / IP / hour; 100 global requests / 15 min
- **express-validator** — Server-side input sanitization and validation
- **Body size limit** — 50KB max on JSON requests
- **No secrets in code** — All credentials loaded via environment variables

---

## 🧰 Tech Stack

### Frontend
| Tech | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first CSS |
| Framer Motion | Latest | Animations |
| Lucide React | Latest | Icons |
| Axios | Latest | HTTP client |
| React Router | 7 | Client-side routing |

### Backend
| Tech | Version | Purpose |
|---|---|---|
| Node.js | ≥18 | Runtime |
| Express | 5 | Web framework |
| Mongoose | 9 | MongoDB ODM |
| Helmet | 8 | Security headers |
| cors | 2 | Cross-origin handling |
| express-rate-limit | 8 | Rate limiting |
| express-validator | 7 | Input validation |
| dotenv | 18 | Environment variables |

---

## 📄 License

MIT © Aman Jaiswal

---

> **Note:** Replace all `[placeholder]` values and `yourgithub`/`yourlinkedin` references with your real information before going live.
