# InterviewTayari Task

## 🚀 Project Overview
This project is a **MERN Stack Interview Preparation Platform** where users can:
- Register and log in securely using **JWT authentication** with hashed passwords (**bcrypt**).
- Fill out a **questionnaire form** to personalize their SQL preparation plan.
- Get an **AI-generated SQL study plan** based on their responses.
- Store and retrieve their preparation plan anytime.
- **Gemini API** is used to assist in generating SQL preparation plans.

---

## 📂 Folder Structure
```
InterviewTayari_Task/
│── server/         # Backend (Node.js, Express, MongoDB)
│── client/         # Frontend (Vite + React.js)
│── README.md       # Project Documentation
```

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```bash
 git clone https://github.com/Chatepawan/InterviewTayari_Task.git
```

### **2️⃣ Setup Backend (Server)**
```bash
 cd server
 npm install
```

#### **🔧 Configure Environment Variables**
- Create a `.env` file inside the `server/` folder and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

#### **🚀 Run the Server**
```bash
 node server.js
```

---

### **3️⃣ Setup Frontend (Client)**
```bash
 cd ..  # Go back to root folder
 cd client
 npm install
```

#### **🚀 Run the Client**
```bash
 npm run dev
```

---

## 📌 Features
- **User Authentication**: Secure login & register with JWT, bcrypt password hashing.
- **Questionnaire Form**: Collects user input for personalized SQL study plans.
- **AI-Generated Plan**: Uses **Gemini API** to generate SQL preparation recommendations.
- **Data Persistence**: Stores the study plan in **MongoDB** for future reference.

---

