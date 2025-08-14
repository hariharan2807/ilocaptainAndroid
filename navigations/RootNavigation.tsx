import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import InitialScreen from '../screens/InitialScreen';
import BottomTabNavigation from './BottomTabNavigation';
import LoginScreen from '../screens/LoginScreen';
import ReportScreen from '../screens/ReportScreen/ReportScreen';
import UploadDocumentScreen from '../screens/UploadDocumentScreen/UploadDocumentScreen';
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
// import PdfScreen from '../screens/CaseDetailsScreen/block/pdfScreen';
import TermsAndCondition from '../screens/UserProfileScreen/block/TermsAndCondition';
import MyRides from '../screens/MyRides';
import RideDetails from '../screens/RideDetails';
import NewOrder from '../screens/NewOrder';
import AcceptOrder from '../screens/AcceptOrder';
import OtpScreen from '../screens/OtpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EarningScreen from '../screens/EarningScreen';
import {
  KYCVerficationScreen,
  TrainingScreen,
  WithdrawlScreen,
} from '../screens/UserProfileScreen/atom';
import {AppState} from 'react-native';
import TopHomeScreen from '../screens/DashboardScreen/block/TopHomeScreen';
import CancelScreen from '../screens/CancelScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NotVerfied from '../screens/NotVerfied';
import MessageScreen from '../screens/Message';

const RootNavigator = createNativeStackNavigator();

const StackConfig = {headerShown: false};

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <RootNavigator.Navigator
        initialRouteName="InitialScreen"
        screenOptions={StackConfig}>
        <RootNavigator.Screen component={InitialScreen} name="InitialScreen" />

        <RootNavigator.Screen
          component={BottomTabNavigation}
          name="BottomTabNavigation"
        />
        <RootNavigator.Screen component={LoginScreen} name="LoginScreen" />
        <RootNavigator.Screen
          component={TermsAndCondition}
          name="TermsAndCondition"
        />
        <RootNavigator.Screen
          component={UploadDocumentScreen}
          name="UploadDocumentScreen"
        />
        <RootNavigator.Screen
          component={NotificationScreen}
          name="NotificationScreen"
        />
        <RootNavigator.Screen component={MyRides} name="MyRides" />
        <RootNavigator.Screen component={OtpScreen} name="OtpScreen" />
        <RootNavigator.Screen
          component={EditProfileScreen}
          name="EditProfileScreen"
        />
        <RootNavigator.Screen
          component={KYCVerficationScreen}
          name="KYCVerficationScreen"
        />
        <RootNavigator.Screen
          component={TrainingScreen}
          name="TrainingScreen"
        />
        <RootNavigator.Screen
          component={WithdrawlScreen}
          name="WithdrawlScreen"
        />
        <RootNavigator.Screen component={TopHomeScreen} name="TopHomeScreen" />
        <RootNavigator.Screen name="EarningScreen" component={EarningScreen} />
        <RootNavigator.Screen name="CancelScreen" component={CancelScreen} />
        <RootNavigator.Screen name="ReportScreen" component={ReportScreen} />
        <RootNavigator.Screen name="RideDetails" component={RideDetails} />
        <RootNavigator.Screen name="NewOrder" component={NewOrder} />
        <RootNavigator.Screen name="AcceptOrder" component={AcceptOrder} />
        <RootNavigator.Screen
          name="RegisterScreen"
          component={RegisterScreen}
        />
        <RootNavigator.Screen name="MessageScreen" component={MessageScreen} />

        <RootNavigator.Screen name="NotVerfied" component={NotVerfied} />
      </RootNavigator.Navigator>
    </NavigationContainer>
  );
}
