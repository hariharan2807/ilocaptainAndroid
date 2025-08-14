import assets_manifest from '@assets';
import tailwind from '@tailwind';
import React, { useCallback, useState } from 'react';
import {View, Text, Image} from 'react-native';
import {QuantityAction} from '../../screens/DashboardScreen/block/HomeScreenFloating';
import { CartItemUniqueId } from '../../workers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { decrementAction, incrementAction } from '@actions/userActions';
interface props {
  product_name: string;
  product_id: number;
  product_image: string;
  product_addon: any;
  product_status: string;
  product_description: string;
  is_veg: boolean;
  variations: any;
  product_recommended: string;
  product_message:string
  shop_id:any
  shop_tax:any
  shop_name:string
}
export const ProductCart = (props: any) => {
    const dispatch=useDispatch();
  let [svar, setSvar] = useState(
    props.variations?.length ? props.variations[0] : [],
  );
  let [selected_addons, setSelected_addons] = useState([]);
//   console.log('?.shop_id--->',  props?.shop_id);
  const CartState=useSelector(state=>state.user.cart)
  const Currency = '₹';
 
  const increment = useCallback(() => {
    const addToCart = async () => {
      try {
        const uuid = CartItemUniqueId(
          props.shop_id,
          props.product_id,
          svar,
          selected_addons
        );
  
        // console.log('Generated UUID:', uuid);
  
        const cartObj = {
          uuid: uuid,
          id: props.product_id,
          variation_id: svar.product_variation_id,
          product_name: props?.product_name,
          product_image:props?.product_image,
          price: svar.product_price,
          shop_id: props?.shop_id,
          shop_image: props?.shopImage,
          selected_variation: props?.variations[0]?.product_variation_name,
          selected_variationunit: props?.variations[0]?.product_variation_unit_name,
          shop_name: props?.shop_name,
          selected_addons: [],
          company_id: 0,
          addons: [],
          variations: [],
          tax_amount: props?.shop_tax,
          product_price_without_tax: props?.variations[0]?.product_price_without_tax,
          shop_tax: props?.shop_tax,
          customisable: false,
          isCombo: false,
          is_veg: props?.veg,
        };
  
        console.log('Adding to cart:', cartObj);
  
        // Dispatch the action
        dispatch(incrementAction(cartObj));
  
        // Optionally log the updated state after a short delay
        // setTimeout(() => {
        //   console.log('CartState after increment:', CartState);
        // }, 100);
      } catch (error) {
        console.error('Error in increment function:', error);
      }
    };
  
    addToCart();
  }, [props, svar, selected_addons, dispatch]);
  

  const decrement = useCallback(() => {
    
      let uuid = CartItemUniqueId(
        props.shop_id,
        props.product_id,
        svar,
        selected_addons
      );
      dispatch(decrementAction(uuid));
    
  }, [CartState]);
  const QuantyFun = () => {
    let uuid = CartItemUniqueId(
      props.shop_id,
      props.product_id,
      svar,
      selected_addons
    );
    // console.log('Generated UUID:', uuid);
    // console.log('CartState UUIDs:', CartState.map((item) => item.uuid));
        let index = CartState.findIndex((item) => item?.uuid === uuid);
  
    // Check if the item is found in CartState
    if (index !== -1) {
      return CartState[index]?.quantity || 0; // Return quantity or default to 0
    } else {
      return 0; // Item not found, quantity is 0
    }
  };
  
  
  const quantity=QuantyFun()
  

  return (
    <View style={[tailwind('flex-row p-3'), {}]}>
      <View style={[tailwind('rounded-xl'), {width:"28%"}]}>
        <Image
          style={[tailwind('rounded-xl'), {height: 90, width: 100}]}
          source={{uri: props?.product_image}}
        />
      </View>
      <View style={[tailwind('p-3'), {width:"70%"}]}>
        <View>
          <Text style={[tailwind('font-15'), {fontWeight: 'bold'}]}>
            {props?.product_name}
          </Text>
          {props?.product_description ? (
            <Text style={[tailwind('font-13 mt-1'), {}]}>
              {props?.product_description}
            </Text>
          ) : null}
        </View>
        <View  style={[tailwind(''),{}]}>
          <View style={[tailwind('mt-2 flex-row '), {}]}>
            <Image
              style={[tailwind('h-5 w-5'), {}]}
              source={
                props?.is_veg ? assets_manifest?.veg : assets_manifest?.Nonveg
              }
            />
            <Text
              style={[tailwind('text-black font-15'), {fontWeight: 'bold'}]}>
              {' '}
              {Currency}
              {svar?.product_price}
            </Text>
            <View  style={[tailwind(''),{marginLeft:"auto"}]}>
              
              <QuantityAction 
              produc_tStatus={props?.product_status==1?true:false}
              product_message={props?.product_message}
              increment={increment}
              decrement={decrement}
              quantity={quantity}
              />
              
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
