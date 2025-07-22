# 🐦 Tweet Automator

A professional, full-stack Twitter automation tool with AI-powered content generation and image support.

## ✨ Features

- 🔐 **Secure Authentication** - Password-protected access
- 🤖 **AI Tweet Generation** - Powered by Gemini AI with custom prompts
- 📷 **Image Upload Support** - Post tweets with images
- 🎨 **Professional UI** - Modern, responsive design with animations
- 🔄 **Real-time Preview** - See your content before posting
- ⚡ **Fast & Reliable** - Built with React + Node.js

## 🚀 Tech Stack

### Frontend
- **React** with Vite
- **Modern CSS** with gradients and animations
- **Responsive Design** for all devices

### Backend
- **Node.js** with Express
- **Twitter API v2** integration
- **Gemini AI** for content generation
- **Multer** for file uploads
- **Environment-based configuration**

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Twitter Developer Account
- Google AI Studio Account (for Gemini)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tweet-automator.git
cd tweet-automator
```

### 2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
ACCESS_CODE=your-secure-password
PORT=5000

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Twitter/X API Configuration
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_SECRET=your-access-secret
TWITTER_BEARER_TOKEN=your-bearer-token
```

### 4. Get API Keys

**Twitter API:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app with "Read and Write" permissions
3. Generate API keys and tokens

**Gemini AI:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development
npm run dev
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3001`

## 📖 Usage

1. **Login** with your configured password
2. **Write your tweet** or use AI generation
3. **Add custom AI prompts** for specific content types
4. **Upload images** (optional, up to 10MB)
5. **Preview and post** your tweet

### AI Prompt Examples
- "productivity tips for developers"
- "funny tech jokes"
- "motivational Monday quotes"
- "startup advice"

## 🔧 Configuration

### Twitter App Setup
- **App Type:** Web App, Automated App or Bot
- **Permissions:** Read and Write
- **Callback URL:** `http://localhost:3001/callback`
- **Website URL:** `http://localhost:3001`

### Supported Image Formats
- JPEG, PNG, GIF
- Maximum size: 10MB
- Automatic cleanup after upload

## 🛡️ Security Features

- Environment variable protection for API keys
- Secure file upload handling
- Password-protected access
- Automatic file cleanup
- CORS configuration

## 📁 Project Structure

```
tweet-automator/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   ├── .env              # Environment variables (create this)
│   └── uploads/          # Temporary image storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styling
│   │   └── main.jsx      # React entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and personal use. Please comply with Twitter's Terms of Service and API usage guidelines. Be responsible with automated posting and respect platform policies.

## 🙏 Acknowledgments

- Twitter API for social media integration
- Google Gemini AI for content generation
- React and Node.js communities for excellent frameworks

---

**Built with ❤️ for the developer community**
