import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { authHeader } from "../../api/axios";
import API_ROUTES from "../../api/api_route";

const initialState = {
  messages: {},
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
      const { userId, messages } = action.payload;
      state.messages[userId] = messages;
    },

    addMessage: (state, action) => {
      const { message, userId } = action.payload;
      if (!state.messages[userId]) state.messages[userId] = [];
      if (!state.messages[userId].find((m) => m._id === message._id)) {
        state.messages[userId] = [...state.messages[userId], message];
      }
    },

    resetMessages: (state) => {
      state.messages = {};
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      const userId = action.meta.arg.userId;
      const existing = state.messages[userId] || [];

      const newMessages = Array.isArray(action.payload?.data)
        ? action.payload.data.filter(
            (m) => !existing.find((e) => e._id === m._id)
          )
        : [];

      state.messages[userId] = [...existing, ...newMessages];
    });
  },
});

export const { setMessages, addMessage, resetMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
