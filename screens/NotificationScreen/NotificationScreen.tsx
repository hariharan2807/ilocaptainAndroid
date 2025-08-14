import {View, Text, ScrollView, Image, useWindowDimensions} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import RecentMsg from './block/RecentMsg';
import MessageCard from './block/MessageCard';
import {HorizondalLineIcon} from '../../assets/icons';
import TImeLine from './block/TImeLine';
import {TopBar} from '@sharedComponents';
import assets_manifest from '@assets';
const NotificationScreen = () => {
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const Empty = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: Math.floor(height / 5),
        }}>
        <Image
          source={assets_manifest?.ringing}
          style={{
            height: Math.floor(height / 4),
            width: Math.floor(width / 3),
            resizeMode: 'contain',
          }}
        />
        <Text style={{color: 'black', fontWeight: 'bold', marginTop: 10}}>
          {' '}
          No Notification Found for your Account
        </Text>
      </View>
    );
  };
  return (
    <View style={[tailwind('bg-background h-full')]}>
      <TopBar title="Notification" type={1} />
      <ScrollView style={[tailwind('p-3')]}>
        <Empty />
        {/* <RecentMsg /> */}
        {/* <MessageCard /> */}
        {/* <View>
          <TImeLine />
          <MessageCard />
        </View> */}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
