# 🗪 QuickChat — Real-Time MERN Chat Application

A production-quality, real-time chat application built with the **MERN stack** and **Socket.IO**, featuring a beautiful glassmorphism UI.

---

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes & persistent sessions
- Auto-generated avatars via DiceBear API

### 💬 Real-Time Chat
- Instant messaging with Socket.IO
- Online/offline user status with pulse animation
- Typing indicators (live "user is typing...")
- Auto-scroll to latest messages
- Message read receipts (✓ / ✓✓)
- Unread message counters per user
- Toast notifications for new messages
- Emoji picker integration

### 🎨 UI/UX
- Glassmorphism design with sky-blue palette
- Fully responsive (mobile + desktop)
- Mobile sidebar drawer with smooth transitions
- Framer Motion animations throughout
- Loading skeletons for user list
- Modern chat bubbles with rounded corners

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Animations | Framer Motion                       |
| State      | React Context API                   |
| Real-Time  | Socket.IO Client                    |
| HTTP       | Axios                               |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT, bcryptjs                       |
| WebSocket  | Socket.IO Server                    |

---

## 📁 Folder Structure

```
QuickChat/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── userController.js     # User list, unread counts
│   │   └── messageController.js  # Send, fetch, mark-read
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Message.js            # Message schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/
│   │   └── socketHandler.js      # Socket.IO event handlers
│   ├── server.js                 # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx    # Messages + input area
│   │   │   ├── Sidebar.jsx       # User list + search
│   │   │   ├── MessageBubble.jsx # Single message
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state
│   │   │   ├── SocketContext.jsx # Socket connection
│   │   │   └── ChatContext.jsx   # Chat state
│   │   ├── hooks/
│   │   │   ├── useMessages.js    # Message send/receive logic
│   │   │   └── useTyping.js      # Typing indicator logic
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ — https://nodejs.org
- MongoDB (local) — https://www.mongodb.com/try/download/community
- npm or yarn

### 1. Clone / Setup

```bash
# Create project folder
mkdir chat-app && cd chat-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Start backend (development)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (development)
npm run dev
```

### 4. Open in Browser

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
MongoDB:  mongodb://127.0.0.1:27017/chatapp
```

---

## 🔑 Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description         | Auth |
|--------|--------------------|---------------------|------|
| POST   | /api/auth/register | Register new user   | No   |
| POST   | /api/auth/login    | Login user          | No   |
| GET    | /api/auth/me       | Get current user    | Yes  |

### Users
| Method | Endpoint                  | Description          | Auth |
|--------|---------------------------|----------------------|------|
| GET    | /api/users                | Get all users        | Yes  |
| GET    | /api/users?search=query   | Search users         | Yes  |
| GET    | /api/users/unread-counts  | Get unread counts    | Yes  |

### Messages
| Method | Endpoint                    | Description          | Auth |
|--------|-----------------------------|----------------------|------|
| GET    | /api/messages/:userId       | Get conversation     | Yes  |
| POST   | /api/messages               | Send message         | Yes  |
| PUT    | /api/messages/read/:userId  | Mark messages read   | Yes  |

---

## 📡 Socket.IO Events

### Client → Server
| Event         | Payload                              | Description          |
|---------------|--------------------------------------|----------------------|
| user:online   | userId                               | Register as online   |
| message:send  | { message, receiverId }              | Send message         |
| typing:start  | { senderId, receiverId }             | Start typing         |
| typing:stop   | { senderId, receiverId }             | Stop typing          |
| messages:read | { senderId, receiverId }             | Mark messages read   |

### Server → Client
| Event           | Payload                              | Description          |
|-----------------|--------------------------------------|----------------------|
| users:online    | [userId, ...]                        | Online users list    |
| message:receive | message object                       | New message arrived  |
| notification:new| { senderId, senderName, content }    | Push notification    |
| typing:start    | { senderId }                         | Someone typing       |
| typing:stop     | { senderId }                         | Stopped typing       |
| messages:read   | { receiverId }                       | Messages marked read |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Ensure MongoDB is running: `mongod` or start MongoDB service |
| Port 5000 in use | Change PORT in `.env` |
| CORS error | Ensure frontend runs on `localhost:5173` |
| Socket not connecting | Check backend is running on port 5000 |
| npm install fails | Delete `node_modules` and `package-lock.json`, retry |

---

## 🔮 Future Improvements

- [ ] Group chat support
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Message reactions (❤️ 👍 😂)
- [ ] End-to-end encryption
- [ ] Push notifications (PWA)
- [ ] User profile customization
- [ ] Message deletion / editing
- [ ] Dark mode toggle

---

## 📸 Screenshots

> Screenshots are here after running the app.

— Landing page
<img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/b62a3191-faa2-4916-9843-aa03fb7255b6" />

— Login Page
<img width="1919" height="822" alt="image" src="https://github.com/user-attachments/assets/62d97347-4d76-428b-b623-e07e9d7fbd3e" />

— Chat Page
<img width="1919" height="822" alt="image" src="https://github.com/user-attachments/assets/4fb8e126-b4a6-4319-983a-53b875f9e167" />

— Chat Window
<img width="1169" height="782" alt="image" src="https://github.com/user-attachments/assets/84a81f4e-44f5-4ff2-b6df-8f05c42cc6ff" />



---

## 👨‍💻 Built For

Internship Project — MERN Stack Real-Time Chat Application  
**Tech**: React · Node.js · Express · MongoDB · Socket.IO
