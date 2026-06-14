Markdown
# SnapLink – MERN URL Shortener

SnapLink is a high-performance, full-stack URL shortening application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a sleek, modern interface for users to create, manage, and track shortened URLs with real-time analytics.

## 🚀 Key Features

* **Secure Authentication:** JWT-based user registration and login system.
* **Smart URL Shortening:** Unique, collision-resistant 6-character short codes.
* **Click Analytics:** Track visitor IP, user-agent, and referral sources.
* **Dynamic QR Codes:** Instant base64 QR code generation for every link.
* **Modern UI:** Responsive design using Tailwind CSS with professional glass-morphism effects.

## 🛠 Tech Stack

* **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.
* **Frontend:** React (Vite), Tailwind CSS, Axios, React Router.

## ⚙️ Setup Instructions

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* MongoDB instance (Local or Atlas)

### 2. Installation
Clone the repository and install dependencies in both folders:

```bash
git clone [https://github.com/KarthickrajaVRGK/SnapLink.git](https://github.com/KarthickrajaVRGK/SnapLink.git)
cd SnapLink
npm install
cd backend && npm install
cd ../frontend && npm install
3. Configure Environment Variables
Create a .env file in the backend/ folder:

Code snippet
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Create a .env file in the frontend/ folder:

Code snippet
VITE_API_URL=http://localhost:5000
4. Running the Project
Use the concurrent script to start both the backend and frontend at once from the root folder:

Bash
# From the root folder
npm run dev
🏗 Project Structure
Plaintext
root/
├─ backend/          # Express API
│   ├─ controllers/
│   ├─ models/
│   └─ routes/
├─ frontend/         # Vite + React UI
│   ├─ src/
│   │   ├─ components/
│   │   └─ pages/
│   └─ index.css
└─ README.md
📝 License
This project is licensed under the MIT License.

This project is a part of a hackathon run by Katomaran.