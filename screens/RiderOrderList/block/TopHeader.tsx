import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
export const TopHeader = (props: any) => {
  
  return (
    <TouchableOpacity
      onPress={() => {
        props?.setSelected(props?.i?.id);
      }}
      style={[
        tailwind(`flex-row py-3 rounded-xl px-3 items-center `),
        {
          width: '48%',
          justifyContent: 'center',
          backgroundColor:
            props?.i?.id === props?.selected ? '#FFD900' : 'white',
        },
      ]}
      key={props?.index}>
      <Text
        style={[
          tailwind('text-center text-black'),
          {fontWeight: props?.i?.id === props?.selected ? 'bold' : '500'},
        ]}>
        {props?.i?.name}
      </Text>
    </TouchableOpacity>
  );
};
