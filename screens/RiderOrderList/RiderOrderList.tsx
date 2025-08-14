import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import tailwind from '@tailwind';
// import {useSelector, useDispatch} from 'react-redux';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
// import tailwind from '@tailwind';
// import {TopBar} from '@sharedComponents';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import assets_manifest from '@assets';
import {ModalComp, TopBar} from '@sharedComponents';
import {TopHeader} from './block/TopHeader';
import {All} from './block/All';
import {RiderDetails} from '../../sharedComponents/RideDetails';
import {
  geRazorpayPaymentStatusremote,
  geRazorPayremote,
  getAllTripHistoryremote,
  getMyprofileremote,
  getUpdate_online_sts,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {razorPayObjCreator} from '../../workers/orderObjCreator';
import RazorpayCheckout from 'react-native-razorpay';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
const log = console.log;

export default function RiderOrderList() {
  const navigation = useNavigation();
  const route = useRoute();
  const [popup, setpopup] = useState(false);
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [navigated, setNavigated] = useState(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const [selected, setSelected] = useState(0);
  const CartState = useSelector(state => state.user.cart);
  const TopCategory = [
    {name: 'All', id: 0},
    // {name: 'UpComing', id: 1},
    {name: 'Completed', id: 2},
  ];
  const DataVal = [
    {
      drivername: 'carl',
      fare: 84,
      distance: '2 km',
      pickupAddress:
        'P. U. Chinnappa Nagar, Ashok Nagar, K L, K S Nagar, Pudukkottai, Tamil Nadu 622001',
      dropAddress:
        '9RPC+5C5, 867/2, N Main St, Melaraja Vidi, Brindavan, Pudukkottai, Tamil Nadu 622001',
      date: '10/04/2025',
      time: '10:50 am',
      status: 'completed',
      rating: 0,
    },
    {
      drivername: 'carl',
      fare: 84,
      distance: '2 km',
      pickupAddress:
        'P. U. Chinnappa Nagar, Ashok Nagar, K L, K S Nagar, Pudukkottai, Tamil Nadu 622001',
      dropAddress:
        '9RPC+5C5, 867/2, N Main St, Melaraja Vidi, Brindavan, Pudukkottai, Tamil Nadu 622001',
      date: '10/04/2025',
      time: '10:50 am',
      status: 'Cancelled',
      rating: 0,
    },
    {
      drivername: 'carl',
      fare: 84,
      distance: '2 km',
      pickupAddress:
        'P. U. Chinnappa Nagar, Ashok Nagar, K L, K S Nagar, Pudukkottai, Tamil Nadu 622001',
      dropAddress:
        '9RPC+5C5, 867/2, N Main St, Melaraja Vidi, Brindavan, Pudukkottai, Tamil Nadu 622001',
      date: '10/04/2025',
      time: '10:50 am',
      status: 'Cancelled',
      rating: 0,
    },
    {
      drivername: 'carl',
      fare: 84,
      distance: '2 km',
      pickupAddress:
        'P. U. Chinnappa Nagar, Ashok Nagar, K L, K S Nagar, Pudukkottai, Tamil Nadu 622001',
      dropAddress:
        '9RPC+5C5, 867/2, N Main St, Melaraja Vidi, Brindavan, Pudukkottai, Tamil Nadu 622001',
      date: '10/04/2025',
      time: '10:50 am',
      status: 'Cancelled',
      rating: 0,
    },
  ];
  const Response = useQuery(
    ['getAllTripHistoryremote'],
    getAllTripHistoryremote,
  );
  const activeTrips = Response?.data?.data?.GTS.filter(
    trip => trip.trip_status !== 'cancelled',
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
  const Response11 = useQuery(
    ['initiateTaxiAppControllRemote'],
    initiateAppControllRemote,
    // {refetchInterval: 2000},
  );
  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [TurnOnLoad]),
  );
  const requestLocationPermission = async () => {
    const getProfile = await getMyprofileremote();
    
    if (getProfile?.data) {
      setNavigated(getProfile?.data);
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
      infoBox('Status Updated');
    } else {
      errorBox(Response?.res?.message);
    }
  };
  const CancelStatus = (status: any) => {
    setpopup(false);
    DriverStatus(status);
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
          DriverStatus('1');
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
      console.error('Unexpected error in PayNow:', error);
    }
  };
  if (Response?.isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <View style={tailwind(' h-full')}>
      <TopBar title="My Rides" type={1} />
      <View
        style={[
          tailwind(
            'bg-white  flex-row mt-5 items-center  rounded-xl ml-3 mr-3',
          ),
          {justifyContent: 'space-between'},
        ]}>
        {TopCategory?.map((i: any, index: any) => {
          const isSelected = selected === i?.id;

          return (
            <TopHeader
              i={i}
              index={index}
              setSelected={setSelected}
              selected={selected}
            />
          );
        })}
      </View>
      <View
        style={[
          tailwind(' mt-3'),
          {display: selected === 0 ? 'flex' : 'none'},
        ]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Response?.data?.data?.GTS}
          renderItem={({item, index}) => (
            <RiderDetails
              index={index}
              drivername={item?.customer_name}
              fare={item?.total}
              distance={item?.distance}
              pickupAddress={item?.pickup_address}
              dropAddress={item?.drop_address}
              date={item?.date}
              time={item?.time}
              status={item?.trip_status}
              rating={item?.rating}
              trip_id={item?.trip_id}
            />
          )}
          ListFooterComponent={<View style={[tailwind('h-40'), {}]} />}
          // keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {/* <View style={[tailwind(''), {display: selected === 1 ? 'flex' : 'none'}]}>
        <FlatList
          contentContainerStyle={{height: '80%'}}
          data={!DataVal}
          renderItem={({item, index}) => (
            <RiderDetails
              index={index}
              drivername={item?.drivername}
              fare={item?.fare}
              distance={item?.distance}
              pickupAddress={item?.pickupAddress}
              dropAddress={item?.dropAddress}
              date={item?.date}
              time={item?.time}
              status={item?.status}
              rating={item?.rating}
              trip_id={item?.trip_id}
            />
          )}
          ListEmptyComponent={
            <View
              style={[
                tailwind('items-center h-full'),
                {justifyContent: 'center'},
              ]}>
              <Image
                source={assets_manifest?.folder}
                style={[
                  tailwind(''),
                  {height: 100, width: 100, resizeMode: 'contain'},
                ]}
              />
              <Text style={[tailwind('font-18 font-bold'), {}]}>
                No UpComing
              </Text>
            </View>
          }
          ListFooterComponent={<View style={[tailwind('h-40'), {}]} />}
          // keyExtractor={(item, index) => index.toString()}
        />
      </View> */}
      <View
        style={[
          tailwind(' mt-3'),
          {display: selected === 2 ? 'flex' : 'none'},
        ]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={activeTrips}
          renderItem={({item, index}) => (
            <RiderDetails
              index={index}
              drivername={item?.customer_name}
              fare={item?.total}
              distance={item?.distance}
              pickupAddress={item?.pickup_address}
              dropAddress={item?.drop_address}
              date={item?.date}
              time={item?.time}
              status={item?.trip_status}
              rating={item?.rating}
              trip_id={item?.trip_id}
            />
          )}
          ListFooterComponent={<View style={[tailwind('h-40'), {}]} />}
          // keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
