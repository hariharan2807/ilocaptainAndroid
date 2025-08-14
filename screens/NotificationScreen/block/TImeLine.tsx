import {View, Text} from 'react-native';
import React from 'react';
import {HorizondalLineIcon} from '../../../assets/icons';
import tailwind from '@tailwind';
const TImeLine = () => {
  return (
    <View style={[tailwind('flex-row items-center justify-around my-2')]}>
      <HorizondalLineIcon />
      <Text style={[tailwind('font-13 font-regular '), {color: '#A7B6F0'}]}>
        02 Aug 2023
      </Text>
      <HorizondalLineIcon />
    </View>
  );
};

export default TImeLine;
