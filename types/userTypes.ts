export interface ShopType {
  shop_id: number;
  shop_name: string;
  shop_image: string;
  shop_address: string;
  shop_distance: string;
  shop_location: string;
}

// Will be Deprecated
export interface UserAddressType {
  user_address_id: number;
  user_address_name: string;
  user_address_landmark: string;
  user_address_details: string;
  user_address_latitude: string;
  user_address_longitude: string;
}

export interface UserAddressShape {
  user_address_id: number;
  user_address_name: string;
  user_address_landmark: string;
  user_address_details: string;
  user_address_latitude: string;
  user_address_longitude: string;
}
