# 📸 Picx 

Picx is a full-stack social media application that allows users to share photos, interact with others through posts, comments, and real-time messaging. This project is built with a modern tech stack using **Node.js, Express, MongoDB** for the backend and **React** for the frontend.

## 🌐 Live Demo
*Coming Soon...*

## Project Overview
Picx is a fullstack social media platform focused on image sharing with social interactions. It allows users to upload posts, interact with content through likes and comments, follow other users, and send direct messages.

## 🚀 Features

### ✅ User Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- User profile management
- Profile picture uploads
- User signup & login with password hashing

### 📸 Post Management
- Image uploads with Multer middleware
- Create/delete posts
- Like/unlike functionality
- Comment system
- Bookmark posts
- Upload images using **Multer + Cloudinary**
- View a feed of posts

### 💬 Messaging System
- Direct messaging (real-time with Socket.io)
- Real-time chat using **Socket.IO**
- Conversations and messages saved in MongoDB

### 👥 Social Features
- Follow/unfollow users
- User suggestions
- View user profiles
- Edit profile information
- Upload profile pictures

## 🔧 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /profile/:id` - Get user profile
- `POST /profile/edit` - Edit profile (with profile picture)
- `GET /suggested` - Get suggested users
- `POST /followUnfollow/:id` - Follow/unfollow user

### Post Routes (`/api/v1/post`)
- `POST /addpost` - Create new post (with image)
- `GET /all` - Get all posts
- `GET /userpost/all` - Get user's posts
- `GET /like/:id` - Like/unlike post
- `POST /comment/:id` - Add comment to post
- `POST /comment/all/:id` - Get post comments
- `DELETE /delete/:id` - Delete post
- `GET /bookmark/:id` - Bookmark post

### Message Routes (`/api/v1/message`)
- `POST /send/:id` - Send message
- `GET /all/:id` - Get messages

## ⚙️ Tech Stack

### Backend
- Node.js with Express
- MongoDB (database)
- Mongoose (ODM)
- Cloudinary (image storage)
- Socket.io (real-time communication)
- JWT (authentication)
- Multer (file uploads)
- Bcryptjs (password hashing)

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux (state management)
- Socket.io client (real-time features)
- Axios
- Context API
- React Router
- TailwindCSS / CSS Modules

## 🙌 Contributing
Feel free to fork this repository and open a pull request to suggest changes or improvements.

## 💡 Author
**SURYAKANT DWIVEDI**
