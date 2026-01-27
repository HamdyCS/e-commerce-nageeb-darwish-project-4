// auth
export const API_URL = "http://127.0.0.1:8000/api";
export const GOOGLE_AUTH_CALLBACK = "auth/google/callback";
export const GET_AUTH_USER = "user";

//users
export const ALL_USERS = "users";
export const ADD_USER = "user/add";
export const LOGOUT = "logout";
export const DELETE_USER = (id: number) => `user/${id}`;
export const GET_USER = (id: number) => `user/${id}`;
export const UPDATE_USER = (id: number) => `user/edit/${id}`;

//categories
export const CATEGORIES = "categories";
export const GET_CATEGORY = (id: number) => `category/${id}`;
export const ADD_CATEGORY = "category/add";
export const DELETE_CATEGORY = (id: number) => `category/${id}`;
export const UPDATE_CATEGORY = (id: number) => `category/edit/${id}`;
