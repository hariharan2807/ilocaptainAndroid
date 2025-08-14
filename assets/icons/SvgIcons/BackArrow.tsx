import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path} from 'react-native-svg';

const BackArrow = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.16663 10H15.8333"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4.16663 10L9.16663 15"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4.16663 10L9.16663 5"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default BackArrow;
