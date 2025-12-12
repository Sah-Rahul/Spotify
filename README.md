# 🎧 Spotify Clone

A fully-featured **Spotify Clone** built with **MERN Stack**, **Microservices Architecture**, **JWT Authentication**, **Cloudinary Uploads**, and a powerful **Admin Dashboard** for managing songs and albums.

---

## 🚀 Features

### 🎵 User Features
- **Browse** trending songs and albums
- **Play music** with a fully functional audio player
- **Like songs** and build your playlist
- **View album songs** and explore collections
- **Responsive UI** optimized for mobile and desktop

### 🛠 Admin Dashboard
- **Add / Update / Delete** songs
- **Add / Update / Delete** albums
- **Upload** thumbnails and audio files to Cloudinary
- **View** total songs and albums statistics
- **Role-based** admin protection

### 🔐 Authentication
- **JWT-based** authentication
- **Secure cookies** for session management
- **Admin/User** role-based access control

### ☁ Microservices Architecture
- **Auth Service** - User authentication and authorization
- **Song Service** - Song management and operations
- **Album Service** - Album management and operations
- **API Gateway** - Unified entry point for all services
- **React Client** - Frontend application

---

##  Tech Stack

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- Context API
- React Router
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary
- Microservices Architecture
- JWT Authentication

---

## 📂 Project Structure

```
/client
├── src
│   ├── components
│   ├── Context
│   ├── pages
│   └── App.tsx

/auth-service
/song-service
/album-service
/admin-service
/api-gateway
```

---

## ⚙️ Environment Variables

### API Gateway (`.env`)
```env
PORT=7000
AUTH_SERVICE=http://localhost:5001
SONG_SERVICE=http://localhost:5002
ALBUM_SERVICE=http://localhost:5003
```

### Song Service (`.env`)
```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5002
```


### 1️⃣ Install Dependencies

```bash
# Client
cd client && npm install

# Auth Service
cd auth-service && npm install

# Song Service
cd song-service && npm install

# Album Service
cd album-service && npm install

# API Gateway
cd api-gateway && npm install
```

### 3️⃣ Start frontend

```bash
cd frontend
npm run dev
```

---

## ✅ Completed Features

- ✅ User authentication
- ✅ Admin dashboard
- ✅ Song upload
- ✅ Album upload
- ✅ Cloudinary integration
- ✅ Audio player
- ✅ Playlist feature
- ✅ Microservices setup

---

## 🚀 Future Updates

- 🔍 Search system
- 👤 Artist pages
- 🎙️ Podcasts
- 📊 Analytics dashboard for admin
- 📱 Mobile app (React Native)
- 🌐 Social features (follow, share)

---

## 🤝 Contributing

Contributions are **welcome**! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

> **Note:** Please open an issue before making major changes.

---

## 👨‍💻 Author

Made with ❤️ by **Rahul Sah**

---

## 🙏 Acknowledgments

- Inspired by Spotify
- Built with modern web technologies
- Special thanks to the open-source community

---

**⭐ If you like this project, don't forget to give it a star!**