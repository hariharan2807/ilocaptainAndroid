import React from 'react';
import tailwind from '@tailwind';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import assets_manifest from '@assets';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
interface Props {
  title: string;
  type: number;
  bg:string
}

export default function TopBar(props: Props) {
  const navigation = useNavigation();
  return (
    <View>
      {props?.type == 1 ? (
        <View
          style={[
            tailwind(
              `flex flex-row white-shadow  items-center py-2 px-2`,
            ),{backgroundColor:props?.bg?props?.bg:'white'}
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text
            style={[tailwind('font-21 text-black ml-5'), {fontWeight: 'bold'}]}>
            {props?.title}
          </Text>
        </View>
      ) : (
        <View
          style={[
            tailwind('flex flex-row justify-between items-center py-2 px-2'),
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-back-outline" size={25} color="black" />
          </TouchableOpacity>
          <Text style={[tailwind('font-15 text-black'), {fontWeight: 'bold'}]}>
            {props?.title}
          </Text>
        </View>
      )}
    </View>
  );
}
