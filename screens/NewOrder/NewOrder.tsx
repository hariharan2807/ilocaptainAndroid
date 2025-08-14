import {
  View,
  Text,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import tailwind from '@tailwind';
import * as Progress from 'react-native-progress';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {
  getMyprofileremote,
  getNewOrder,
  getUpdate_trip_sts,
} from '../../remote/userRemote';
import {saveuserInfo} from '@actions/userActions';
import {acquireGPSPermission, errorBox} from '../../workers/utils';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import Geolocation from 'react-native-get-location';
import {Save_trip_id} from '../../workers/localStorage';

const soundDuration = 13000; // 13 seconds

export default function NewOrder() {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const route = useRoute();
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTripId, setLoadingTripId] = useState(null);

  const [openModel, setOpenModel] = useState(false);
  const dispatch = useDispatch();
  const circularRef = useRef(null);
  const navigation = useNavigation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // ⬅️ To store the interval
  const [secondsLeft, setSecondsLeft] = useState(60); // Start from 60
  const playCountRef = useRef(0); // Using ref to keep the play count without re-render
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const maxPlays = 60;
  const soundDuration = 3000;
  const NewOrder = route?.params?.data;
  const NewOrder1 = useQuery(['getNewOrder'], getNewOrder, {
    refetchInterval: 2000,
  });
  console.log('data=-=-=-=-=-', route?.params?.data);
  console.log('NewOrder1=-=-=-=-=-', NewOrder1?.data?.data);

  useEffect(() => {
    if (NewOrder1.data?.res?.status === false) {
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabNavigation'}],
      });
    }
  }, [NewOrder1.data]);
  useEffect(() => {
    requestLocationPermission();
  }, []);
  const requestLocationPermission = async () => {
    // if (NewOrder1.data?.res?.status) {
    //   await Save_trip_id(JSON.stringify(NewOrder?.trip_id));
    // } else {
    //   await Save_trip_id('');
    // }
    const getProfile = await getMyprofileremote();
    if (getProfile?.data?.driver_name) {
      dispatch(saveuserInfo(getProfile?.data));
    }
    let permission = await acquireGPSPermission();
    if (permission.status) {
      const location = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
      });
      // getLocation();
    } else {
      errorBox('Kindly Give Permission To Access Location');
    }
    return null;
  };
  const isFetchingLocation = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      playCountRef.current = 0;
      const playLoop = () => {
        SoundPlayer.playAsset(require('../../assets/accept_notification.mp3'));
        playCountRef.current += 1;
        timeoutRef.current = setTimeout(playLoop, soundDuration);
      };
      playLoop();
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current!);
        }
      };
    }, []),
  );
  const handleAccept = async (id: any) => {
    setLoading(true);
    try {
      setLoadingTripId(id); // show loading only for this trip

      const locationEnabled = await DeviceInfo.isLocationEnabled();
      if (locationEnabled) {
        const location = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 20000,
        });

        if (id) {
          await Save_trip_id(JSON.stringify(id));
        } else {
          await Save_trip_id('');
        }
        const response = await getUpdate_trip_sts({
          trip_id: id,
          current_latitude: location.latitude,
          current_longitude: location.longitude,
          trip_status: 'booked',
        });
        if (response?.status) {
          setLoading(false);
          setLoadingTripId(id); 

          clearInterval(intervalRef.current);
          clearTimeout(timeoutRef.current);
          navigation.reset({
            index: 0,
            routes: [{name: 'AcceptOrder'}],
          });
        } else {
          setLoading(false);
          setLoadingTripId(id); 

        }
      } else {
        promptEnableLocationServices();

      }
    } catch (error) {
      setLoadingTripId(id); 

      // await Save_trip_id('');

      errorBox('Failed to get location or book trip');
    } finally {
      setLoading(false);
    }
  };
  const promptEnableLocationServices = () => {
    Alert.alert(
      'Enable Location Services',
      'Location services are disabled. Please enable them to continue.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Enable',
          onPress: () => {
            if (Platform.OS === 'ios') {
              setTimeout(() => {
                setTurnOnLoad(true);
              }, 2000);
              Linking.openURL('App-Prefs:root=Privacy&path=LOCATION');
            } else {
              setTimeout(() => {
                setTurnOnLoad(true);
              }, 2000);
              Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
              // Linking.openSettings();
            }
          },
        },
      ],
    );
  };
  const RefFuc = () => {
    requestLocationPermission();
  };
  if (NewOrder1?.isError) {
    navigation.reset({
      index: 0,
      routes: [{name: 'InitialScreen'}], // replace with your actual Home screen name
    });
  }

  return (
    <View style={[tailwind('h-full'), {}]}>
      {!NewOrder ? (
        <View
          style={[
            tailwind('bg-white rounded-xl mx-3 px-3 py-3'),
            {justifyContent: 'center', marginTop: '100%'},
          ]}>
          <ActivityIndicator color={'#FFD900'} size={'large'} />
        </View>
      ) : (
        <View style={[tailwind('h-full'), {}]}>
          <Text
            style={[tailwind(' font-bold text-lg font-22 text-center mt-5')]}>
            Hi New Booking Arrived
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={NewOrder1?.data?.data}
            renderItem={({item}) => (
              <View style={[tailwind(''), {}]}>
                <View
                  style={[
                    tailwind(`bg-white rounded-2xl shadow-md px-4 py-5 m-2`),
                  ]}>
                  <View
                    style={[
                      tailwind(`flex-row justify-between items-center mb-2`),
                    ]}>
                    <Text
                      style={[tailwind(`text-base font-bold text-gray-800`)]}>
                      {item.customer_name}
                    </Text>
                    <Text
                      style={[tailwind(`text-xs font-semibold text-gray-500`)]}>
                      #{item.trip_string}
                    </Text>
                  </View>

                  <View
                    style={[tailwind(`border-l-4 border-green-600 pl-3 mb-2`)]}>
                    <Text style={[tailwind(`text-xs text-gray-500`)]}>
                      Pickup
                    </Text>
                    <Text
                      style={[tailwind(`text-sm text-black`)]}
                      numberOfLines={2}>
                      {item.pickup_address}
                    </Text>
                  </View>

                  <View
                    style={[tailwind(`border-l-4 border-red-600 pl-3 mb-2`)]}>
                    <Text style={[tailwind(`text-xs text-gray-500`)]}>
                      Drop
                    </Text>
                    <Text
                      style={[tailwind(`text-sm text-black`)]}
                      numberOfLines={2}>
                      {item.drop_address}
                    </Text>
                  </View>

                  <View
                    style={[
                      tailwind(`flex-row justify-between items-center mt-2`),
                    ]}>
                    <Text style={[tailwind(`text-sm text-gray-700`)]}>
                      Fare:{' '}
                      <Text style={[tailwind(`font-semibold`)]}>
                        ₹{item.estimate_fare}
                      </Text>
                    </Text>
                    <Text style={[tailwind(`text-sm text-gray-700`)]}>
                      Distance: {item.distance} km
                    </Text>
                  </View>

                  <View
                    style={[
                      tailwind(`flex-row justify-between items-center mt-1`),
                    ]}>
                    <Text style={[tailwind(`text-sm text-gray-500`)]}>
                      {item.date} at {item.time}
                    </Text>
                    <Text style={[tailwind(`text-sm text-green-600`)]}>
                      {item.payment_mode_name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleAccept(item.trip_id)}
                    disabled={loading}
                    style={[tailwind(`mt-4 bg-secondary py-3 rounded-xl`)]}>
                    {loadingTripId === item.trip_id  ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text
                        style={[
                          tailwind(`text-black font-semibold text-center`),
                        ]}>
                        Accept Trip
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
      {TurnOnLoad && (
        <View style={[tailwind('')]}>
          <Text style={[tailwind('mt-3 font-semibold text-base')]}>
            Please ALLOW and TURN ON Location
          </Text>
          <View style={[tailwind(' flex-row justify-around mx-8 '), {top: 20}]}>
            <TouchableOpacity
              disabled={TurnOnLoad}
              style={[tailwind('flex-1  rounded-2xl bg-primary'), ,]}
              onPress={RefFuc}>
              <Text style={[tailwind('text-center p-4  text-white')]}>
                Turn On
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tailwind('flex-1 bg-red-500 rounded-2xl ml-2')]}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={[tailwind('text-center text-white p-4')]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
