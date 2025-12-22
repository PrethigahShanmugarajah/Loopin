# 🔗 Loopin – Social Media Networking App (React + Node + Express + MongoDB)

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey?logo=express)](https://expressjs.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk)](https://clerk.com/)

**Loopin** is a **full-featured social media app** where users can **connect, share posts, stories, and messages**, as well as **follow and interact with others**. It integrates **Clerk** for authentication and **Cloudinary** for media uploads.

---

## ✨ Features

### 🔗 Social Networking

- Sign up/login with **Clerk**
- Follow and unfollow other users
- Send, accept, and manage connection requests
- View user profiles, connections, and followers

### 📸 Posts & Stories

- Create posts with text and images
- Like posts and view feeds
- Upload stories (text, image, or video)
- Auto-delete stories after 24 hours
- Media validation for stories (video size & duration limit)

### 💬 Messaging

- Real-time messaging using **SSE**
- View chat history with connections
- Receive notifications for unseen messages
- Send images along with messages

### 🛠️ Technologies Used

**Frontend:**

- React.js (Vite)
- Tailwind CSS / Custom CSS
- Axios for API calls
- React Router DOM
- React Hot Toast (notifications)
- Framer Motion (animations)

**Backend:**

- Node.js & Express.js
- MongoDB with Mongoose
- Clerk (authentication & multi-session profiles)
- Cloudinary (media uploads)
- dotenv (environment configuration)
- Inngest (cron & event-driven functions for notifications & story deletion)

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PrethigahShanmugarajah/Loopin
cd Loopin
```

---

### 2️⃣ Backend Setup

```bash
cd Server
npm install
npm run server
```

### 3️⃣ Frontend Setup

```bash
cd Client
npm install
npm run dev
```

---

## 🔑 Environment Variables Setup

### 📂 Backend `.env` (Server/)

```
# Server / .env
# -------- Frontend URL -------- #
FRONTEND_URL=
MONGODB_URI=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
SENDER_EMAIL=
SMTP_USER=
SMTP_PASS=

```

### 📂 Frontend `.env` (Client/)

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BASEURL=
```

---

## 📎 Project Link

[GitHub Repository](https://github.com/PrethigahShanmugarajah/Loopin)

---

## 👨‍💻 Author

**Prethigah Shanmugarajah (2020/2021)**<br>
Department of Software Engineering, <br>
Faculty of Computing,<br>
Sabaragamuwa University of Sri Lanka.

---
