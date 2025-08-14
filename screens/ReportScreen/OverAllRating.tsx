import {View, Text} from 'react-native';
import React from 'react';
import {
  CLosedCasesIcon,
  NewCasesIcon,
  ProcessingCasesIcon,
} from '../../assets/icons';
import tailwind from '@tailwind';
const OverAllRating = () => {
  return (
    <View style={[tailwind('flex-row justify-around my-3')]}>
      <View style={[tailwind('flex-1 bg-white items-center py-3 rounded-lg')]}>
        <View style={[tailwind('mt-2')]}>
          <NewCasesIcon />
        </View>
        <Text style={[tailwind('font-regular font-10 my-2')]}>New Cases</Text>
        <Text style={[tailwind('font-21 font-semibold'), {color: '#00CFE8'}]}>
          0
        </Text>
      </View>
      <View
        style={[tailwind('flex-1 bg-white items-center py-3 rounded-lg mx-4')]}>
        <View style={[tailwind('mt-2')]}>
          <ProcessingCasesIcon />
        </View>
        <Text style={[tailwind('font-regular font-10 my-2')]}>
          Processing Cases
        </Text>
        <Text style={[tailwind('font-21 font-semibold'), {color: '#FF9F43'}]}>
          0
        </Text>
      </View>
      <View style={[tailwind('flex-1 bg-white items-center py-3 rounded-lg')]}>
        <View style={[tailwind('mt-2')]}>
          <CLosedCasesIcon />
        </View>
        <Text style={[tailwind('font-regular font-10 my-2')]}>
          Closed Cases
        </Text>
        <Text style={[tailwind('font-21 font-semibold'), {color: '#28C76F'}]}>
          0
        </Text>
      </View>
    </View>
  );
};

export default OverAllRating;
