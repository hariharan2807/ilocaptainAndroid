import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import tailwind from '@tailwind';
import {useSelector, useDispatch} from 'react-redux';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
// import tailwind from '@tailwind';
// import {TopBar} from '@sharedComponents';
import {useQuery} from 'react-query';
import Topbar from '../../sharedComponents/Topbar';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import assets_manifest from '@assets';
import Modal from 'react-native-modal';
import {
  Get_trip_id,
  removeToken,
  removeTokenUser,
} from '../../workers/localStorage';
import RNRestart from 'react-native-restart';
import {Redlog} from '../../constants/API_constants';
import {
  geRazorPayremote,
  getMyprofileremote,
  getNewOrder,
  getUpdate_online_sts,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {razorPayObjCreator} from '../../workers/orderObjCreator';
import RazorpayCheckout from 'react-native-razorpay';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import {ModalComp} from '@sharedComponents';
import {appControl, saveuserInfo} from '../../store/actions/userActions';

const log = console.log;

export default function UserProfileScreen() {
  const dispatch = useDispatch();
  const CartState = useSelector(state => state.user.user);
  const [LogModal, setLogModal] = useState(false);
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();
  const [polling, setPolling] = useState(true);
  const [popup, setpopup] = useState(false);
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [navigated, setNavigated] = useState(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const Response11 = useQuery(
    ['initiateTaxiAppControllRemote'],
    initiateAppControllRemote,
    // {refetchInterval: 2000},
  );
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const getProfile = await getMyprofileremote();
        const limit = Number(Response11?.data?.data?.admin_commission_limt);

        if (getProfile?.data?.admin_commision >= limit) {
          setpopup(true);
        } else {
          setpopup(false);
        }
      };

      fetchData();
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [TurnOnLoad]),
  );
  const List = [
    {
      name: 'KYC Verfication',
      img: assets_manifest?.verify,
      navigate: 'KYCVerficationScreen',
    },
    // {
    //   name: 'Training',
    //   img: assets_manifest?.user,
    //   navigate: 'TrainingScreen',
    // },
    // {
    //   name: 'Frequently Asked Questions',
    //   img: assets_manifest?.question,
    //   navigate: 'KYCVerficationScreen',
    // },
    {
      name: 'Earnings',
      img: assets_manifest?.dollar,
      navigate: 'EarningScreen',
    },
    {
      name: 'Withdrawl',
      img: assets_manifest?.credit,
      navigate: 'WithdrawlScreen',
    },
    // {
    //   name: 'Wallet Transcation',
    //   img: assets_manifest?.wallet,
    //   navigate: 'KYCVerficationScreen',
    // },
    {
      name: 'Notification',
      img: assets_manifest?.notification,
      navigate: 'NotificationScreen',
    },
    {
      name: 'About Us',
      img: assets_manifest?.info,
      navigate: 'TermsAndCondition',
      uri: 'https://ilodelivery.com/about_us/',
    },
    {
      name: 'Privacy Policy',
      img: assets_manifest?.file,
      navigate: 'TermsAndCondition',
      uri: 'https://ilodelivery.com/privacy-policy/',
    },
    // {
    //   name: 'Logout',
    //   img: assets_manifest?.logout,
    //   navigate: 'KYCVerficationScreen',
    // },
  ];
  const LogoutHandler = async () => {
    setLogModal(false);
    try {
      // const logout = await getLogoutRemote();
      // if (logout.status) {
      // await removePersistedUser();
      await removeTokenUser();
      setTimeout(() => {
        RNRestart.Restart();
      }, 500);

      // } else {
      //   throw 'Oops Logout Failed try again';
      // }
    } catch (err) {
      errorBox(`${err}`);
      Redlog('LogoutHandler ', err);
    }
  };
  const requestLocationPermission = async () => {
    const getProfile = await getMyprofileremote();
    const Response11 = await initiateAppControllRemote();
    if (Response11?.data) {
      dispatch(appControl(Response11?.data));
    } else {
      dispatch(appControl(null));
    }
    if (getProfile?.data) {
      setNavigated(getProfile?.data);
      dispatch(saveuserInfo(getProfile?.data));
    }
    let permission = await acquireGPSPermission();
    if (permission.status) {
      getLocation();
    } else {
      errorBox('Kindly Give Permission To Access Location');
    }
    return null;
  };
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
  const DriverStatus = async (status: any) => {
    const Response = await getUpdate_online_sts({
      online_status: status,
      current_latitude: location?.latitude,
      current_longitude: location?.longitude,
    });
    if (Response?.status) {
      if(status=="1"){
        infoBox('You are On Duty')
      }
      else{
        infoBox('You are Off Duty')

      }
      // infoBox('Status Updated');
    } else {
      errorBox(Response?.res?.message);
    }
  };
  const CancelStatus = (status: any) => {
    setpopup(false);
    DriverStatus(status);
  };
  const PayNow = async () => {
    setpopup(false);
    const Respose1 = await geRazorPayremote({
      amount: navigated?.admin_commision,
    });
    let rzOrder = razorPayObjCreator(
      Response11?.data?.data?.razorpay_key,
      navigated?.admin_commision,
      Respose1?.id,
      Respose1?.receipt,
    );
    RazorpayCheckout.open(rzOrder)
      .then(async (success: any) => {

        DriverStatus('1');
        // setSelected('1');
        /*
          paymentData = {
            razorpay_payment_id: "pay_29QQoUBi66xm2f",
            razorpay_order_id: "order_LZ12345678",
            razorpay_signature: "generated_signature"
          }
        */
      })
      .catch(error => {
        DriverStatus('0');
        // setSelected('2');
        // Show error UI or retry option
      });
  };
  return (
    <View style={tailwind('bg-white h-full')}>
      <ScrollView
        style={[tailwind(''), {}]}
        showsVerticalScrollIndicator={false}>
        <View style={[tailwind('items-center mt-5'), {}]}>
          {CartState?.driver_image != null ? (
            <Image
              style={[tailwind(''), {height: 70, width: 70, borderRadius: 70}]}
              source={{
                uri: `${CartState?.driver_image}`,
              }}
              defaultSource={assets_manifest?.react_logo}
            />
          ) : (
            <Image
              style={[tailwind(''), {height: 70, width: 70, borderRadius: 70}]}
              source={assets_manifest?.react_logo}
              defaultSource={assets_manifest?.react_logo}
            />
          )}
          <Text style={[tailwind('mt-2 text-black font-16 font-bold'), {}]}>
            {CartState?.driver_name}{' '}
          </Text>
          <Text style={[tailwind('mt-1 text-black'), {}]}>{CartState?.driver_email} </Text>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate('EditProfileScreen');
            }}
            style={[tailwind('px-5 py-3 bg-secondary mt-2 rounded-xl'), {}]}>
            <Text style={[tailwind('font-15 font-bold text-black'), {}]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[tailwind('py-3 px-3 bg-gray mt-5 text-black'), {}]}>More</Text>
          <View style={[tailwind('mt-3 '), {}]}>
            {List?.map((i: any, index: any) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate(i?.navigate, {uri: i?.uri});
                  }}
                  key={index}
                  style={[tailwind('px-3 py-3 flex-row'), {}]}>
                  <Image
                    source={i?.img}
                    style={[
                      tailwind(''),
                      {height: 20, width: 20, tintColor: 'black'},
                    ]}
                  />
                  <Text style={[tailwind('ml-3 text-black'), {}]}>{i?.name}</Text>
                  <View style={[tailwind(''), {marginLeft: 'auto'}]}>
                    <Entypo name="chevron-right" size={20} color={'black'} />
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setLogModal(true);
                // navigation?.navigate(i?.navigate, {uri: i?.uri});
              }}
              // key={index}
              style={[tailwind('px-3 py-3 flex-row'), {}]}>
              <Image
                source={assets_manifest?.logout}
                style={[
                  tailwind(''),
                  {height: 20, width: 20, tintColor: 'black'},
                ]}
              />
              <Text style={[tailwind('ml-3 text-black'), {}]}>Logout</Text>
              {/* <View style={[tailwind(''), {marginLeft: 'auto'}]}>
                    <Entypo name="chevron-right" size={20} color={'black'} />
                  </View> */}
            </TouchableOpacity>
          </View>
        </View>
        <View style={[tailwind('h-40'), {}]} />
      </ScrollView>
      <Modal
        backdropOpacity={0.15}
        style={[
          tailwind(' h-full items-center justify-center '),
          {backgroundColor: 'transparent'},
        ]}
        isVisible={LogModal}
        onBackButtonPress={() => {
          setLogModal(false);
        }}>
        <View
          style={[
            tailwind('rounded-tl-xl rounded-br-xl mx-3 items-center '),
            {backgroundColor: '#ffffff'},
          ]}>
          <Image
            resizeMode="contain"
            source={assets_manifest.react_logo}
            style={[
              tailwind('rounded-full bg-white font-bold mt-5 font-19'),
              {height: 150, width: 150, resizeMode: 'cover'},
            ]}
          />
          <Text
            numberOfLines={1}
            style={[
              tailwind(' text-black font-bold py-2  font-19'),
              {width: width / 1.2},
            ]}>
            Logout
          </Text>

          <Text
            numberOfLines={1}
            style={[
              tailwind('font-bold text-gray  py-3 mb-4 font-16'),
              {width: width / 1.2},
            ]}>
            Are You sure,You want to Logout ?
          </Text>

          <View
            style={[
              tailwind('  items-center justify-between rounded-xl px-3 py-3'),
              {},
            ]}>
            <TouchableOpacity
              onPress={LogoutHandler}
              style={[
                tailwind('rounded-xl my-2 bg-primary'),
                {backgroundColor: '#EB5757'},
                {width: width / 1.2},
              ]}>
              <Text
                style={[
                  tailwind('font-bold text-center py-3  text-white font-16'),
                ]}>
                Logout{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLogModal(false)}
              style={[
                tailwind('rounded-xl my-2 bg-secondary'),
                // {backgroundColor: '#EB5757'},
                {width: width / 1.2},
              ]}>
              <Text
                style={[
                  tailwind('font-bold text-center text-black py-3 font-16 '),
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ModalComp
        popup={popup}
        setpopup={setpopup}
        CancelStatus={CancelStatus}
        PayNow={PayNow}
        admin_commision={navigated?.admin_commision}

      />
    </View>
  );
}
