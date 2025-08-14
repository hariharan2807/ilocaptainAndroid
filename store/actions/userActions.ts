import store from '../../store';
import {APP_CONTROL, SAVE_IP, SAVE_JWT_TOKEN, UPDATE_CART, USER_INFO, VALUE_DATE} from './actionTypes';
import { errorBox } from '../../workers/utils';

export const saveIpAction = (payload: string) => ({
  type: SAVE_IP,
  payload,
});
export const saveuserInfo = (payload: string) => ({
  type: USER_INFO,
  payload,
});
export const saveJWTTokenAction = (payload: any) => ({
  type: SAVE_JWT_TOKEN,
  payload,
});
export const SaveDate = (payload: any) => ({
  type: VALUE_DATE,
  payload,
});
export const updateCart=(payload:[])=>({
  type:UPDATE_CART,
  payload
})
export const appControl=(payload:any)=>({
  type:APP_CONTROL,
  payload
})
export const incrementAction = (payload: any) => {
  return async (dispatch: any) => {
    try {
      const oldCartState = store.getState().user.cart;
      const AppControlState = store.getState().app.app_controll;
      const isIteminCart = oldCartState.findIndex(
        (item: any) => item.uuid === payload.uuid,
      );
      if (isIteminCart !== -1) {

        let newCartObj = oldCartState[isIteminCart];
        if (
          parseInt(
            // AppControlState?.maximum_quantity_limit
            "20"
          ) >
          newCartObj.quantity
        ) {
          newCartObj.quantity++;
          oldCartState.splice(isIteminCart, 1, newCartObj);
          let newCart: any = [...oldCartState];
          dispatch(updateCart(newCart));
        } else {
          errorBox('Maximum quantity reached');
        }
      } else {
        let newCartObj = {...payload};
        newCartObj.quantity = 1;
        let newCart: any = [...oldCartState, newCartObj];
        dispatch(updateCart(newCart));
      }
    } catch (err) {
      console.log(err);
      // dispatch(handleError(`incrementAction()`));
    }
  };
};

export const decrementAction = (uuid: any) => {
  return async (dispatch: any) => {
    try {
      const oldCartState = store.getState().user.cart;
      const indexOnCart = oldCartState.findIndex(
        (item: any) => item.uuid === uuid,
      );
      if (indexOnCart !== -1) {
        if (oldCartState[indexOnCart].quantity === 1) {
          oldCartState.splice(indexOnCart, 1);
          let newCart: any = [...oldCartState];
          dispatch(updateCart(newCart));
          // dispatch(preOrderstatusAction(false));
        } else {
          let newCartObj = {...oldCartState[indexOnCart]};
          newCartObj.quantity--;
          oldCartState.splice(indexOnCart, 1, newCartObj);
          let newCart: any = [...oldCartState];
          dispatch(updateCart(newCart));
        }
      }
    } catch (err) {
      console.log(err);
      // dispatch(handleError(`Decrement Action()`));
    }
  };
};

export const removeCartAction = (payload: any) => {
  return (dispatch: any) => {
    let CartState = store.getState().user.cart;
    let isInCart = CartState.find(item => item.uuid === payload.uuid);
    if (isInCart) {
      let index = CartState.findIndex(item => item.uuid === payload.uuid);
      if (isInCart) {
        //remove the item
        CartState.splice(index, 1);
        let newCart = [...CartState];
        dispatch({
          type: UPDATE_CART,
          payload: newCart,
        });
      }
    }
  };
};
