# Frontend Modular Structure

This document outlines the modular structure of the TweetGenie frontend application.

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── pages/             # Page components
├── routes/            # Route configurations
├── services/          # API services
└── utils/             # Utility functions and constants
```

## 🏗️ Architecture Overview

### **Contexts** (`/contexts`)
- **AuthContext**: Manages authentication state globally
  - User authentication status
  - Current view state (landing, login, signup, etc.)
  - OTP management
  - Authentication methods (login, logout, etc.)

### **Components** (`/components`)
- **UI Components**: Reusable UI elements
  - `LoadingSpinner`: Loading indicator
  - `Navbar`: Navigation bar with auth state
  - `Login`, `Signup`, `OTPVerification`: Auth components
  - `LandingPage`: Home page for unauthenticated users

### **Pages** (`/pages`)
- **Route Components**: Page-level components
  - `HomePage`: Handles landing page and auth views
  - `DashboardPage`: Protected dashboard
  - `ProfilePage`: User profile page

### **Layouts** (`/layouts`)
- **Layout Components**: Page structure
  - `MainLayout`: Main layout with navbar and toaster

### **Routes** (`/routes`)
- **Route Configuration**: Centralized routing
  - `AppRoutes`: Main route definitions

### **Services** (`/services`)
- **API Services**: Centralized API calls
  - `api.js`: Axios instance and API methods
  - `authAPI`: Authentication-related API calls

### **Hooks** (`/hooks`)
- **Custom Hooks**: Reusable logic
  - `useAPI`: API call management with loading/error states

### **Utils** (`/utils`)
- **Constants and Utilities**: Shared values
  - `constants.js`: Application constants (routes, auth views, etc.)

## 🔄 Data Flow

1. **Authentication Flow**:
   ```
   AuthContext → API Service → Backend → State Update → UI Update
   ```

2. **Component Hierarchy**:
   ```
   App → AuthProvider → MainLayout → AppRoutes → Pages → Components
   ```

## 🎯 Key Features

### **State Management**
- Centralized authentication state via Context API
- Local component state for UI interactions
- API state management with custom hooks

### **Routing**
- Protected routes with automatic redirects
- Dynamic navigation based on auth state
- Clean URL structure

### **API Integration**
- Centralized API service with axios
- Consistent error handling
- Request/response interceptors

### **Component Reusability**
- Modular component structure
- Consistent styling with Tailwind CSS
- Shared utilities and constants

## 🚀 Usage Examples

### **Using Auth Context**
```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, handleLogin } = useAuth();
  // ...
};
```

### **Using API Service**
```jsx
import { authAPI } from '../services/api';

const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### **Using Custom Hook**
```jsx
import { useAPI } from '../hooks/useAPI';

const MyComponent = () => {
  const { loading, error, executeAPI } = useAPI();
  
  const handleSubmit = async () => {
    await executeAPI(() => authAPI.login(credentials), 'Login successful!');
  };
};
```

## 🔧 Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Easy to add new features
3. **Reusability**: Components and hooks can be reused
4. **Testability**: Isolated components are easier to test
5. **Performance**: Optimized re-renders with Context
6. **Developer Experience**: Clear structure and documentation

## 📝 Best Practices

1. **Use Context for Global State**: Authentication, theme, etc.
2. **Keep Components Small**: Single responsibility principle
3. **Use Custom Hooks**: For reusable logic
4. **Centralize API Calls**: Use service layer
5. **Use Constants**: Avoid magic strings
6. **Handle Loading States**: Provide good UX
7. **Error Boundaries**: Catch and handle errors gracefully 