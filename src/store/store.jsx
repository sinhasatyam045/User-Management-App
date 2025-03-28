import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
  auth: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  users: {
    data: [],
    status: 'idle',
    error: null,
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // 🔥 Authentication Reducers
    loginSuccess: (state, action) => {
      state.auth.token = action.payload;
      state.auth.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.auth.token = null;
      state.auth.isAuthenticated = false;
      localStorage.removeItem('token');
    },

    // 🔥 CRUD Reducers for User Management
    setUsers: (state, action) => {
      state.users.data = action.payload;
      state.users.status = 'idle';
    },
    addUser: (state, action) => {
      state.users.data.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.data.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users.data[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users.data = state.users.data.filter((user) => user.id !== action.payload);
    }
  }
});

// ✅ Export Actions
export const {
  loginSuccess,
  logout,
  setUsers,
  addUser,
  updateUser,
  deleteUser
} = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer
});

export default store;
