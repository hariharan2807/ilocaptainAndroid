import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomBottomTab from '../sharedComponents/atoms/CustomBottomTab';

import {Account,  Cart,  Dashboard} from './StackNavigations';

const BottomTab = createBottomTabNavigator();

const config = {headerShown: false};

export default function BottomTabNavigation(props: any) {
  return (
    <BottomTab.Navigator
      screenOptions={config}
      tabBar={props => <CustomBottomTab {...props} />}>
      <BottomTab.Screen name="Home" component={Dashboard} />
      <BottomTab.Screen name="Booking" component={Cart} />
      <BottomTab.Screen name="Account" component={Account} />
    </BottomTab.Navigator>
  );
}
