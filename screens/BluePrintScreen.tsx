import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import tailwind from '@tailwind';
// import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
// import tailwind from '@tailwind';
// import {TopBar} from '@sharedComponents';
import {useQuery} from 'react-query';
const log = console.log;

export default function BluePrintScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={tailwind('px-4 bg-gray-400')}>
      <Text>Hello</Text>
    </View>
  );
}
