export const Api_Url = "http://127.0.0.1:8000/api";
export const Google_Auth_Callback = "auth/google/callback";
export const Get_Current_User = "user";
export const All_Users = "users";
export const Delete_User = (id: string) => `user/${id}`;
export const Get_User = (id: string) => `user/${id}`;
export const Update_User = (id: string) => `user/edit/${id}`;
