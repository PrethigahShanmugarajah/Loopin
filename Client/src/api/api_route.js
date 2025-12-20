// Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  USER: {
    GET_USER_DATA: `${BASE_URL}/api/user/data`,
    UPDATE_USER_DATA: `${BASE_URL}/api/user/update`,
    GET_USER_PROFILE: `${BASE_URL}/api/user/profile`,
    DISCOVER_USERS: `${BASE_URL}/api/user/discover`,
    FOLLOW_USER: `${BASE_URL}/api/user/follow`,
    UNFOLLOW_USER: `${BASE_URL}/api/user/unfollow`,
    SEND_CONNECTION_REQUEST: `${BASE_URL}/api/user/connect`,
    ACCEPT_CONNECTION_REQUEST: `${BASE_URL}/api/user/accept`,
    GET_USER_CONNECTIONS: `${BASE_URL}/api/user/connections`,
    GET_USER_RECENT_MESSAGES: `${BASE_URL}/api/user/recent-messages`,
  },

  POST: {
    ADD_POST: `${BASE_URL}/api/post/add`,
    GET_FEED_POSTS: `${BASE_URL}/api/post/feed`,
    LIKE_POST: `${BASE_URL}/api/post/like`,
  },

  STORY: {
    ADD_USER_STORY: `${BASE_URL}/api/story/create`,
    GET_STORIES: `${BASE_URL}/api/story/get`,
  },

  MESSAGE: {
    GET_MESSAGES: (userId) => `${BASE_URL}/api/message/${userId}`,
    SEND_MESSAGE: `${BASE_URL}/api/message/send`,
    GET_CHAT_MESSAGES: `${BASE_URL}/api/message/get`,
  },
};

export default API_ROUTES;
