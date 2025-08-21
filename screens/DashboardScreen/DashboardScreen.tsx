import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  Image,
} from 'react-native';
import tailwind from '@tailwind';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {
  geRazorpayPaymentStatusremote,
  geRazorPayremote,
  geSchedlueremote,
  Get_Single_trip,
  getDashboard,
  getMyprofileremote,
  getNewOrder,
  getUpdate_online_sts,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import {HomeScreenFloating} from './block/HomeScreenFloating';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import TopView from './block/TopView';
import {appControl, saveuserInfo} from '@actions/userActions';
import {useDispatch, useSelector} from 'react-redux';
import {Get_trip_id, Save_trip_id} from '../../workers/localStorage';
import {razorPayObjCreator} from '../../workers/orderObjCreator';
import RazorpayCheckout from 'react-native-razorpay';
import {ModalComp} from '@sharedComponents';
import store from '../../store';
import Modal from 'react-native-modal';
import assets_manifest from '@assets';
import OneSignal from 'react-native-onesignal';
import {PERMISSIONS, request} from 'react-native-permissions';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const {height} = useWindowDimensions();
  const dispatch = useDispatch();
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [locationOn, setLocationOn] = useState(false);

  const CartState = useSelector(state => state.user.user);
  const UserInfo = store.getState().user.userInfo;
  const AppControll = store.getState().user.appcontrol;
  const MAP_HEIGHT = height * 1;
  const DEFAULT_LATITUDE = 28.6139;
  const DEFAULT_LONGITUDE = 77.209;
  const DEFAULT_DELTA = 0.01;
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const [selected, setSelected] = useState('1');
  const [navigated, setNavigated] = useState(null);
  const [polling, setPolling] = useState(true);
  const [popup, setpopup] = useState(false);
  const [scheduled, setscheduled] = useState(false);
  const mapRef = useRef(null);
  const Response11 = useQuery(
    ['initiateTaxiAppControllRemote'],
    initiateAppControllRemote,
    {refetchInterval: 2000},
  );
  const SchedlewOrder = useQuery(['geSchedlueremote'], geSchedlueremote);
  // console.log('CartState', CartState);

  useFocusEffect(
    useCallback(() => {
      let interval = null;

      if (polling) {
        interval = setInterval(() => {
          NewOrder();
        }, 3000);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [polling]),
  );
  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [TurnOnLoad, locationOn]),
  );
  useEffect(() => {
    requestLocationPermission();
  }, [locationOn]);
  const requestLocationPermission = async () => {
    const getProfile = await getMyprofileremote();
    const Response11 = await initiateAppControllRemote();
    if (Response11?.data) {
      dispatch(appControl(Response11?.data));
    } else {
      dispatch(appControl(null));
    }

    setNavigated(getProfile?.data);
    console.log(
      'getProfile?.data?.driver_online_status',
      getProfile?.data?.driver_online_status,
    );
    if (getProfile?.data?.driver_online_status == '0') {
      setSelected('2');
      errorBox('You are Off Duty');
    } else {
      setSelected('1');
    }
    if (getProfile?.data?.driver_name) {
      dispatch(saveuserInfo(getProfile?.data));
    }
    let permission = await acquireGPSPermission();

    if (permission.status) {
      setLocationOn(false);
      getLocation();
    } else {
      setLocationOn(true);
      // getLocation();
      // errorBox('Kindly Give Permission To Access Location');
    }
    return null;
  };
  const acquireGPSPermissionData = async () => {
    let result;
    if (Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    return result;
  };
  const openIOSLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=Privacy&path=LOCATION');
    } else {
      // Android
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    }
  };
  // const Loc = async () => {
  //   if (Platform.OS === 'ios') {
  //     Linking.openURL('app-settings:'); // opens app's settings, includes Notifications
  //   } else {
  //     Linking.openSettings();
  //   }
  //   //     let permission = await acquireGPSPermission();
  //   // console.log("permissionpermissionpermissionpermission",permission)
  //   //     if (permission.status) {
  //   //       setLocationOn(false);
  //   //       getLocation();
  //   //     } else {
  //   //       setLocationOn(true);
  //   //       // getLocation();
  //   //       // errorBox('Kindly Give Permission To Access Location');
  //   //     }
  // };
  const getLocation = async () => {
    try {
      const locationEnabled = await DeviceInfo.isLocationEnabled();
      if (locationEnabled) {
        const currentLocation = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        setLocation({
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          latitudeDelta: 0.0065,
          longitudeDelta: 0.0065,
        });
      } else {
        promptEnableLocationServices();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const NewOrder = async () => {
    try {
      const response = await getNewOrder();
      const profileResponse = await getMyprofileremote();
      if (profileResponse?.data) {
        setNavigated(profileResponse?.data);
      } else {
        setNavigated(null);
      }
      const limit = Number(AppControll?.admin_commission_limt);
      if (profileResponse?.data?.admin_commision >= limit) {
        setpopup(true);
      } else {
        setpopup(false);
        if (response?.data) {
          navigation.reset({
            routes: [
              {
                name: 'NewOrder',
                params: {data: response.data},
              },
            ],
          });
          setPolling(false);
        } else {
          Single_trip();
        }
      }
    } catch (error) {
      console.error('Error in NewOrder:', error);
    }
  };

  const Single_trip = async () => {
    try {
      const Data = await Get_trip_id();
      if (!Data) {
        console.log('No trip ID found');
        return;
      }
      const Response = await Get_Single_trip({trip_id: Data});
      if (!Response?.status || !Response?.data) {
        return;
      }
      const tripStatus = Response.data.trip_status?.toLowerCase();
      const invalidStatuses = ['completed', 'cancelled', 'pending'];
      if (tripStatus && !invalidStatuses.includes(tripStatus)) {
        navigation.reset({
          routes: [{name: 'AcceptOrder'}],
        });
      } else {
        console.log('Trip is in invalid status:', tripStatus);
      }
    } catch (err) {
      console.error('Single_trip error:', err);
    }
  };

  const DriverStatus = async (status: any) => {
    const Response = await getUpdate_online_sts({
      online_status: status,
      current_latitude: location?.latitude,
      current_longitude: location?.longitude,
    });
    if (Response?.status) {
      if (status == '1') {
        infoBox('You are On Duty');
      } else {
        infoBox('You are Off Duty');
      }
      // infoBox('Status Updated');
    } else {
      errorBox(Response?.res?.message);
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

  const PayNow = async () => {
    try {
      setpopup(false);
      let razorpayOrderId = null;
      const Respose1 = await geRazorPayremote({
        amount: navigated?.admin_commision,
      });
      razorpayOrderId = Respose1.id;
      const rzOrder = razorPayObjCreator(
        Response11?.data?.data?.razorpay_key,
        navigated?.admin_commision,
        razorpayOrderId,
        Respose1?.receipt,
      );
      RazorpayCheckout.open(rzOrder)
        .then(async (success: any) => {
          await geRazorpayPaymentStatusremote({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: success.razorpay_payment_id,
            status: 'true',
          });
        })
        .catch(async (err: any) => {
          const obj = {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: err?.razorpay_payment_id ?? null,
            status: 'false',
          };
          await geRazorpayPaymentStatusremote(obj);
        });
    } catch (error) {
      console.error(' Unexpected error in PayNow:', error);
    }
  };

  const CancelStatus = (status: any) => {
    setPolling(false);
    setpopup(false);
    setSelected('2');
    DriverStatus(status);
  };
  const Confirm = async (id: any) => {
    setscheduled(false);
    await Save_trip_id(JSON.stringify(id));
    navigation.reset({
      routes: [{name: 'AcceptOrder'}],
    });
  };
  useEffect(() => {
    if (CartState?.driver_id) {
      try {
        const driverId = String(CartState.driver_id);
        const phone = String(CartState.driver_phone_number ?? '');
        const name = String(CartState.driver_name ?? '');
        const email = String(CartState.driver_email ?? '');
        OneSignal.sendTag('user_name', name);
        OneSignal.setEmail('email', email);
        OneSignal.setExternalUserId(`${driverId}`);
        // if (driverId) {
        //   OneSignal.login(driverId);
        // }

        // if (email) {
        //   OneSignal.User.addEmail(email);
        // }
        // if (phone) {
        //   OneSignal.User.addSms(phone);
        // }
        // if (name) {
        //   OneSignal.User.addTag('user_name', name);
        // }
        // if (email) {
        //   OneSignal.User.addTag('user_mail', email);
        // }
      } catch (error) {
        console.error('OneSignal setup error:', error);
      }
    }
  }, [CartState?.driver_id]);
  if (locationOn) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Text
          style={[
            tailwind('font-17 text-center'),
            {marginBottom: 20, width: '70%'},
          ]}>
          ⚠️ Location Permission Required New orders cannot be received if
          Location is turned off. Please enable Location Services to continue
          using the app.
        </Text>
        <TouchableOpacity
          onPress={openIOSLocationSettings}
          style={[tailwind('bg-secondary'), {padding: 12, borderRadius: 8}]}>
          <Text style={{color: 'black'}}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={tailwind(' h-full')}>
      {location?.latitude && location?.longitude ? (
        <MapView
          ref={mapRef}
          style={{height: MAP_HEIGHT}}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: location?.latitudeDelta,
            longitudeDelta: location?.longitudeDelta,
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={false}
          loadingEnabled={true}
        />
      ) : (
        <View
          style={[
            tailwind('items-center'),
            {justifyContent: 'center', height: MAP_HEIGHT},
          ]}>
          <ActivityIndicator color={'#FFD900'} size={'large'} />
        </View>
      )}
      <View
        style={[tailwind(' w-full px-5'), {position: 'absolute', bottom: 90}]}>
        <View style={[tailwind('bg-secondary  rounded-xl'), {}]}>
          <HomeScreenFloating
          // total_km={Response?.data?.data?.data?.total_km}
          // total_earnings={Response?.data?.data?.data?.total_earnings}
          // total_rides={Response?.data?.data?.data?.total_rides}
          />
        </View>
      </View>
      <View
        style={[
          tailwind(' w-full px-5'),
          {position: 'absolute', bottom: 0, top: 20},
        ]}>
        <View style={[tailwind('bg-white  rounded-xl'), {}]}>
          <TopView
            setSelected={setSelected}
            selected={selected}
            DriverStatus={DriverStatus}
            admin_commission_limt={
              Response11?.data?.data?.admin_commission_limt
            }
            user_admin_commision={navigated?.admin_commision}
            setscheduled={setscheduled}
            SchedlewOrder={SchedlewOrder?.data?.data}
          />
        </View>
      </View>
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
      <ModalComp
        popup={popup}
        setpopup={setpopup}
        CancelStatus={CancelStatus}
        PayNow={PayNow}
        admin_commision={navigated?.admin_commision}
      />
      <Modal
        isVisible={scheduled}
        animationInTiming={150}
        animationOutTiming={150}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setscheduled(false)}>
        <View
          style={[
            tailwind('bg-white rounded-2xl p-5'),
            {
              // alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <View
            style={[tailwind('flex-row'), {justifyContent: 'space-between'}]}>
            <Text style={[tailwind('font-bold mb-3 font-18 text-black'), {}]}>
              Scheduled Order
            </Text>
            <TouchableOpacity
              onPress={() => {
                setscheduled(false);
              }}
              style={[tailwind(''), {}]}>
              <Image
                source={assets_manifest?.close}
                style={[
                  tailwind(''),
                  {
                    height: 20,
                    width: 20,
                    // position: 'absolute',
                    // top: -10,
                    // right: 1,
                    marginLeft: 'auto',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {SchedlewOrder?.data?.data?.map((i: any, index: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Confirm(i?.trip_id);
                }}
                style={[
                  tailwind('bg-white white-shadow rounded-2xl my-2 p-3'),
                  {
                    // alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <View
                  style={[
                    tailwind('flex-row mt-2 mb-2'),
                    {justifyContent: 'space-between'},
                  ]}>
                  <View>
                    <Text
                      style={[tailwind('font-bold font-15 text-black'), {}]}>
                      Order Id
                    </Text>
                    <Text
                      style={[
                        tailwind('font-medium mt-1 font-15 text-black'),
                        {},
                      ]}>
                      {i?.trip_string}
                    </Text>
                  </View>
                  <View style={[tailwind('items-center'), {}]}>
                    <Text
                      style={[
                        tailwind('font-bold font-15 text-black'),
                        {marginLeft: 'auto'},
                      ]}>
                      Time
                    </Text>
                    <Text
                      style={[
                        tailwind('font-medium  mt-1 font-15 text-black'),
                        {marginLeft: 'auto'},
                      ]}>
                      {i?.time}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    tailwind('mt-2 mb-2'),
                    {height: 2, width: '100%', backgroundColor: '#F5F5F5'},
                  ]}
                />
                <View
                  style={[
                    tailwind('flex-row'),
                    {justifyContent: 'space-between'},
                  ]}>
                  <View>
                    <Text
                      style={[tailwind('font-bold font-15 text-black'), {}]}>
                      Distance
                    </Text>
                    <Text
                      style={[
                        tailwind('font-medium mt-1 font-15 text-black'),
                        {},
                      ]}>
                      {i?.distance} Km
                    </Text>
                  </View>
                  <View style={[tailwind(''), {marginLeft: 'auto'}]}>
                    <Text
                      style={[
                        tailwind('font-bold font-15 text-black'),
                        {marginLeft: 'auto'},
                      ]}>
                      Amount
                    </Text>
                    <Text
                      style={[
                        tailwind('font-medium  mt-1 font-15 text-black'),
                        {marginLeft: 'auto'},
                      ]}>
                      {i?.estimate_fare} Rs
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
