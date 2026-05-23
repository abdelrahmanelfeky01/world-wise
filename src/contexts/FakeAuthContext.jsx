import {
  createContext,
  useContext,
  useReducer,
} from 'react';
import Message from '../components/Message';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'logout':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'error':
      return { ...state, error: action.payload };

    default:
      throw new Error('Unknown action');
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] =
    useReducer(reducer, initialState);

  function login(email, password) {
    if (
      email === FAKE_USER.email &&
      password === FAKE_USER.password
    )
      dispatch({ type: 'login', payload: FAKE_USER });

    if (
      email !== FAKE_USER.email &&
      password === FAKE_USER.password
    )
      dispatch({
        type: 'error',
        payload: 'Email is wrong but Password is correct!',
      });

    if (
      email === FAKE_USER.email &&
      password !== FAKE_USER.password
    )
      dispatch({
        type: 'error',
        payload: 'Password is wrong but Email is correct!',
      });

    if (
      email !== FAKE_USER.email &&
      password !== FAKE_USER.password
    )
      dispatch({
        type: 'error',
        payload: 'Email and Password are wrong!',
      });
  }
  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      'AuthContext was used outside AuthProvider'
    );
  return context;
}

export { AuthProvider, useAuth };
