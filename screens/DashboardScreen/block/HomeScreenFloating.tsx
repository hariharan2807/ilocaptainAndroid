import assets_manifest from '@assets';
import {useNavigation} from '@react-navigation/native';
import tailwind from '@tailwind';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import { getDashboard } from '../../../remote/userRemote';

interface props {
 
}
export const HomeScreenFloating = (props: props) => {
  const navigation = useNavigation();
   const Response = useQuery(['getDashboard'], getDashboard, {
    refetchInterval: 10000,
  });
  return (
    <View style={[tailwind('flex-row my-2 px-3'), {width: '100%'}]}>
      <TouchableOpacity
        style={[tailwind('py-3 items-center'), {width: '33%'}]}
        onPress={() => {
          navigation.navigate('MyRides');
        }}>
        <Image
          source={assets_manifest?.save}
          style={[tailwind(''), {height: 30, width: 30}]}
        />
        <Text style={[tailwind('mt-3 font-bold px-3 text-black'), {}]}>
          {Response?.data?.data?.total_rides}
        </Text>
        <View style={[tailwind('items-center'), {}]}>
          <Text style={[tailwind('mt-2 font-bold text-black'), {}]}>Today </Text>
          <Text style={[tailwind('font-bold text-black'), {}]}> Booking</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[tailwind('py-3 items-center'), {width: '33%'}]}
        onPress={() => {
          navigation?.navigate('EarningScreen');
        }}>
        <Image
          source={assets_manifest?.dollar}
          style={[tailwind(''), {height: 30, width: 30}]}
        />
        <Text style={[tailwind('mt-3 font-bold px-3 text-center text-black'), {}]} numberOfLines={2}>
         ₹{Math.round(Response?.data?.data?.total_earnings)}
        </Text>
        <View style={[tailwind('items-center'), {}]}>
          <Text style={[tailwind('mt-2 font-bold text-black'), {}]}>Today </Text>
          <Text style={[tailwind('font-bold text-black'), {}]}> Earnings</Text>
        </View>
      </TouchableOpacity>
      <View
        style={[tailwind('py-3 items-center '), {width: '33%'}]}>
        <Image
          source={assets_manifest?.sales}
          style={[tailwind(''), {height: 30, width: 30}]}
        />
        <Text style={[tailwind('mt-3 font-bold px-3 text-center text-black'), {}]} numberOfLines={2}>
          {Response?.data?.data?.total_km.toFixed(2)}
        </Text>
        <View style={[tailwind('items-center'), {justifyContent:"center"}]}>
          <Text style={[tailwind('mt-2 font-bold text-black'), {}]}>Today </Text>
          <Text style={[tailwind('font-bold text-black'), {}]}> Km</Text>
        </View>
      </View>
    </View>
  );
};
