import {View, Text} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import {TopBar} from '@sharedComponents';
import { useRoute } from '@react-navigation/native';
export default function TrainingScreen() {
    const route=useRoute();

  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="TrainingScreen" />
      <Text>{route?.params?.uri}</Text>
    </View>
  );
}
