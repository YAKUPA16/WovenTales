<p align="center">
  <img width="300" height="300" alt="WovenTalesFinal" src="https://github.com/user-attachments/assets/78397da7-855d-444d-b6ff-370f90040abd" />
</p>

# **WovenTales**
*Interactive branching-story creation and reading platform.*

<p align="left">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square" />
</p>

---

## 📌 **Overview**
**WovenTales** is a full-stack platform that enables users to **create**, **publish**, and **experience** interactive branching stories. Writers craft multi-path narratives, while readers explore dynamic storylines through player choices—similar to visual novels or interactive fiction games.

---

## 🚀 **Key Features**

### ✍️ **Story Builder**
- Create stories with title, cover, and description  
- Add scenes with branching choices  
- Link scenes to build complex narrative paths  

### 📖 **Interactive Reader**
- Clean reading UI  
- Scene-by-scene navigation  
- Choices determine story direction  
- Fully responsive design  

### 🗂️ **Explore System**
- Browse popular, featured, and trending stories  
- Story cards show cover, stats, and quick view  

### 🧭 **User Dashboard**
- Manage authored stories  
- Track reads and engagement  
- (Optional) Admin features  

### 🛠️ **Backend API**
- RESTful architecture  
- JWT-secured authentication  
- CRUD for stories, scenes, users, and prompts  

---

## 🧱 **Tech Stack**

### **Frontend**
- React.js  
- React Router  
- Axios  
- CSS / Tailwind  
- Vercel Deployment  

### **Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  

---

## 📁 **Project Structure**
```
WovenTales/
├── api/ # Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
│ └── package.json      <- Backend dependencies
│
├── src/ # Frontend
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.js
│ └── package.json      <- Frontend dependencies
│
└── README.md
└── LICENSE
```
---

## 🌐 **API Endpoints (Summary)**

### **Stories**
```
GET /api/stories
GET /api/stories/:id
POST /api/stories
PATCH /api/stories/:id
DELETE /api/stories/:id
```

### **Scenes**
```
GET /api/scenes/:storyId
POST /api/scenes
PATCH /api/scenes/:sceneId
```

### **Auth**
```
POST /api/auth/register
POST /api/auth/login
```

---

## ▶️ **Run Locally**

### **Backend Setup**
```
cd api
npm install
npm start
```
Create .env:
```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=your_cloudinary_folder_path
```
Frontend Setup
```
cd client
npm install
npm start
```

---

## 🌐 **Deployment**

WovenTales is deployed using **Vercel**, with:

- `vercel.json` for backend API routing  
- React frontend deployed as a static build  

---

## 🤝 **Contributing**

Pull requests are welcome!  
Please follow clean code practices and meaningful commit messages.

---

## 📄 **License**

This project is licensed under the **MIT License**.

---

## ⭐ **Support**

If you like the project, consider giving it a ⭐ on GitHub!

