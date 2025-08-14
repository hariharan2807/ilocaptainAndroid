import tailwind from '@tailwind';
import {View, Text} from 'react-native';
import React from 'react';
import {TopBar} from '@sharedComponents';
export default function NotificationScreen() {
  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="Notification" type={1} />
    </View>
  );
}
