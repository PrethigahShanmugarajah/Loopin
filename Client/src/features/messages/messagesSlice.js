// Client / src / features / messages / messagesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { authHeader } from "../../api/axios";
import API_ROUTES from "../../api/api_route";

const initialState = {
  messages: [],
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ token, userId }) => {
    const { data } = await api.post(
      API_ROUTES.MESSAGE.GET_CHAT_MESSAGES,
      { to_user_id: userId },
      authHeader(token)
    );
    return data.success ? data : null;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      if (!Array.isArray(state.messages)) state.messages = [];
      state.messages = [...state.messages, action.payload];
    },

    resetMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload && Array.isArray(action.payload.messages)) {
        state.messages = action.payload.messages;
      } else {
        state.messages = [];
      }
    });
  },
});

export const { setMessages, addMessage, resetMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
