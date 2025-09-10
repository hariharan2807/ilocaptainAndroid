/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox,
  useWindowDimensions,
  Platform,
  Linking,
  TouchableOpacity,
  Image,
  AppState,
  AppStateStatus,
} from 'react-native';
import 'react-native-gesture-handler';

import {
  Colors,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import tailwind from '@tailwind';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from 'react-query';
// import SQLite from 'react-native-sqlite-storage';

import RootNavigation from './navigations/RootNavigation';
import store from './store';
import Toast from 'react-native-toast-message';
import {toastConfig} from './constants/toastConfig';
// import SplashScreen from 'react-native-splash-screen';
import {primaryColorBG} from './constants/API_constants';
import {Host, Portal} from 'react-native-portalize';
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {initiateAppControllRemote} from './remote/userRemote';
import Icon from 'react-native-vector-icons/Ionicons';
import assets_manifest from '@assets';

const queryClient = new QueryClient();

LogBox.ignoreLogs(['Setting a timer']);

if (__DEV__ === false) {
  console.log = () => {};
}

// import tailwind from 'tailwind-rn';
// import tailwind from './tailwind';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App: () => Node = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setOffline(false);
      } else {
        setOffline(true);
      }
    });
  }, []);
  const [offline, setOffline] = useState(false);
  const {width, height} = useWindowDimensions();

  const openSettings = async () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.DATA_ROAMING_SETTINGS');
    } else {
      Linking.openSettings();
      Linking.sendIntent('android.settings.SETTINGS');
    }
  };

  const appRestart = async () => {
    RNRestart.Restart();
  };

  const isDarkMode = useColorScheme() === 'dark';

  // OneSignal Initialization

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission

  // Method for listening for notification clicks

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  let versioncode = DeviceInfo.getVersion();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissedUpdate, setDismissedUpdate] = useState(false); // New state for dismissing update prompt
  const openStore = () => {
    if (Platform.OS == 'android') {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.ilo.caption&hl=en_IN',
      ); // Replace 'com.yourappname' with your app’s package name
    } else {
      Linking.openURL(
        'https://apps.apple.com/in/app/ilo-captain/id6749893583',
      );
    }
  };
  useEffect(() => {
    (async () => {
      const appControll = await initiateAppControllRemote();
      console.log(
        'appControll?.ios_latest_version',
        appControll,
        versioncode,
      );
      const latestVersion =
        Platform.OS === 'ios'
          ? // ?"1.0.6"
            appControll?.data?.ios_version_name
          : // '1.0'
            // : appControll?.andriod_latest_version;
            appControll?.data?.android_version_name;
      // '1.10';

      if (latestVersion && latestVersion !== versioncode) {
        setUpdateAvailable(true);
      }
      console.log('latestVersion', latestVersion);
      console.log('versioncode', versioncode);
    })();
  }, []);
  return (
    <GestureHandlerRootView style={[tailwind('')]}>
      <SafeAreaView style={[tailwind('h-full'), {}]}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#FFDA00'} />
        <Host>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {offline ? (
                <View style={[tailwind('flex-1 items-center')]}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: width / 2,
                      height: height / 2,
                      tintColor: '#FFDA00',
                    }}
                    tintColor={'#FFDA00'}
                    source={require('./assets/images/offline.png')}
                  />

                  <Text
                    style={[tailwind('font-bold text-lg text-primary mt-2')]}>
                    NO INTERNET
                  </Text>

                  <Text
                    style={[
                      tailwind('font-medium text-base text-center mx-6'),
                    ]}>
                    Check your internet connection and try again
                  </Text>
                  <Text style={[tailwind('mt-3 font-semibold text-base')]}>
                    PLEASE TURN ON INTERNET
                  </Text>
                  <View
                    style={[
                      tailwind(' flex-row justify-around mx-8 '),
                      {top: 20},
                    ]}>
                    <TouchableOpacity
                      style={[
                        tailwind(' py-4 rounded-2xl bg-secondary'),
                        {width: '48%'},
                      ]}
                      onPress={appRestart}>
                      <Text style={[tailwind('text-center   text-black')]}>
                        Retry
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        tailwind('py-4 bg-red-500 rounded-2xl ml-2'),
                        {width: '48%'},
                      ]}
                      onPress={openSettings}>
                      <Text style={[tailwind('text-center text-white')]}>
                        Go to settings
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : updateAvailable && !dismissedUpdate ? ( // Check if update is available and not dismissed
                <View
                  style={tailwind(
                    'bg-white h-full flex-col justify-center items-center',
                  )}>
                  <Image
                    source={assets_manifest?.Update1}
                    style={[
                      tailwind(''),
                      {resizeMode: 'contain', width: '100%', height: '40%'},
                    ]}
                  />

                  {/* <Icon name="cloud-download-outline" size={100} color="black" /> */}
                  <Text
                    style={[
                      tailwind('font-medium text-black font-14 text-center '),
                      {marginTop: '10%'},
                    ]}>
                   iLo upgraded – because you deserve the best.
                  </Text>
                  {/* <View  style={[tailwind('flex-row')]}> */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={openStore}
                    style={[
                      tailwind(
                        'bg-secondary mt-5 rounded-lg flex-row justify-center items-center',
                      ),
                      {paddingVertical: 14, paddingHorizontal: 28, margin: 12}, // bigger button
                    ]}>
                    <Icon name="download-outline" color="black" size={22} />
                    <Text
                      style={tailwind(
                        'font-bold text-black text-center px-3 uppercase font-15',
                      )}>
                      Update Now
                    </Text>
                  </TouchableOpacity>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setDismissedUpdate(true)}
                      style={[
                        tailwind(
                          'bg-black mt-3 rounded-lg flex-row justify-center items-center',
                        ),
                        {paddingVertical: 8, paddingHorizontal: 16, margin: 6}, // smaller button
                      ]}>
                      <Icon name="close-outline" color="white" size={16} />
                      <Text
                        style={tailwind(
                          'font-regular text-white text-center px-2 uppercase font-12',
                        )}>
                        No Thanks
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {/* </View> */}
                </View>
              ) : (
                <RootNavigation />
              )}
            </QueryClientProvider>
          </Provider>
          <Toast config={toastConfig} />
        </Host>
        {/* <View style={{bottom: '30%'}}> */}
        {/* </View> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
