# YelpCamp

A full-stack campground review app. Users can browse campgrounds on a map, sign up and log in, create and edit their own campground listings with photo uploads, and leave star ratings and reviews on campgrounds created by others.

**Live demo:** https://basecamp-yelcamp.vercel.app

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router for client-side routing
- Axios for API requests (cookie-based auth via `withCredentials`)
- MapTiler SDK for interactive maps and geocoding

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Passport.js (local strategy) with `express-session` for cookie-based authentication
- Cloudinary + Multer for image uploads
- Joi + `sanitize-html` for input validation/sanitization
- Helmet for security headers

**Infrastructure**
- Frontend hosted on **Vercel**
- Backend hosted on **Render**
- Database hosted on **MongoDB Atlas**

## Project Structure

```
.
├── backend/
│   ├── app.js                 # Express app entry point
│   ├── controllers/           # Route handler logic
│   ├── routes/                # campgrounds, reviews, user routes
│   ├── module/                # Mongoose models (campground, review, user)
│   ├── middleware.js          # Auth & validation middleware
│   ├── schema.js               # Joi validation schemas
│   ├── cloudinary/            # Cloudinary + Multer storage config
│   ├── seeds/                 # Database seed script
│   └── utils/                 # Error handling helpers
└── frontend/
    ├── src/
    │   ├── api/                # Axios client config
    │   ├── components/         # Navbar, maps, cards, star rating, etc.
    │   ├── pages/               # Home, Login, Register, Campground views
    │   └── context/             # App-wide React context (e.g. auth state)
    └── vite.config.js
```

## API Overview

All backend routes are relative to the API base URL.

| Method | Route                          | Description                        | Auth required |
|--------|---------------------------------|-------------------------------------|----------------|
| GET    | `/campground`                   | List all campgrounds                | No             |
| POST   | `/campground`                   | Create a campground                 | Yes            |
| GET    | `/campground/new`               | Get form data for new campground    | Yes            |
| GET    | `/campground/:id`               | Get a single campground             | No             |
| PUT    | `/campground/:id`               | Update a campground                 | Yes (author)   |
| GET    | `/campground/:id/edit`          | Get data for editing a campground   | Yes (author)   |
| DELETE | `/campground/:id/delete`        | Delete a campground                 | Yes (author)   |
| POST   | `/campground/:id/reviews`       | Add a review to a campground        | Yes            |
| DELETE | `/campground/:id/reviews/:reviewid` | Delete a review                 | Yes (author)   |
| GET    | `/register`                     | Get register form data              | No             |
| POST   | `/register`                     | Create a new user account           | No             |
| GET    | `/login`                        | Get login form data                 | No             |
| POST   | `/login`                        | Log in                              | No             |
| GET    | `/logout`                       | Log out                             | Yes            |
| GET    | `/me`                           | Get currently logged-in user        | No             |

## Local Development

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)
- MapTiler account (for maps/geocoding)

### Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/yelp-camp
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPTILER_API_KEY=your_maptiler_key
SESSION_SECRET=some_long_random_string
CLIENT_ORIGIN=http://localhost:5173
```

Run it:
```bash
npm start
```
The API runs on `http://localhost:3000`.

### Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

Run it:
```bash
npm run dev
```
The app runs on `http://localhost:5173`.

## Deployment

This project is deployed as two separate services:

1. **MongoDB Atlas** — hosts the database. Connection string is passed to the backend as `MONGO_URI`.
2. **Render (Web Service)** — hosts `backend/` as a Node API. Build command `npm install`, start command `npm start`.
3. **Vercel** — hosts `frontend/` as a static Vite build. Root directory set to `frontend`.

### Required environment variables

**Render (backend)**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | Cloudinary credentials |
| `MAPTILER_API_KEY` | MapTiler API key |
| `SESSION_SECRET` | Random string used to sign session cookies |
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | The deployed Vercel URL (no trailing slash), used for CORS |

**Vercel (frontend)**
| Variable | Description |
|---|---|
| `VITE_API_URL` | The deployed Render backend URL (no trailing slash) |

### Notes on cross-domain auth
Since the frontend and backend live on different domains, session cookies are set with `sameSite: 'none'` and `secure: true` in production, and the Express app has `trust proxy` enabled to work correctly behind Render's HTTPS proxy. CORS is configured with `credentials: true` and restricted to `CLIENT_ORIGIN`.

## Known limitations
- Render's free tier spins the backend down after inactivity; the first request after idling may take 30–60 seconds.
- MongoDB Atlas free tier network access is currently open to all IPs (`0.0.0.0/0`) since Render doesn't provide static outbound IPs on the free plan.