import {
  createOrderObjBluePrint,
  razorPayOrderObjBlueprint,
} from '../constants/objects';
import store from '../store';
import {
  offerPerentageCalculation,
  orderTotal,
  taxCalculation,
  WalletCheckTotal,
} from './calc';
import {invoiceObjType} from './productType';

export const invoiceObjCreator = (deliveryCharge: any) => {
  try {
    const CouponState = store.getState().user.coupon;
    const OnlyTotalState = store.getState().user.totalonly;
    const OrderCouponOfferState = store.getState().user.order_Count_offer;
    const DeliveryTypeState = store.getState().user.delivery_type;
    const WalletState: number = store.getState().user.wallet_amount;

    let invoiceObj: invoiceObjType = Object.seal({
      product_total: OnlyTotalState,
      coupon_id: 0,
      coupon_discount: 0,
      coupon_code: '',
      coupon_type: null,
      delivery_charge: 0,
      packing_charge: 0,
      sunday_peak_charge: 0,
      Full_Total: 0,
      CGST: 0,
      SGST: 0,
      FullTaxAmount: 0,
      CGST_percentage: 0,
      SGST_percentage: 0,
      wallet: 0,
      actual_delivery_charge: 0,
      membership_applied: 0,
      offer_name: '',
      offer_percentage: 0,
      check_Full_Total: 0,
    });
    if (WalletState > 0) {
      invoiceObj.wallet = WalletState;
    }
    if (CouponState || OrderCouponOfferState) {
      if (CouponState) {
        invoiceObj.coupon_id = CouponState.coupon_id;
        invoiceObj.coupon_discount = CouponState.applied_amount;
        invoiceObj.coupon_code = CouponState.code;
        invoiceObj.coupon_type = CouponState.coupon_type;
      } else if (OrderCouponOfferState) {
        invoiceObj.coupon_id = 0;
        invoiceObj.coupon_discount = OrderCouponOfferState.applied_amount;
        invoiceObj.coupon_code = OrderCouponOfferState.code;
      }
    } else {
      invoiceObj.coupon_id = 0;
      invoiceObj.coupon_discount = 0;
      invoiceObj.coupon_code = '';
      invoiceObj.coupon_type = '';
    }
    if (deliveryCharge.status === true) {
      invoiceObj.delivery_charge = deliveryCharge.delivery_charge;
      invoiceObj.packing_charge = deliveryCharge.packing_charge;
      invoiceObj.sunday_peak_charge = deliveryCharge.peak_charge;
      invoiceObj.actual_delivery_charge = deliveryCharge.actual_delivery_charge;
      invoiceObj.membership_applied = deliveryCharge.membership_applied;
    } else {
      invoiceObj.delivery_charge = 0;
      invoiceObj.packing_charge = 0;
      invoiceObj.sunday_peak_charge = 0;
      invoiceObj.actual_delivery_charge = 0;
      invoiceObj.membership_applied = 0;
    }

    if ((deliveryCharge.cgst && deliveryCharge.sgst) > 0) {
      const CGSTAmount = taxCalculation(OnlyTotalState, deliveryCharge.cgst);
      const SGSTAmount = taxCalculation(OnlyTotalState, deliveryCharge.sgst);
      invoiceObj.CGST = CGSTAmount;
      invoiceObj.SGST = SGSTAmount;
      invoiceObj.FullTaxAmount = Math.round(CGSTAmount + SGSTAmount);
      invoiceObj.CGST_percentage = deliveryCharge.cgst;
      invoiceObj.SGST_percentage = deliveryCharge.sgst;
    } else {
      invoiceObj.CGST = 0;
      invoiceObj.SGST = 0;
      invoiceObj.FullTaxAmount = 0;
      invoiceObj.CGST_percentage = 0;
      invoiceObj.SGST_percentage = 0;
    }

    const order_total = orderTotal(invoiceObj);
    const check_Full_Total = WalletCheckTotal(invoiceObj);

    invoiceObj.Full_Total = order_total;
    invoiceObj.check_Full_Total = check_Full_Total;
    return invoiceObj;
  } catch (err) {
    return false;
  }
};

