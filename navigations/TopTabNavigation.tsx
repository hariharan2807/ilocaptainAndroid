import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NewCases from '../screens/CasesScreen/Screens/NewCases';
import ClosedCases from '../screens/CasesScreen/Screens/ClosedCases';
import CustomizedTopBar from '../sharedComponents/CustomizedTopBar';
import XPartyCases from '../screens/CasesScreen/Screens/XpartyCases';
import AwaredCases from '../screens/CasesScreen/Screens/AwaredCases';
const Tab = createMaterialTopTabNavigator();

const TopTabNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomizedTopBar {...props} />}
      // screenOptions={{tabBarScrollEnabled: true}}
      screenOptions={{ tabBarScrollEnabled: true,tabBarIndicatorStyle:{
        backgroundColor:"blue",
        height:8,
       
    } }}
      sceneContainerStyle={{backgroundColor: 'white'}}>
      <Tab.Screen name="New" component={NewCases} />
      <Tab.Screen name="Awared" component={AwaredCases} />
      <Tab.Screen name="Closed" component={ClosedCases} />
      <Tab.Screen name="XParty" component={XPartyCases} />
      {/* <Tab.Screen name="Hold" component={Hold} />
      <Tab.Screen name="First" component={First} />
      <Tab.Screen name="Proof" component={Proof} /> */}
    </Tab.Navigator>
  );
};

export default TopTabNavigation;
