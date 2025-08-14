import {View, Text} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
interface prototype {
  total: any;
  payment_mode_name: any;
  driver_earning: any;
  admin_commission: any;
}
export const Invoice = (props: prototype) => {
  return (
    <View style={[tailwind(''), {}]}>
      {props?.total ? (
        <View style={[tailwind('flex-row'), {justifyContent: 'space-between'}]}>
          <Text style={[tailwind('font-20 font-bold'), {}]}>Total</Text>
          <Text style={[tailwind('font-20 font-bold'), {}]}>
            ₹ {Math.round(props?.total)}
          </Text>
        </View>
      ) : null}

      {/* {props?.total ? (
        <View
          style={[
            tailwind('flex-row mt-2'),
            {justifyContent: 'space-between'},
          ]}>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            Ride Price
          </Text>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            ₹ {Math.round(props?.total)}
          </Text>
        </View>
      ) : null} */}

    

      {props?.driver_earning ? (
        <View
          style={[
            tailwind('flex-row mt-2'),
            {justifyContent: 'space-between'},
          ]}>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            Driver Earnings
          </Text>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            ₹ {Math.round(props?.driver_earning)}
          </Text>
        </View>
      ) : null}

      {props?.admin_commission ? (
        <View
          style={[
            tailwind('flex-row mt-2'),
            {justifyContent: 'space-between'},
          ]}>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            Admin Comission
          </Text>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            ₹ {Math.round(props?.admin_commission)}
          </Text>
        </View>
      ) : null}
        {props?.payment_mode_name ? (
        <View
          style={[
            tailwind('flex-row mt-2'),
            {justifyContent: 'space-between'},
          ]}>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            Payment collected mode
          </Text>
          <Text style={[tailwind('font-14 font-medium text-gray'), {}]}>
            {props?.payment_mode_name}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
