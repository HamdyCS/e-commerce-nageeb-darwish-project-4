import axios from "axios";
import { API_URL } from "./Apis";
import { getFromCookie } from "../services/cookieService";

const token = getFromCookie("BearerToken") || "";

const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default Axios;
