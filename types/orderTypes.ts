export interface PickupShopShape {
  shop_id: string;
  shop_name: string;
  shop_image: string;
  shop_status: boolean;
}

export interface DeliveryAddressShape {
  user_address_id: string;
  user_address_name: string;
  user_address_details: string;
  user_address_landmark: string;
  user_address_latitude: string;
  user_address_longitude: string;
}

export interface cartType {
  uuid: string;
  id: string;
  variation_id: string;
  product_name: string;
  price: number;
  selected_variation: variationShape;
  selected_addons: Array<addOnType>;
  addons: Array<addOnType>;
  variations: Array<variationShape>;
  customizable: boolean;
  isCombo: boolean;
  quantity: number;
}
export interface variationShape {
  product_variation_id: string;
  product_variation_name: string;
  product_variation_unit_name: string;
  product_price: string;
}

export interface addOnType {
  addon_id: number;
  addon_name: string;
  addon_price: number;
}

export interface couponShape {
  coupon_id: number;
  code: string;
  max: number;
  min: number;
  applied_amount: number;
  offer_type: number;
}

export interface tipType {
  tip: number;
}

export interface serviceChargeType {
  packing_charge: number;
  delivery_charge: number;
  tax_amount: number;
  min_order: number;
  minimum_order: number;
  peak_charge: number;
  peak_commend: string;
  surge_charge: number;
  surge_commend: string;
  status: boolean;
}

export interface invoiceObjType {
  product_total: number;
  delivery_charge: number;
  tip_amount: number;
  coupon_id: number;
  coupon_discount: number;
  packing_charge: number;
  peak_charge: number;
  wallet: number;
  tax_amount: number;
  tax_percentage: number;
  order_total: number;
  min_order: number;
  delivery_available: boolean;
  peak_charge_reason: string;
  wallet_check_total: number;
  singeGst: number;
  singleGSTTotal: number;
  surge_charge: number;
  surge_commend: string;
  actual_cgst: number;
  actual_sgst: number;
}

export interface OrdersBoxShape {
  order_string: string;
  booking_date: string;
  order_date: string;
  order_id: number;
  order_status: number;
  payment_mode_name: string;
  rate: object;
  order_type: number;
  delivery_type: number;
  order_time: any;
  orders: any;
  // rating_status:object;
}
