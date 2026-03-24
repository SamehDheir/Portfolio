export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}