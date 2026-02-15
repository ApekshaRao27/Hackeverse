# 🚀 Hackeverse: AI-Powered Gamified Learning

Hackeverse is a comprehensive, full-stack educational platform designed to gamify the learning experience. It combines real-time competitive "Battle Mode" duels, AI-driven study assistance, and deep performance analytics for both students and teachers.

---

## 🏗️ Architecture Overview

The system follows a MERN stack architecture with real-time bidirectional communication for competitive play.



---

## ✨ Features

### 👨‍🎓 For Students
* **Quiz Arena:** Interactive quizzes with difficulty-based XP rewards and "50-50" lifelines.
* **Real-time Battle Mode:** 1v1 live quiz competitions using Socket.io.
* **AI Study Companion:** Integrated OpenAI chatbot for instant academic support.
* **Global Leaderboard:** Real-time ranking based on earned XP.

### 👩‍🏫 For Teachers
* **Analytical Dashboard:** Monitor total students, active quizzes, and weak topics.
* **Quiz Creator:** Streamlined interface for generating complex quiz sets with varying difficulty levels.
* **Performance Tracking:** Visual insights into student accuracy and trends.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, Axios, CSS3 |
| **Backend** | Node.js, Express.js |
| **Real-time** | Socket.io |
| **Database** | MongoDB, Mongoose |
| **AI Integration** | OpenAI API (GPT-4) |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas account or local instance

### Backend Installation
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` root:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    ```
4.  Start the server:
    ```bash
    node src/server.js
    ```

### Frontend Installation
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

---

## 📡 Socket.io Communication Flow

The Battle Mode relies on specific event listeners to sync scores and start matches.



| Event | Type | Description |
| :--- | :--- | :--- |
| `joinBattle` | Emit | Adds user to the matchmaking queue |
| `waiting` | Listen | Server signals it's looking for an opponent |
| `battleStart` | Listen | Match found; initializes questions and room ID |
| `submitAnswer` | Emit | Sends chosen option to server for validation |
| `scoreUpdate` | Listen | Broadcasts live score changes to both players |
| `battleEnded` | Listen | Finalizes scores and declares a winner |

---

## 📁 Project Structure

```text
Hackeverse/
├── backend/
│   ├── src/
│   │   ├── controllers/   # AI, Quiz, and User logic
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   └── server.js      # App entry & Socket config
│   └── .env               # Secrets
└── frontend/
    ├── src/
    │   ├── pages/    # Teacher & Student views
    │   ├── socket.js      # Socket.io client instance
    │   └── App.js         # Navigation & Routes
