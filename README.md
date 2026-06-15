# 🔗 SnapLink – MERN URL Shortener

## Overview

SnapLink is a full-stack URL shortening application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. It allows users to create, manage, and track shortened URLs through a modern and responsive interface.

### Features

- 🔐 JWT-based User Authentication
- 🔗 Create Shortened URLs
- 📊 Click Analytics and Tracking
- 📱 QR Code Generation and Export
- 🗑️ Edit and Delete URLs
- 🌙 Dark/Light Theme Toggle
- ✨ Glassmorphism UI Design
- 📱 Fully Responsive Layout

---

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

## Project Structure

```text
root/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── middleware/
│ ├── .env.example
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── styles/
│ ├── .env.example
│ └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or above)
- MongoDB (Local or Atlas)
- npm
- Git (Optional)

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Production Build

### Backend

```bash
npm start
```

### Frontend

```bash
npm run build
```

---

## Architecture

```text
React Frontend
      │
      ▼
Express API
      │
      ▼
MongoDB Database
      │
      ▼
Analytics & URL Tracking
```

---

## Assumptions

- Modern browsers are used.
- JWT tokens are stored client-side.
- Theme preferences are saved in localStorage.
- QR codes are generated using the `qrcode` package.
- URL redirects use HTTP 302 responses.
- Environment variables are configured correctly.

---

## Future Enhancements

- Custom URL Aliases
- Password-Protected Links
- URL Expiration Dates
- Advanced Analytics Dashboard
- Google/GitHub Authentication
- Bulk URL Shortening

---

## Demo Video

📹 Demo video link: https://youtu.be/SGNRPShQBT8?feature=shared

---

## License

This project is licensed under the MIT License.

---

## Hackathon Submission

This project was developed as part of a hackathon organized by https://katomaran.com .
