export interface AddressCreatePayloadRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
  alias?: string;
  defaultAddress?: boolean;
}

export interface AddressResponse {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
  alias?: string;
  defaultAddress?: boolean;
}

export interface AddressUpdatePayloadRequest {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  alias?: string;
  defaultAddress?: boolean;
}
