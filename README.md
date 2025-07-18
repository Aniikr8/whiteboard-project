# 🎨 Collaborative Whiteboard

A real-time collaborative whiteboard built with **React**, **Node.js**, **Socket.IO**, and **MySQL**. Multiple users can draw, erase, and share a room to work together on a whiteboard live!

## 🔗 Live Demo
https://whiteboard-project-lv8y.vercel.app/

- **Frontend**: [Deployed on Vercel](https://whiteboard-project-lv8y.vercel.app/)
- **Backend**: [Deployed on Render](https://whiteboard-backend-0wlm.onrender.com)
- **Database**: [FreeSQLDatabase.com](https://www.freesqldatabase.com)



---

## 🧰 Tech Stack

- 🎨 Frontend: React + Vite
- 🚀 Backend: Node.js + Express + Socket.IO
- 🛢️ Database: MySQL (hosted on freesqldatabase.com)
- ☁️ Hosting: Render (Backend), Vercel/Netlify (Frontend)

---

## ✨ Features

- ✅ Real-time collaborative drawing
- 🖍️ Pen & Eraser tool
- 💾 Save drawing to MySQL
- 🔁 Load previous saved drawing using Room ID
- 🧹 Clear entire canvas
- 📱 Fully responsive (mobile & desktop)
- 🔗 Shareable room links

---
## 🗃️ Database

You can use [FreeSQLDatabase.com](https://www.freesqldatabase.com) for free MySQL hosting.

### Table Schema

db.js <br>
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "whiteboard",
});

<br>
sql<br>
CREATE TABLE drawings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---
## 📸 Preview

![image](https://github.com/user-attachments/assets/8ef51f0c-6055-48e9-8120-dab4edf623f5)
![image](https://github.com/user-attachments/assets/17359d8e-d28e-464e-8187-3d734f2a240e)
![image](https://github.com/user-attachments/assets/2cbeaa15-20b0-4109-8924-793fd15ec659)

---

## 🏗️ Project Structure
whiteboard/
├── backend/
│   ├── index.js
│   ├── db.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── Whiteboard.jsx
│   ├── public/
│   └── package.json
└── README.md

## 📦 Clone the Repository

``` git clone https://github.com/Aniikr8/whiteboard-project.git ```
```cd whiteboard ```



## Install Dependencies

Navigate to the `backend` directory and install the required Node.js dependencies:

```cd backend   npm install ```

```npm start```

## 🎨 Frontend Setup (/frontend)
Navigate to the `frontend` directory and install the required dependencies:
```cd frontend ```
```npm install```  
```npm run dev```

## 🛠️ How to Use

1. Visit http://localhost:5173/room123

2. Draw using pen/eraser tools

3. Click Save to store drawing in MySQL

4. Join the same room from another device to collaborate

5. Click Clear to clear the whiteboard (real-time)




