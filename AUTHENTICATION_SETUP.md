# Authentication System Setup

## Backend Setup

### 1. Install Dependencies
The authentication system requires the following packages:
- `bcrypt` - for password hashing
- `jsonwebtoken` - for JWT token generation
- `cookie-parser` - for parsing HTTP-only cookies

These have been installed automatically.

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# JWT Secrets (change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

# Database
DATABASE_URL=sqlite:./database.sqlite

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Other existing environment variables...
ACCESS_CODE=tweetmaster2025
```

### 3. Database Migration
The users table will be created automatically when you start the server. The User model includes:
- `id` (auto-increment primary key)
- `name` (required, 2-50 characters)
- `email` (required, unique, validated as email)
- `password` (required, 6-100 characters, hashed with bcrypt)
- `createdAt` and `updatedAt` timestamps

## Frontend Setup

### 1. Authentication Components
The following components have been created:
- `Auth.jsx` - Login and signup forms
- `ProtectedRoute.jsx` - Wrapper for protected routes
- `Dashboard.jsx` - Example protected page

### 2. Features Implemented

#### Backend Features:
✅ **User Management**
- User signup with name, email, and password
- User login with email and password
- Password hashing with bcrypt (12 salt rounds)
- Email validation and uniqueness checks

✅ **Token System**
- Access tokens (15 minutes expiry)
- Refresh tokens (7 days expiry)
- HTTP-only cookies for secure storage
- Automatic token refresh endpoint

✅ **Security Features**
- HTTP-only cookies prevent XSS attacks
- Secure flag in production
- SameSite: Strict for CSRF protection
- Password hashing with bcrypt

✅ **Protected Routes**
- Express middleware for route protection
- User context available in `req.user`
- Automatic token verification

#### Frontend Features:
✅ **Authentication UI**
- Clean login/signup forms
- Form validation and error handling
- Loading states and user feedback

✅ **Protected Routes**
- Automatic authentication checks
- Redirect to login if not authenticated
- User session management

✅ **Auto-refresh System**
- Automatic token refresh on API calls
- Seamless user experience
- Logout functionality

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
- **Body**: `{ name, email, password }`
- **Response**: User data and tokens in cookies
- **Status**: 201 (created) or 400/409 (error)

#### POST `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User data and tokens in cookies
- **Status**: 200 (success) or 401 (error)

#### POST `/api/auth/logout`
- **Response**: Clears authentication cookies
- **Status**: 200 (success)

#### GET `/api/auth/me`
- **Headers**: Requires authentication
- **Response**: Current user data
- **Status**: 200 (success) or 401 (unauthorized)

#### POST `/api/auth/refresh`
- **Headers**: Requires refresh token in cookie
- **Response**: New access and refresh tokens
- **Status**: 200 (success) or 401 (unauthorized)

## Usage Examples

### Protecting Backend Routes
```javascript
const { authenticateToken } = require('./utils/auth');

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});
```

### Frontend Protected Routes
```javascript
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute>
      <YourProtectedComponent />
    </ProtectedRoute>
  );
}
```

### Making Authenticated API Calls
```javascript
// Frontend API call with credentials
const response = await fetch('/api/protected-route', {
  credentials: 'include' // Important for cookies
});
```

## Security Best Practices

1. **Change JWT secrets** in production
2. **Use HTTPS** in production (secure cookies)
3. **Set appropriate CORS** origins
4. **Validate all inputs** on both frontend and backend
5. **Rate limiting** for auth endpoints (recommended)
6. **Password complexity** requirements (can be added)

## Testing the System

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`
3. Visit `http://localhost:3000`
4. Try signing up with a new account
5. Try logging in with existing credentials
6. Test the logout functionality
7. Verify protected routes work correctly

The authentication system is now fully integrated and ready to use! 