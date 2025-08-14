import tailwind from '@tailwind';
import {View, Text, FlatList, Alert, Platform, Linking} from 'react-native';
import React, {useCallback, useState} from 'react';
import {ModalComp, TopBar} from '@sharedComponents';
import {RiderDetails} from '../../sharedComponents/RideDetails';
import {useQuery} from 'react-query';
import {
  geRazorpayPaymentStatusremote,
  geRazorPayremote,
  getMyprofileremote,
  getTodayTripremote,
  getUpdate_online_sts,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
import {useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {razorPayObjCreator} from '../../workers/orderObjCreator';
import RazorpayCheckout from 'react-native-razorpay';
export default function MyRides() {
  const [popup, setpopup] = useState(false);
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [navigated, setNavigated] = useState(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const Response = useQuery(['getTodayTripremote'], getTodayTripremote);
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
      console.error(" Unexpected error in PayNow:", error);
    }
  };
  if (Response?.isLoading) {
    return <FullScreenLoading />;
  }
  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="Today Rides" type={1} />
      <View style={[tailwind('mt-5 '), {}]}>
        <FlatList
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
          ListFooterComponent={<View style={[tailwind('h-20'), {}]} />}
          keyExtractor={(item, index) => index.toString()}
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
