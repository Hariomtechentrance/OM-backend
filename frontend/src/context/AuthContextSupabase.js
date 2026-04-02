import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabaseHelpers } from '../config/supabase';

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const LOAD_USER = 'LOAD_USER';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case LOAD_USER:
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_FAIL:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from Supabase on mount
  useEffect(() => {
    loadUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabaseHelpers.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          dispatch({
            type: AUTH_SUCCESS,
            payload: { user: session.user }
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load current user
  const loadUser = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const { user } = await supabaseHelpers.auth.getCurrentUser();
      
      if (user) {
        dispatch({
          type: AUTH_SUCCESS,
          payload: { user }
        });
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
    }
  };

  // Register user
  const register = async (email, password, name) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      dispatch({ type: CLEAR_ERROR });

      const { data, error } = await supabaseHelpers.auth.signUp(email, password, {
        name,
        role: 'user'
      });

      if (error) {
        dispatch({
          type: AUTH_FAIL,
          payload: error.message
        });
        return { success: false, error: error.message };
      }

      // Create user profile in database
      if (data.user) {
        // You might want to create a user profile table
        console.log('User registered:', data.user);
      }

      return { success: true, data };
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      dispatch({ type: CLEAR_ERROR });

      const { data, error } = await supabaseHelpers.auth.signIn(email, password);

      if (error) {
        dispatch({
          type: AUTH_FAIL,
          payload: error.message
        });
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await supabaseHelpers.auth.signOut();
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
