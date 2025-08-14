import {View, Text} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
const RecentMsg = () => {
  return (
    <View style={[tailwind('flex-row items-center ')]}>
      <Text style={[tailwind('font-semibold font-21 text-primary')]}>
        Recent
      </Text>
      <Text style={[tailwind('font-medium font-14 mx-2'), {color: '#818CA1'}]}>
        (2 unreaded)
      </Text>
    </View>
  );
};

export default RecentMsg;
