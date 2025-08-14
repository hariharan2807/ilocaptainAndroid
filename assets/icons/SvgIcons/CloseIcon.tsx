import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CloseIcon = () => {
  return (
    <Svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M4.4292 4.42883L11.5003 11.4999" stroke="#A7AEBD" />
      <Path d="M11.4287 4.42888L4.35764 11.4999" stroke="#A7AEBD" />
    </Svg>
  );
};

export default CloseIcon;
