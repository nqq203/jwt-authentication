import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
    isLogin: false,
  },
  reducers: {
    setIsLogin: (state, {payload}) => {
      state.isLogin = payload;
    },
    setUser: (state, {payload}) => {
      state.user = {...payload};
    }
  },
});

export const { setIsLogin, setUser } = authSlice.actions;
export default authSlice.reducer;