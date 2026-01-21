import axios from "axios";
import { Api_Url } from "./Apis";
import { getFromCookie } from "../services/cookieService";

const token = getFromCookie("BearerToken") || "";

const Axios = axios.create({
  baseURL: Api_Url,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default Axios;
