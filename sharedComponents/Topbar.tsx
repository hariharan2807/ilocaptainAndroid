import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {BackArrow} from '../assets/icons';
import tailwind from '@tailwind';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';

const Topbar = (props: any) => {
  const navigation = useNavigation();
  return (
    <View style={[tailwind('flex-row items-center bg-primary px-3')]}>
      <TouchableOpacity
        onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
        <BackArrow />
      </TouchableOpacity>
      <View style={[tailwind('flex-1 ')]}>
        <Text
          style={[tailwind('text-center py-4 text-white font-medium font-15')]}>
          {props?.title}
        </Text>
      </View>
    </View>
  );
};

export default Topbar;
