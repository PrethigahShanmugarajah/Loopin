// Client / src / features / user / userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { authHeader } from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import toast from "react-hot-toast";

const initialState = {
  value: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  const { data } = await api.get(
    API_ROUTES.USER.GET_USER_DATA,
    authHeader(token)
  );
  return data.success ? data.user : null;
});

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData, token }) => {
    const { data } = await api.post(
      API_ROUTES.USER.UPDATE_USER_DATA,
      userData,
      authHeader(token)
    );

    if (data.success) {
      toast.success(data.message);
      return data.user;
    } else {
      toast.error(error?.response?.data?.message || error?.message);
      return null;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;
