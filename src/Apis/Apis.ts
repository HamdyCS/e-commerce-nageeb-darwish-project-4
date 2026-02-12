// auth
export const API_URL = "http://127.0.0.1:8000/api";
export const GOOGLE_AUTH_CALLBACK = "auth/google/callback";
export const GET_AUTH_USER = "user";

//users
export const ALL_USERS = "users";
export const COUNT_USERS = "users/count";
export const SEARCH_USERS = "user/search";
export const ADD_USER = "user/add";
export const LOGOUT = "logout";
export const DELETE_USER = (id: number) => `user/${id}`;
export const GET_USER = (id: number) => `user/${id}`;
export const UPDATE_USER = (id: number) => `user/edit/${id}`;

//categories
export const CATEGORIES = "categories";
export const COUNT_CATEGORIES = "categories/count";
export const SEARCH_CATEGORIES = "category/search";
export const GET_CATEGORY = (id: number) => `category/${id}`;
export const ADD_CATEGORY = "category/add";
export const DELETE_CATEGORY = (id: number) => `category/${id}`;
export const UPDATE_CATEGORY = (id: number) => `category/edit/${id}`;

//products
export const PRODUCTS = "products";
export const COUNT_PRODUCTS = "products/count";
export const SEARCH_PRODUCTS = "product/search";
export const GET_PRODUCT = (id: number) => `product/${id}`;
export const ADD_PRODUCT = "product/add";
export const DELETE_PRODUCT = (id: number) => `product/${id}`;
export const UPDATE_PRODUCT = (id: number) => `product/edit/${id}`;
export const LATEST_SALE_PRODUCTS = "latest-sale";
export const TOP_RATING_PRODUCTS = "top-rated";
export const LATEST_PRODUCTS = "latest";

//product images
export const ADD_PRODUCT_IMAGE = "product-img/add";
export const DELETE_PRODUCT_IMAGE = (id: number) => `product-img/${id}`;
