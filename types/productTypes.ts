export interface ProductsType {
  product_id: string;
  shop_id: string;
  category_id: number;
  product_name: string;
  description: string;
  status: boolean;
  image: string;
  variations: [];
  addons: [];
  veg: boolean;
  product_message: string;
  recommended: boolean;
  customization: boolean;
  restaurant_status: boolean;
  increment(payload: addToCartType): any;
  decrement(uuid: string): any;
  type: number;
  preorder_id: number;
  product_disable: number;
  no_bottom: boolean;
}

export interface addToCartType {
  uuid: string;
  id: string;
  variation_id: any;
  product_name: string;
  price: string;
  selected_variation: any;
  selected_addons: any;
  addons: any;
  variations: any;
  customisable: boolean;
}
