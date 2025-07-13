import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
  
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Verify token is still valid
        await verifyToken(storedToken);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        // Update state
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed',
          errors: data.errors 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name, profile = null) => {
    try {
      setIsLoading(true);
      
      const requestBody = { email, password, name };
      if (profile) {
        requestBody.profile = profile;
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        // Update state
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: data.message || 'Registration failed',
          errors: data.errors 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.data.user;
        
        // Update localStorage
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        return { 
          success: false, 
          message: data.message || 'Profile update failed',
          errors: data.errors 
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
