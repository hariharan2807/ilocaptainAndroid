import store from '../store';

export const taxCalculation = (product_total: number, percentage: number) => {
  let amount = 0;
  amount = product_total * (percentage / 100);
  // return Math.round(amount);
  return amount;
};

export const calcProductTotal = () => {
  const CartState = store.getState().user.cart;
  let total = 0;
  for (let item of CartState) {
    total +=
      parseInt(item.quantity) * parseInt(item.product_price.product_price);
  }
  return total;
};

export const orderTotal = (invoiceObj: any) => {
  let total = 0;

  total +=
    invoiceObj?.product_total +
    invoiceObj?.delivery_charge +
    invoiceObj?.packing_charge +
    Math.round(invoiceObj?.CGST + invoiceObj?.SGST) +
    invoiceObj?.sunday_peak_charge;
  invoiceObj?.coupon_type === 0 ? (total -= invoiceObj?.coupon_discount) : null;
  invoiceObj?.coupon_type === 2 ? (total -= invoiceObj?.coupon_discount) : null;
  total -= invoiceObj?.offer_percentage;
  return total;
};

export const WalletCheckTotal = (invoiceObj: any) => {
  let total = 0;
  total +=
    invoiceObj?.product_total +
    invoiceObj?.delivery_charge +
    invoiceObj?.packing_charge +
    Math.round(invoiceObj?.CGST + invoiceObj?.SGST) +
    invoiceObj?.sunday_peak_charge;
  invoiceObj?.coupon_type === 0 ? (total -= invoiceObj?.coupon_discount) : null;
  invoiceObj?.coupon_type === 2 ? (total -= invoiceObj?.coupon_discount) : null;
  total -= invoiceObj?.offer_percentage;
  total -= invoiceObj?.wallet;
  return total;
};

export const offerPerentageCalculation = (
  product_total: any,
  offer_percentage: number,
) => {
  let offer_amount = Math.round(
    (product_total * parseInt(offer_percentage)) / 100,
  );
  return offer_amount;
};
