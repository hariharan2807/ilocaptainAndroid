import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UserProfileScreen from '../screens/UserProfileScreen';

//  Auth Screen
import DashboardScreen from '../screens/DashboardScreen';
import RiderOrderList from '../screens/RiderOrderList';

const StackConfig = {headerShown: false};

const DashboardStack = createNativeStackNavigator();
const CasesStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

export function Dashboard(props: any) {
  return (
    <DashboardStack.Navigator screenOptions={StackConfig}>
      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
      />
      {/* <CasesStack.Screen name="TopTabNavigation" component={TopTabNavigation} /> */}
      {/* <DashboardStack.Screen name="CasesScreen" component={CasesScreen} /> */}
    </DashboardStack.Navigator>
  );
}

// export function Cases(props: any) {
//   return (
//     <CasesStack.Navigator screenOptions={StackConfig}>
//       <CasesStack.Screen name="CasesScreen" component={CasesScreen} />
//     </CasesStack.Navigator>
//   );
// }

// export function Cart(props: any) {
//   return (
//     <CartStack.Navigator screenOptions={StackConfig}>
//       <CartStack.Screen name="CartScreen" component={CartScreen} />

//     </CartStack.Navigator>
//   );
// }
export function Account(props: any) {
  return (
    <AccountStack.Navigator
      initialRouteName="UserProfileScreen"
      screenOptions={StackConfig}>
      <AccountStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
    </AccountStack.Navigator>
  );
}

export function Cart(props: any) {
  return (
    <AuthStack.Navigator
      initialRouteName="RiderOrderList"
      screenOptions={StackConfig}>
      <AuthStack.Screen name="RiderOrderList" component={RiderOrderList} />
    </AuthStack.Navigator>
  );
}
