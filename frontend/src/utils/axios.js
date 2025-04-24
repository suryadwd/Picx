import axios from "axios";

const instance = axios.create({
  baseURL: "https://picx-kzg6.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
