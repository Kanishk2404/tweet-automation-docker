# Tweet Automator API Server

A professional backend service for automated tweet generation and management.

## 🚀 Features

- **Secure Authentication** - Password-protected access with environment variable configuration
- **Tweet Generation** - AI-powered content creation (OpenAI integration ready)
- **RESTful API** - Clean, documented endpoints for all operations
- **Professional Logging** - Comprehensive request and error logging
- **Health Monitoring** - Built-in health check endpoints
- **Production Ready** - Environment-based configuration and graceful shutdown

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
ACCESS_CODE=your_secure_password
PORT=5000
NODE_ENV=development

# AI Integration (Optional)
OPENAI_API_KEY=your_openai_key

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

## 📚 API Documentation

### Authentication
```http
POST /auth
Content-Type: application/json

{
  "password": "your_access_code"
}
```

### Tweet Generation
```http
POST /generate-tweet
Content-Type: application/json

{
  "topic": "technology"
}
```

### Health Check
```http
GET /health
```

## 🛠️ Development

- **Development**: `npm run dev` (with nodemon)
- **Production**: `npm start`
- **Logs**: Check console output for detailed logging

## 🔒 Security Features

- Environment variable configuration
- CORS protection
- Request validation
- Error sanitization
- Graceful shutdown handling

## 📞 Support

For technical support or feature requests, contact the development team.

---

**Version**: 1.0.0  
**License**: Private  
**Last Updated**: January 2025
