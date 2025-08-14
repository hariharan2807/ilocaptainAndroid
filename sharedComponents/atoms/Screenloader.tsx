import {View, ActivityIndicator, Text} from 'react-native';
import React from 'react';
import tailwind from 'tailwind-rn';
import LottieView from 'lottie-react-native';

const FullScreenLoading = () => {
  return (
    <View style={[tailwind('justify-center items-center'), {flex: 1}]}>
      <LottieView
        source={require('../../assets/gif/load.json')}
        autoPlay
        loop
        style={{width: 100, height: 100}}
      />

      {/* <ActivityIndicator color="green" size={50} /> */}
    </View>
  );
};
export default FullScreenLoading;
