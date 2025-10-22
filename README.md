# Lost & Found System

A full-stack web application for managing lost and found items with admin controls and user-friendly interface.

## 🚀 Features

### User Features
- **Two-Card Interface**: Separate views for Lost and Found items
- **Report Items**: Easy forms to report lost or found items
- **Claim Items**: Users can claim found items with proof of ownership
- **Search & Filter**: Browse items by category, location, and date
- **Dark/Light Theme**: Toggle between themes for better user experience

### Admin Features
- **Secure Authentication**: Admin login/registration system
- **Item Management**: View, edit, and update item status
- **Claim Approval**: Review and approve/reject item claims
- **Dashboard**: Comprehensive view of all items with filtering
- **Status Updates**: Change item status (Lost, Found, Pending, Returned)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Context** - State management for auth and theme

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

    Lost-and-Found-System/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                # API service files
│   │   │   ├── adminApi.js     # Admin authentication APIs
│   │   │   └── itemsApi.js     # Items and claims APIs
│   │   ├── components/         # React components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ClaimForm.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── ThemeContext.jsx # Theme management
│   │   ├── utils/              # Utility functions
│   │   │   └── dateUtils.js
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── prisma/
    │   ├── migrations/         # Database migrations
    │   └── schema.prisma      # Database schema
    ├── .env                   # Environment variables
    ├── index.js              # Server entry point
    └── package.json

