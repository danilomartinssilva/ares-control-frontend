export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface UsersResponse {
  id: string;
  email: string;
  name: string;
  address: Address[];
}
