import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const ProfileIcon1 = () => {
  return (
    <Svg width="50" height="36" viewBox="0 0 50 36" fill="none">
      <Rect x="2" y="2" width="46" height="32" rx="16" fill="#3E65E6" />
      <Path
        d="M20.4165 13.4167H19.4998C19.0136 13.4167 18.5473 13.6098 18.2035 13.9536C17.8597 14.2975 17.6665 14.7638 17.6665 15.25V23.5C17.6665 23.9862 17.8597 24.4526 18.2035 24.7964C18.5473 25.1402 19.0136 25.3333 19.4998 25.3333H27.7498C28.2361 25.3333 28.7024 25.1402 29.0462 24.7964C29.39 24.4526 29.5832 23.9862 29.5832 23.5V22.5833"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M32.6863 13.0363C33.0473 12.6752 33.2501 12.1856 33.2501 11.675C33.2501 11.1644 33.0473 10.6748 32.6863 10.3138C32.3252 9.95273 31.8356 9.74991 31.325 9.74991C30.8144 9.74991 30.3248 9.95273 29.9638 10.3138L22.25 18V20.75H25L32.6863 13.0363V13.0363Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M28.6665 11.5833L31.4165 14.3333"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Rect
        x="2"
        y="2"
        width="46"
        height="32"
        rx="16"
        stroke="white"
        stroke-width="4"
      />
    </Svg>
  );
};

export default ProfileIcon1;
