import {View, Text, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import tailwind from '@tailwind';
import {Image} from 'react-native';
import { TopBar } from '@sharedComponents';
export default function TermsAndCondition() {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const hideSpinner = () => {
    setLoading(false);
  };
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  return (
    <View>
      <TopBar title={''} type={1} />
      <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        {route?.params?.uri ? (
          <WebView
            style={{flex: 1}}
            onLoad={() => hideSpinner()}
            source={{uri: route?.params?.uri}}
          />
        ) : (
          <View
            style={{
              marginTop: '50%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/images/nodata.jpg')}
              style={{
                height: Math.floor(height / 4),
                width: Math.floor(width / 3),
              }}
            />
            <Text style={[tailwind('font-bold'), {color: 'black'}]}>
              {' '}
              No Case Found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