export const OrderObjCreator = () => {
  try {
    const CartState = store.getState().user.cart;
    const UserState = store.getState().user.userInfo;
    const OnlyTotalState = store.getState().user.totalonly;
    const CookingInstrctionState = store.getState().user.cooking_instruction;
    const FastDeliveryState = store.getState().user.fast_delivery;

    const DeliveryInstructionState = store.getState().user.delivery_instruction;
    let items = CartState.map((item: any) => {
      return {
        quantity: item.quantity,
        product_id: item.product_id,
        variation_id: item.product_price.product_price_id,
      };
    });

    const AddressID = store.getState().user?.selected_address?.user_address_id;
    const LoginId = store.getState().app?.check_branch?.branch_id;
    const InvoiceState = store.getState().user.invoice;

    const DeliveryTypeState = store.getState().user.delivery_type;
    let DateSlotState = store.getState().user.save_date;
    let WalletState = store.getState().user.wallet_amount;

    let TimeSlotState = store.getState().user.save_timeSlot;

    const createOrderObj = createOrderObjBluePrint();

    createOrderObj.address_id = AddressID;
    createOrderObj.login_id = LoginId || 0;
    createOrderObj.cooking_instruction = CookingInstrctionState;
    createOrderObj.delivery_instruction = DeliveryInstructionState;
    createOrderObj.service_type = FastDeliveryState;

    createOrderObj.coupon_applied = InvoiceState?.coupon_discount || 0;
    createOrderObj.coupon_code_id = InvoiceState?.coupon_id || 0;
    createOrderObj.coupon_type = InvoiceState?.coupon_type;
    createOrderObj.coupon_code = InvoiceState.coupon_code;

    createOrderObj.delivery_charge = InvoiceState?.delivery_charge || 0;
    createOrderObj.instruction = '';
    createOrderObj.message = '';
    createOrderObj.packing_charge = InvoiceState?.packing_charge || 0;
    createOrderObj.peak_amount = InvoiceState?.sunday_peak_charge || 0;
    createOrderObj.variation = items;
    createOrderObj.recipe_total_amount = OnlyTotalState;
    createOrderObj.actual_delivery_charges =
      InvoiceState?.actual_delivery_charge;
    createOrderObj.membership_status = UserState?.membership ? 1 : 0;

    (createOrderObj.delivery_type = 0),
      (createOrderObj.delivery_time = TimeSlotState?.slot),
      (createOrderObj.delivery_date = DateSlotState);
    createOrderObj.payment_amount = InvoiceState?.check_Full_Total;
    createOrderObj.wallet_amount = WalletState || 0;
    (createOrderObj.tax_amount = InvoiceState?.FullTaxAmount || 0),
      (createOrderObj.cgst = InvoiceState?.CGST || 0),
      (createOrderObj.sgst = InvoiceState?.SGST || 0),
      (createOrderObj.total_amount = InvoiceState?.Full_Total),
      (createOrderObj.from = 1);

    return createOrderObj;
    //For android= 0, IOS =1, web=2
  } catch (err) {
    return false;
  }
};

export const razorPayObjCreator = (
  apiKey: string,
  total: number,
  rzorderId: string,
  orderString: any,
) => {

  try {
    const UserInfo = store.getState().user.userInfo;
    // const InvoiceState: invoiceObjType = store.getState().user.invoice;

    const rzorder = razorPayOrderObjBlueprint();
    rzorder.key = apiKey;
    rzorder.rider_id = rzorderId;
    // if (total) {
    rzorder.amount = total * 100;
    // } else {
    // rzorder.amount = InvoiceState?.order_total * 100;
    // }
    rzorder.notes = {order_id: orderString};
    rzorder.description = `iLo Captain - ${UserInfo?.driver_name} Order Id ` + orderString;
    // rzorder.notes = "Test";
    rzorder.prefill.email = UserInfo?.driver_email;
    rzorder.prefill.contact = UserInfo?.driver_phone_number;
    rzorder.prefill.name = UserInfo?.driver_name;
    return rzorder;
  } catch (err) {
    console.log("rzordererr",err)
    return false;
  }
};
