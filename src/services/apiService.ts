import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "../config";

function getAuthConfig(token?: string) {
  if (!token) return undefined;

  //if no token, no config
  const config: AxiosRequestConfig | undefined = !token
    ? undefined
    : {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

  return config;
}

//get
export async function getAsync<T>(path: string, token?: string) {
  const config = getAuthConfig(token);

  const response = await axios.get<T>(`${API_URL}${path}`, config);
  console.log(response);

  return response.data;
}

//post
export async function postAsync<T>(path: string, data: any, token?: string) {
  const config = getAuthConfig(token);

  const response = await axios.post<T>(`${API_URL}${path}`, data, config);
  console.log(response);

  return response.data;
}

//put
export async function putAsync<T>(path: string, data: any, token?: string) {
  const config = getAuthConfig(token);

  const response = await axios.put<T>(`${API_URL}${path}`, data, config);
  console.log(response);

  return response.data;
}

//delete
export async function deleteAsync<T>(path: string, token?: string) {
  const config = getAuthConfig(token);

  const response = await axios.delete<T>(`${API_URL}${path}`, config);
  console.log(response);

  return response.data;
}
