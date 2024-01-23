import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Your Node.js API base URL
});

export default api;
