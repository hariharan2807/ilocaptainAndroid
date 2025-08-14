import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path} from 'react-native-svg';

const LogoutIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 16L22 12M22 12L18 8M22 12H9M15 19.796C13.7252 20.5617 12.2452 21 10.6667 21C5.8802 21 2 16.9706 2 12C2 7.02944 5.8802 3 10.6667 3C12.2452 3 13.7252 3.43827 15 4.20404"
        stroke="#EB5757"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default LogoutIcon;
