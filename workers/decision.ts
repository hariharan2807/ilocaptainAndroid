import {format} from 'date-fns';
import {getCheckBranchRemote} from '../remote/serviceRemote';
import {CheckDeliveryAddressRemote} from '../remote/orderPlacementRemote';
import store from '../store';

export const canApplyCoupon = (coupon: any, ProductTotal: number) => {
  let UserState = store.getState().user.userInfo;
  try {
    if (UserState) {
      if (coupon.coupon_type === 1) {
        if (parseInt(coupon.minimum_ordering_amount) <= ProductTotal) {
          return {
            status: true,
            minus_amount: coupon.flat_amount,
          };
        } else {
          throw 'Insufficiant Order Amount';
        }
      } else if (coupon.coupon_type === 2) {
        //Offer COupon
        if (parseInt(coupon.minimum_ordering_amount) <= ProductTotal) {
          return {
            status: true,
            minus_amount: coupon.gift_amount,
          };
        } else {
          throw 'Insufficiant Order Amount';
        }
      } else {
        if (parseInt(coupon.minimum_ordering_amount) <= ProductTotal) {
          let offer_amount = Math.round(
            (ProductTotal * parseInt(coupon.offer_percentage)) / 100,
          );
          if (offer_amount > parseInt(coupon.maximum_discount_amount)) {
            return {
              status: true,
              minus_amount: parseInt(coupon.maximum_discount_amount),
            };
          } else {
            return {
              status: true,
              minus_amount: offer_amount,
            };
          }
        } else {
          throw 'Insufficiant Order Amount';
        }
      }
    } else {
      throw 'Please Login';
    }
  } catch (err) {
    return {
      status: false,
      message: typeof err === 'string' ? err : 'failed to apply coupon',
    };
  }
};

export const navigationFromCartScreen = async () => {
  try {
    let UserState = store.getState().user.userInfo;
    let CartState = store.getState().user.cart;
    let CheckBranchState = store.getState().app.check_branch;
    let SelectedAddressState = store.getState().user.selected_address;
    let InvoiceState = store.getState().user.invoice;
    let AppControlState = store.getState().app.appcontrol;
    let DeliveryTypeState = store.getState().user.delivery_type;

    let DateSlotState = store.getState().user.save_date;
    let FastDeliveryState = store.getState().user.fast_delivery;

    let TimeSlotState = store.getState().user.save_timeSlot;

    const time = format(new Date(), 'HH:mm:ss');

    let checkDelivery = await CheckDeliveryAddressRemote({
      login_id: CheckBranchState?.branch_id,
      latitude: SelectedAddressState?.user_address_latitude,
      longitude: SelectedAddressState?.user_address_longitude,
    });

    let availableCheckAddress = await getCheckBranchRemote({
      login_id: CheckBranchState?.branch_id,
      latitude: SelectedAddressState?.user_address_latitude,
      longitude: SelectedAddressState?.user_address_longitude,
    });
    if (UserState) {
      if (SelectedAddressState) {
        if (FastDeliveryState) {
          if (DateSlotState) {
            if (TimeSlotState) {
              //Check when fast delivery
              if (FastDeliveryState === 2) {
                if (
                  CheckBranchState.branch_intime < time &&
                  CheckBranchState.branch_outtime > time
                ) {
                  if (AppControlState.instant_order_closing_time > time) {
                    if (availableCheckAddress.branch_status === 1) {
                      if (checkDelivery.status === true) {
                        if (
                          InvoiceState.product_total >=
                          parseInt(AppControlState.minimum_order)
                        ) {
                          return {
                            navigate: true,
                            screen: 'CheckoutScreen',
                          };
                        } else {
                          throw {
                            action: 'errorbox',
                            message: `Minimum order amount should be above ${'\u20B9'}${parseInt(
                              AppControlState.minimum_order,
                            )}`,
                          };
                        }
                      } else {
                        throw {
                          action: 'addressError',
                          message: `Shop is not available in the selected location,Please change the address`,
                        };
                      }
                    } else {
                      throw {
                        action: 'errorbox',
                        message: `Shop is closed,Please change the address`,
                      };
                    }
                  } else {
                    return {
                      navigate: true,
                      screen: 'FastDeliveryTimeSlot',
                    };
                    // throw {
                    //   action: 'errorbox',
                    //   message: `Instant Delivery is not available after ${AppControlState?.instant_order_closing_time}`,
                    // };
                  }
                } else {
                  throw {
                    action: 'errorbox',
                    message: `Selected shop time is available from ${CheckBranchState.branch_intime} to ${CheckBranchState.branch_outtime}`,
                  };
                }
              } else {
                if (
                  InvoiceState.product_total >=
                  parseInt(AppControlState.minimum_order)
                ) {
                  return {
                    navigate: true,
                    screen: 'CheckoutScreen',
                  };
                } else {
                  throw {
                    action: 'errorbox',
                    message: `Minimum order amount should be above ${'\u20B9'}${parseInt(
                      AppControlState.minimum_order,
                    )}`,
                  };
                }
              }
            } else {
              throw {
                action: 'errorbox',
                message: `Please Choose The Time `,
              };
            }
          } else {
            throw {
              action: 'errorbox',
              message: `Please Choose The Date `,
            };
          }
        } else {
          throw {
            action: 'errorbox',
            message: `Please Choose The Order Type `,
          };
        }
      } else {
        return {
          navigate: true,
          screen: 'Addaddress',
        };
      }
    } else {
      return {
        navigate: true,
        screen: 'Login',
      };
    }
  } catch (err) {
    return {
      action: err.action,
      navigate: false,
      message: err.message,
    };
  }
};
