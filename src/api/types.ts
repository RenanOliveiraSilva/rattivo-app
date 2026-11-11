export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface UserView {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserView;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

