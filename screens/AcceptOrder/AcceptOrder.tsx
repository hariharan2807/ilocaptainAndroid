import {TopBar} from '@sharedComponents';
import tailwind from '@tailwind';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {AtPoint} from './Block/AtPoint';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Get_trip_id, Removetrip_id} from '../../workers/localStorage';
import {
  geGetMessageremote,
  geQrremote,
  Get_Single_trip,
  getMyprofileremote,
  getRiderCancelList,
  getUpdate_trip_sts,
} from '../../remote/userRemote';
import {saveuserInfo} from '@actions/userActions';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import RNRestart from 'react-native-restart';
import haversine from 'haversine-distance';

export default function AcceptOrder() {
  const {height} = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const MAP_HEIGHT = height / 1;
  const mapRef = useRef(null);
  const OpenRef = useRef<Modalize>(null);
  const [otp, setOtp] = useState('');
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const [droplocation, setDropLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const [distance, setDistance] = useState(null);
  const [polling, setPolling] = useState(true);
  const [qr, setQr] = useState(null);

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Example drop location (Chennai)

  const Reson = useQuery(['getRiderCancelList'], getRiderCancelList);

  const Call = () => {
    Linking.openURL(`tel:${data?.customer_phone_number}`);
  };
  const GetMessage = useQuery(
    ['geGetMessageremote', data?.user_id, data?.driver_id],
    geGetMessageremote,
    {refetchInterval: 3000},
  );
  useFocusEffect(
    useCallback(() => {
      Single_trip();

      const timer = setTimeout(() => {
        OpenRef.current?.open();
      }, 500);

      return () => {
        clearTimeout(timer); // Cleanup on blur
      };
    }, []),
  );
  useEffect(() => {
    Single_trip();
    DataVAlue(data?.trip_id);
  }, [status]);
  useEffect(() => {
    let interval = null;

    if (polling) {
      interval = setInterval(() => {
        Single_trip();
      }, 5000); // every 1 second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  useEffect(() => {
    const handleCompletedStatus = async () => {
      if (status === 'completed') {
        await Removetrip_id();
        RNRestart.Restart();
      }
    };

    handleCompletedStatus();
  }, [status]);

  useEffect(() => {
    if (
      location.latitude !== 0 &&
      droplocation.latitude !== 0 &&
      mapRef.current
    ) {
      const dist = haversine(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          latitude: droplocation.latitude,
          longitude: droplocation.longitude,
        },
      );

      // setDistance((dist / 1000).toFixed(2)); // Convert to KM & round

      // Delay fitToCoordinates to ensure MapView is rendered
      // setTimeout(() => {
      //   mapRef.current?.fitToCoordinates([location, droplocation], {
      //     edgePadding: {top: 300, right: 100, bottom: 300, left: 50},
      //     animated: true,
      //   });
      //   // mapRef.current?.animateToRegion(location, 500);
      // }, 500);
    }
  }, [location, droplocation]);

  const Single_trip = async () => {
    // setLoading(true);
    const Data = await Get_trip_id();
    const Response = await Get_Single_trip({
      trip_id: Data,
    });
    if (Response?.status) {
      setData(Response?.data);
      setStatus(Response?.data?.trip_status);
      if (Response?.data?.trip_status === 'cancelled') {
        setPolling(false); // stop further API calls

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'InitialScreen'}], // replace with your actual Home screen name
          });
        }, 1000);

        return;
      }
      const lat = parseFloat(Response?.data?.drop_latitude);
      const lon = parseFloat(Response?.data?.drop_longitude);
      const plat = parseFloat(Response?.data?.pickup_latitude);
      const plon = parseFloat(Response?.data?.pickup_longitude);
      if (
        !isNaN(lat) &&
        !isNaN(lon) &&
        lat !== 0 &&
        lon !== 0 &&
        !isNaN(plat) &&
        !isNaN(plon) &&
        plat !== 0 &&
        plon !== 0
      ) {
        setLocation({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0065,
          longitudeDelta: 0.0065,
        });
        setDropLocation({
          latitude: plat,
          longitude: plon,
          latitudeDelta: 0.0065,
          longitudeDelta: 0.0065,
        });
      } else {
      }
      // setLoading(false);

      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'AcceptOrder'}],
      // });
    } else {
      setData({});
      setLoading(false);
    }
  };
  const OpenGoogleMap = () => {
    if (data?.trip_status == 'booked') {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data?.pickup_latitude},${data?.pickup_longitude}&travelmode=driving`;

      // const url = `google.navigation:q=${data?.pickup_latitude},${data?.pickup_longitude}&mode=d`;

      Linking.openURL(url);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data?.drop_latitude},${data?.drop_longitude}&travelmode=driving`;
      Linking.openURL(url);

    }
  };
  const Valididation = () => {
    if (!otp) {
      return errorBox('Please Enter OTP');
    } else if (otp != '1234') {
      return errorBox('Mismatch OTP');
    } else {
      infoBox('OTP Verfied');
      setStatus('trip_started');
    }
  };
  const updateTripStatus = async () => {
    setLoading(true);

    const Data = await Get_trip_id();

    // OTP validation
    if (status === 'pickup_location_reached') {
      if (!otp) {
        setError('Please Enter OTP');
        errorBox('Please Enter OTP');
        setLoading(false);
        return;
      }
      // else if (otp !== '1234') {
      //   setError('Missmatch OTP');
      //   errorBox('Mismatch OTP');
      //   setLoading(false);
      //   return;
      // }
      else {
        setError('');

        // infoBox('OTP Verified');
      }
    }
    try {
      // ✅ Ensure location permission + fetch location
      const permission = await acquireGPSPermission();
      if (!permission.status) {
        errorBox('Kindly Give Permission To Access Location');
        setLoading(false);
        return;
      }

      const locationEnabled = await DeviceInfo.isLocationEnabled();
      if (!locationEnabled) {
        errorBox('Location is turned off');
        setLoading(false);
        return;
      }

      const currentLocation = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      // ✅ Now call API with actual coordinates
      const Response = await getUpdate_trip_sts({
        trip_id: Data,
        current_latitude: currentLocation.latitude,
        current_longitude: currentLocation.longitude,
        trip_status:
          status === 'booked'
            ? 'pickup_location_reached'
            : status === 'pickup_location_reached'
            ? 'trip_started'
            : status === 'trip_started'
            ? 'drop_location_reached'
            : 'completed',
        ...(status === 'pickup_location_reached' && {otp: Number(otp)}),
      });

      if (Response?.status) {
        infoBox('Success');
        Single_trip(); // Refresh or navigate
      } else {
        setError(Response?.res?.message);
        errorBox(Response?.res?.message);
      }
    } catch (error) {
      errorBox('Failed to fetch location');
    }

    setLoading(false);
  };
  const DataVAlue = async (trip_id: any) => {
    const Response = await geQrremote({trip_id: trip_id});
    if (Response?.status) {

      setQr(Response?.data?.data);
    } else {
      setQr(null);
    }
  };
  return (
    <View style={[tailwind('h-full '), {}]}>
      {/* {data?.pickup_longitude ? ( */}
      {droplocation?.latitude != 0 ? (
        <MapView
          ref={mapRef}
          style={{height: MAP_HEIGHT}}
          region={droplocation} // Use `region` instead of `initialRegion`
          zoomEnabled={true}
          zoomControlEnabled={true}
          showsUserLocation={false}
          showsMyLocationButton={true}
          loadingEnabled={true}>
          {/* {location.latitude !== 0 && location.longitude !== 0 && (
            <Marker
              coordinate={location}
              title="Pickup Location"
              description="This is your starting point"
              pinColor="green"
            />
          )} */}

          {/* {droplocation.latitude !== 0 && droplocation.longitude !== 0 && (
            <Marker
              coordinate={droplocation}
              title="Drop Location"
              description="This is your destination"
              pinColor="red"
            />
          )} */}

          {/* {location.latitude !== 0 && droplocation.latitude !== 0 && (
            <Polyline
              coordinates={[location, droplocation]}
              strokeColor="blue"
              strokeWidth={3} // Important!
              lineDashPattern={[5, 5]}
            />
          )} */}
        </MapView>
      ) : (
        <ActivityIndicator size={'small'} color={'yellow'} />
      )}

      {/* ) : (
        <ActivityIndicator size={'large'} color={'green'} />
      )} */}
      <View
        style={[
          tailwind('bg-white h-full'),
          {borderTopLeftRadius: 15, borderTopRightRadius: 15},
        ]}>
        <Portal>
          <Modalize
            ref={OpenRef}
            modalTopOffset={300}
            adjustToContentHeight={true}
            onBackButtonPress={() => {
              if (OpenRef?.current) {
                OpenRef.current.open();
              }
              return true;
            }}
            panGestureEnabled={false}
            handleStyle={{
              width: 40,
              height: 5,
              backgroundColor: '#ccc',
              borderRadius: 2.5,
              alignSelf: 'center',
              marginTop: 30,
            }}
            closeOnOverlayTap={false}>
            <View style={[tailwind('mb-3'), {}]}>
              <AtPoint
                pickup_address={data?.pickup_address}
                distance={data?.distance}
                trip_type={data?.service_name}
                fare={data?.estimate_fare}
                tax={data?.tax}
                coupon_amount={data?.coupon_amount}
                total={data?.total}
                OpenGoogleMap={OpenGoogleMap}
                setStatus={setStatus}
                Call={Call}
                status={status}
                dropAddress={data?.drop_address}
                setOtp={setOtp}
                otp={otp}
                Valididation={Valididation}
                navigation={navigation}
                updateTripStatus={updateTripStatus}
                Reson={Reson?.data?.data}
                setSelected={setSelected}
                selected={selected}
                loading={loading}
                setLoading={setLoading}
                trip_id={data?.trip_id}
                location={location}
                error={error}
                payment_mode_name={data?.payment_mode_name}
                qr={qr}
                OpenRef={OpenRef}
                user_id={data?.user_id}
                driver_id={data?.driver_id}
                GetMessage={GetMessage?.data?.data}
              />
            </View>
          </Modalize>
        </Portal>
      </View>
    </View>
  );
}
