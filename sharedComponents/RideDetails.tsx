import tailwind from '@tailwind';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import assets_manifest from '@assets';
import {useNavigation} from '@react-navigation/native';
import {AddressCom} from './AddressCom';
interface prototype {
  drivername: string;
  fare: number;
  distance: string;
  pickupAddress: string;
  dropAddress: string;
  date: string;
  time: string;
  rating: string;
  status: string;
  index: any;
  trip_id: number;
}
export const RiderDetails = (props: prototype) => {
  const navigation = useNavigation();
  return (
    <View style={[tailwind('px-3 py-3 '), {}]} key={props?.index}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RideDetails', {trip_id: props?.trip_id});
        }}
        style={[tailwind('bg-white py-3 rounded-xl'), {}]}
        disabled={props?.status != 'cancelled' ? false : true}>
        <View style={[tailwind('flex-row'), {justifyContent: 'space-evenly'}]}>
          <View style={[tailwind('items-center py-2'), {width: '40%'}]}>
            <Text
              style={[
                tailwind('font-15 font-bold text-black'),
                {textTransform: 'capitalize'},
              ]}>
              {props?.drivername}{' '}
            </Text>
            {props?.rating !== '' ? (
              <View style={[tailwind('flex-row  items-center '), {}]}>
                <Image
                  source={assets_manifest?.Star}
                  style={[
                    tailwind(''),
                    {width: 18, height: 18, resizeMode: 'contain'},
                  ]}
                />
                <Text
                  style={[
                    tailwind(
                      ' font-18 ml-1 mt-1 text-black font-bold text-center items-center',
                    ),
                    {},
                  ]}>
                  {Math.round(props?.rating)}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={[tailwind('items-center'), {width: '30%'}]}>
            <Text style={[tailwind('font-14 text-black'), {}]}>Fare</Text>
            <Text style={[tailwind('font-15 text-black font-bold mt-1'), {}]}>
              ₹{Math.round(props?.fare)}
            </Text>
          </View>
          <View style={[tailwind('items-center'), {width: '20%'}]}>
            <Text style={[tailwind('font-14 text-black'), {}]}>Distance</Text>
            <Text style={[tailwind('font-15 text-black font-bold mt-1'), {}]}>
              {props?.distance}
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind('mt-3'),
            {width: '100%', height: 1, backgroundColor: 'silver'},
          ]}
        />
        <AddressCom
          pickupAddress={props?.pickupAddress}
          dropAddress={props?.dropAddress}
        />
        <View
          style={[
            tailwind('flex-row px-3 mt-3 mb-3'),
            {justifyContent: 'space-between'},
          ]}>
          <Text  style={[tailwind('text-black')]}>{props?.date}</Text>
          <Text  style={[tailwind('text-black')]}>{props?.time}</Text>
        </View>
        {props?.status == 'cancelled' ? (
          <View
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                top: '25%',
                alignItems: 'center',
                // zIndex: 10, // optional: in case it's hidden behind content
              },
            ]}>
            <Image
              source={assets_manifest?.Cancelled}
              style={{
                height: 130,
                width: 130,
                resizeMode: 'contain',
                transform: [{rotate: '-30deg'}],
              }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
