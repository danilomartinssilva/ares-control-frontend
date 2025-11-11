export interface UsersResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface UserCreatePayloadRequest {
  email: string;
  name: string;
  phone: string;
  password: string;
}
