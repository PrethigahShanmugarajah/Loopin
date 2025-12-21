// Client / src / features / connections / connectionsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { authHeader } from "../../api/axios";
import API_ROUTES from "../../api/api_route";

const initialState = {
  connections: [],
  pendingConnections: [],
  followers: [],
  following: [],
};

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (token) => {
    const { data } = await api.get(
      API_ROUTES.USER.GET_USER_CONNECTIONS,
      authHeader(token)
    );
    return data.success ? data : null;
  }
);

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConnections.fulfilled, (state, action) => {
      if (action.payload) {
        state.connections = action.payload.connections;
        state.pendingConnections = action.payload.pendingConnections;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
      }
    });
  },
});

export default connectionsSlice.reducer;
