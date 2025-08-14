import {TopBar} from '@sharedComponents';
import tailwind from '@tailwind';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from 'react-query';
import {getDashboard} from '../../../remote/userRemote';

export default function TopHomeScreen() {
  const Response = useQuery(['getDashboard'], getDashboard);
  return (
    <View>
      <TopBar title="Home" type={1} />
      <View
        style={[
          tailwind('flex-row ml-3 mr-3 mt-5'),
          {justifyContent: 'space-between'},
        ]}>
        <View
          style={[
            tailwind('bg-white px-3 py-5 rounded-xl items-center'),
            {width: '48%'},
          ]}>
          <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
            Total Rides{' '}
          </Text>
          <Text style={[tailwind('font-20 mt-3 font-bold'), {}]}>
            {Response?.data?.data?.total_rides}{' '}
          </Text>
        </View>
        <View
          style={[
            tailwind('bg-white px-3 py-5 rounded-xl items-center'),
            {width: '48%'},
          ]}>
          <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
            Total KM{' '}
          </Text>
          <Text style={[tailwind('font-20 mt-3 font-bold'), {}]}>
            {Response?.data?.data?.total_km}
          </Text>
        </View>
      </View>
      <View style={[tailwind('ml-3 mr-3'), {}]}>
        <View
          style={[
            tailwind('bg-white px-3 mt-5  py-5 rounded-xl items-center'),
            {width: '100%'},
          ]}>
          <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
            Total Earning{' '}
          </Text>
          <Text style={[tailwind('font-24 mt-3 font-bold'), {}]}>
            ₹{Response?.data?.data?.total_earnings}{' '}
          </Text>
        </View>
      </View>
    </View>
  );
}
