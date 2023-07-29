import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer, persistStore } from 'redux-persist';

const initialState = {
  name: '',
  role: '',
};

const initialJwt = () => {
  const jwt = window.localStorage.getItem('jwt');
  return jwt ? JSON.parse(jwt) : null;
};

const initialUsers = () => {
  const item = window.localStorage.getItem('user');
  return item
    ? JSON.parse(item)
    : {
        id: uuidv4(),
        name: 'dashcode',
        email: 'dashcode@gmail.com',
        password: 'Dashcode123',
        type: 'signee',
      };
};

// save users in local storage

const initialIsAuth = () => {
  const item = window.localStorage.getItem('isAuth');
  return item ? JSON.parse(item) : false;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUsers(),
    isAuth: initialIsAuth(),
    jwt: initialJwt(),
  },
  reducers: {
    handleRegister: (state, action) => {
      const {
        name = 'no name found',
        email,
        password,
        type = 'signee',
      } = action.payload;
      const user = state.user.email == email;

      if (user) {
        toast.error('User already exists', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        state.user = {
          id: uuidv4(),
          name,
          email,
          password,
          type,
        };
        window.localStorage.setItem('user', JSON.stringify(state.user));
        toast.success('User registered successfully', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    },
    handleLogin: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user;
      // save isAuth in local storage
      console.log('my user information is in store', action.payload);
      window.localStorage.setItem('isAuth', JSON.stringify(state.isAuth));
      window.localStorage.setItem('user', JSON.stringify(state.user));
      if (state.user?.status !== 'REQUESTED_VERIFICATION') {
        toast.success('User logged in successfully', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    },
    setJwtToken: (state, action) => {
      state.jwt = action.payload.jwt;
      window.localStorage.setItem('jwt', JSON.stringify(state.jwt));
    },
    handleLogout: (state, action) => {
      state.isAuth = action.payload;
      window.localStorage.removeItem('jwt');
      // remove isAuth from local storage
      window.localStorage.removeItem('isAuth');
      window.localStorage.removeItem('user');
      toast.success('User logged out successfully', {
        position: 'top-right',
      });
    },
  },
});

export const detailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DETAILS':
      return {
        ...state,
        name: action.payload.name,
        role: action.payload.role,
      };
    default:
      return state;
  }
};
export const { handleRegister, handleLogin, handleLogout, setJwtToken } =
  authSlice.actions;
export default authSlice.reducer;
