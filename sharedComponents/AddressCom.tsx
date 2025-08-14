import {View, Text} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
interface prototype {
  pickupAddress: any;
  dropAddress: any;
}
export const AddressCom = (props: prototype) => {
  return (
    <View style={[tailwind('mt-5'), {}]}>
      <View style={[tailwind('flex-row items-center'), {width: '91%'}]}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: 'green',
            marginHorizontal: 10,
          }}
        />
        <View style={[tailwind(''), {}]}>
          <Text style={[tailwind('text-gray'), {}]}>Pickup Address</Text>
          <Text style={[tailwind('mt-1 text-black'), {}]}>{props?.pickupAddress}</Text>
        </View>
      </View>
      <View
        style={[
          tailwind('mt-5'),
          //   {backgroundColor: 'silver', height: 20, width: 1},
        ]}
      />
      <View style={[tailwind('flex-row items-center'), {width: '91%'}]}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: 'red',
            marginHorizontal: 10,
          }}
        />
        <View style={[tailwind(''), {}]}>
          <Text style={[tailwind('text-gray'), {}]}>Drop Address</Text>
          <Text style={[tailwind('mt-1 text-black'), {}]}>{props?.dropAddress}</Text>
        </View>
      </View>
    </View>
  );
};
