export interface UserLoginResponse {
  message: string;
  token:   string;
  user:    User;
}

export interface User {
  avatar:   string;
  fullname: string;
  id:       number;
  username: string;
}