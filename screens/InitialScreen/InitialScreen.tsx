import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  Alert,
  Platform,
  Linking,
  AppState,
} from 'react-native';
import tailwind from '@tailwind';
// import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
// import tailwind from '@tailwind';
// import {TopBar} from '@sharedComponents';
import {useQuery} from 'react-query';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  SelectedDateValue,
  getSelectedDate,
  getTokenuser,
} from '../../workers/localStorage';
import {useDispatch} from 'react-redux';
import {
  appControl,
  SaveDate,
  saveuserInfo,
} from '../../store/actions/userActions';
import FastImage from 'react-native-fast-image';
import {acquireGPSPermission} from '../../workers/utils';
import {
  getMyprofileremote,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';

export default function InitialScreen() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
    const [TurnOnLoad, setTurnOnLoad] = useState(false);
  
  // const REsponseData = useQuery(['getCaseClosed1'], getprofile);

  useEffect(() => {
    const startUp = async () => {
      const permissionGranted = await acquireGPSPermission();
      if (permissionGranted) {
        await initializeApp(); // renamed for clarity
      }
    };

    startUp();
  }, [navigation]);

 const initializeApp = async () => {
  setLoading(true);

  try {
    // 1️⃣ Check if Location is enabled first
    const locationEnabled = await DeviceInfo.isLocationEnabled();

    if (!locationEnabled) {
      promptEnableLocationServices();
      return; // ⛔ Stop here until user enables location
    }

    // 2️⃣ If location is enabled → proceed with app init
    const token = await getTokenuser();
    const selectedDate = await getSelectedDate();
    const profileResponse = await getMyprofileremote();
    const Response11 = await initiateAppControllRemote();

    if (Response11?.data) {
      dispatch(appControl(Response11?.data));
    } else {
      dispatch(appControl(null));
    }

    if (!token) {
      navigation.reset({
        routes: [{name: 'LoginScreen'}],
      });
      return;
    }

    const profile = profileResponse?.data;

    if (profile?.driver_name) {
      dispatch(SaveDate(selectedDate));
      dispatch(saveuserInfo(profile));

      navigation.reset({
        routes: [{name: 'BottomTabNavigation'}],
      });
    } else {
      dispatch(saveuserInfo(profile));

      navigation.reset({
        routes: [{name: 'EditProfileScreen'}],
      });
    }
  } catch (err) {
    console.log('Initialization error:', err);
  } finally {
    setLoading(false);
  }
};
const promptEnableLocationServices = () => {
  Alert.alert(
    'Enable Location Services',
    'Location services are disabled. Please enable them to continue.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setTimeout(() => {
            initializeApp();
          }, 2000);
        },
      },
      {
        text: 'Enable',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('App-Prefs:root=Privacy&path=LOCATION');
          } else {
            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
          }
          const subscription = AppState.addEventListener('change', async state => {
            if (state === 'active') {
              const enabled = await DeviceInfo.isLocationEnabled();
              if (enabled) {
                subscription.remove();
                initializeApp();
              }
            }
          });
        },
      },
    ],
  );
};


  return (
    <View style={{flex: 1}}>
      <View style={[tailwind('flex-1 justify-center items-center')]}>
        <LottieView
          source={require('../../assets/gif/load.json')}
          autoPlay
          loop
          style={{width: 80, height: 80}}
        />
        {/* <FastImage
          source={require('../../assets/gif/ini.gif')}
          style={{
            height: 120,
            width: '100%',
            borderRadius: 10,
          }}
          resizeMode="contain"
        /> */}
      </View>
    </View>
  );
}
