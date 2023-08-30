import { createSlice } from '@reduxjs/toolkit';
const initialState = { value: { username: '', points: 0 } };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = initialState;
    },
    incrementPoints: (state) => {
      state.value.points += 1;
    },
    decrementPoints: (state) => {
      state.value.points -= 1;
    },
  },
});

export const { setUser, clearUser, incrementPoints, decrementPoints } =
  userSlice.actions;

export default userSlice.reducer;
