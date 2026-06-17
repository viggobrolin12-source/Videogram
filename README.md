# Videogram - Social Media Video Platform

A YouTube-like social media platform where users can upload, watch, comment on, and discover videos.

## Features

- 🎥 **Video Upload & Streaming** - Upload and stream videos in high quality
- 👥 **User Profiles** - Create profiles, follow other users, gain followers
- ❤️ **Engagement** - Like videos, leave comments, get views
- 🔍 **Search & Discovery** - Search for videos and discover new content
- 💬 **Comments** - Comment on videos and interact with other users
- 📊 **Analytics** - Track views, likes, and follower growth
- 🔐 **Authentication** - Secure user authentication with JWT

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- Redux for state management
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- JWT for authentication
- Multer for video uploads
- Cloudinary/AWS S3 for video storage (optional)

### Database
- MongoDB with Mongoose ODM

## Project Structure

```
videogram/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── redux/           # Redux store, slices
│   │   ├── styles/          # Global styles
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── docs/                     # Documentation
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/viggobrolin12-source/videogram.git
cd videogram
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection string and JWT secret
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos` - Upload new video
- `DELETE /api/videos/:id` - Delete video
- `PUT /api/videos/:id` - Update video details

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Comments
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Likes
- `POST /api/videos/:id/like` - Like video
- `POST /api/videos/:id/unlike` - Unlike video

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] Video transcoding and optimization
- [ ] Live streaming
- [ ] Direct messaging
- [ ] Video recommendations using ML
- [ ] Playlist creation
- [ ] Video editing tools
- [ ] Mobile app (React Native)
- [ ] Monetization features

## Support

For support, email support@videogram.com or open an issue on GitHub.
