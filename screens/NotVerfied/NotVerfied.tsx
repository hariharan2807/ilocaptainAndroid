import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import {TopBar} from '@sharedComponents';
import assets_manifest from '@assets';
import {useNavigation} from '@react-navigation/native';
export default function NotVerfied() {
  const navigation = useNavigation();
  return (
    <View style={[tailwind('flex-1 '),{backgroundColor:"#fff2cf"}]}>
      {/* <TopBar title="" type={1} bg={'#FFD900'} /> */}

      <View style={[tailwind('flex-1 justify-center items-center px-4')]}>
        <View
          style={[
            tailwind('bg-white px-4 py-4 rounded-lg items-center'),
            {width: '100%'},
          ]}>
          <Image
            source={assets_manifest?.clock}
            style={[tailwind(''), {height: 100, width: 100}]}
          />
          <Text style={tailwind('font-18 font-bold text-black mt-3')}>
            Verification Pending
          </Text>
          <Text
            style={[
              tailwind('font-14 font-medium text-center text-black mt-3'),
              {width: '100%'},
            ]}>
            Your documents are currently under verification. Please allow up to
            24 hours
          </Text>
          <TouchableOpacity
            onPress={() => {
              // LoginApiCondition();
              navigation?.goBack();
            }}
            style={[
              tailwind('bg-secondary rounded-xl px-5 py-4 my-3'),
              {width: '100%'},
            ]}>
            <Text
              style={[
                tailwind('text-center font-semibold font-16 text-black '),
              ]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
