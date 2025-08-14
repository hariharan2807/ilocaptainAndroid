import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CalendarList} from 'react-native-calendars';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ModalComp, TopBar} from '@sharedComponents';
import tailwind from '@tailwind';
import assets_manifest from '@assets';
import {
  geRazorpayPaymentStatusremote,
  geRazorPayremote,
  getEarning,
  getMyprofileremote,
  getUpdate_online_sts,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import LottieView from 'lottie-react-native';
import {useQuery} from 'react-query';
import {useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {razorPayObjCreator} from '../../workers/orderObjCreator';
import RazorpayCheckout from 'react-native-razorpay';
export default function EarningScreen() {
  const {width} = Dimensions.get('window');
  const [popup, setpopup] = useState(false);
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [navigated, setNavigated] = useState(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  const [loading, setLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf('week'),
  );
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [earningData, setEarningData] = useState([]);

  const getWeekDates = () => {
    return [...Array(7)].map((_, i) =>
      moment(currentWeekStart).clone().add(i, 'days'),
    );
  };
  const getWeekMonthHeader = () => {
    const dates = getWeekDates();
    const firstMonth = dates[0].format('MMMM');
    const firstYear = dates[0].format('YYYY');
    const lastMonth = dates[6].format('MMMM');
    const lastYear = dates[6].format('YYYY');

    if (firstMonth === lastMonth && firstYear === lastYear) {
      return `${firstMonth} ${firstYear}`;
    }

    if (firstYear === lastYear) {
      return `${firstMonth} / ${lastMonth} ${firstYear}`;
    }

    return `${firstMonth} ${firstYear} / ${lastMonth} ${lastYear}`;
  };

  const nextWeek = () => {
    setCurrentWeekStart(prev => moment(prev).add(1, 'week'));
  };

  const prevWeek = () => {
    setCurrentWeekStart(prev => moment(prev).subtract(1, 'week'));
  };
  useEffect(() => {
    Response();
  }, [selectedDate]);
  const Response = async () => {
    setLoading(true);
    const Res = await getEarning({
      date: selectedDate,
    });
    setLoading(false);
    if (Res?.status) {
      setLoading(false);
      setEarningData(Res?.data);
    } else {
      setLoading(false);
      setEarningData([]);
    }
  };
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
          // DriverStatus('1');
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
  if (loading) {
    return (
      <View style={[tailwind('flex-1 justify-center items-center')]}>
        <LottieView
          source={require('../../assets/gif/load.json')}
          autoPlay
          loop
          style={{width: 80, height: 80}}
        />
      </View>
    );
  }
  return (
    <View>
      <TopBar title="Earnings" type={1} bg={'#FFD900'} />
      <View style={{backgroundColor: '#FFD900', paddingVertical: 16}}>
        {/* Dynamic Month Header */}
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {getWeekMonthHeader()}
        </Text>

        {/* Week Navigation */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingHorizontal: 10,
          }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={prevWeek}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>

          {/* 7 Days of Week */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            {getWeekDates().map(dateObj => {
              const dateStr = dateObj.format('YYYY-MM-DD');
              const isSelected = dateStr === selectedDate;

              return (
                <TouchableOpacity
                  key={dateStr}
                  onPress={() => setSelectedDate(dateStr)}
                  style={{
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={{color: 'black', fontStyle: 'italic', fontSize: 12}}>
                    {dateObj.format('ddd').toUpperCase()}
                  </Text>
                  <View
                    style={{
                      marginTop: 4,
                      borderRadius: 50,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: 'black',
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'black', fontSize: 16}}>
                      {dateObj.format('D')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Right Arrow */}
          <TouchableOpacity onPress={nextWeek}>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          tailwind('flex-row ml-3 mr-3 mt-5'),
          {justifyContent: 'space-between'},
        ]}>
        {earningData?.weekly_earnings && (
          <View
            style={[
              tailwind('bg-white px-3 py-5 rounded-xl items-center'),
              {width: '48%'},
            ]}>
            <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
              Weekly Earning{' '}
            </Text>
            <Text style={[tailwind('font-20 mt-3 font-bold text-black'), {}]}>
              ₹{Math.round(earningData?.weekly_earnings)}{' '}
            </Text>
          </View>
        )}
        {earningData?.monthly_earnings && (
          <View
            style={[
              tailwind('bg-white px-3 py-5 rounded-xl items-center'),
              {width: '48%'},
            ]}>
            <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
              Monthly Earning{' '}
            </Text>
            <Text style={[tailwind('font-20 mt-3 font-bold text-black'), {}]}>
              ₹{Math.round(earningData?.monthly_earnings)}
            </Text>
          </View>
        )}
      </View>
      <View style={[tailwind('ml-3 mr-3'), {}]}>
        {earningData?.total_earnings && (
          <View
            style={[
              tailwind('bg-white px-3 mt-5  py-5 rounded-xl items-center'),
              {width: '100%'},
            ]}>
            <Text style={[tailwind('font-16 mt-1 font-bold text-gray'), {}]}>
              Total Earning{' '}
            </Text>
            <Text style={[tailwind('font-24 mt-3 font-bold text-black'), {}]}>
              ₹{Math.round(earningData?.total_earnings)}{' '}
            </Text>
          </View>
        )}
      </View>
      <View
        style={[
          tailwind('ml-3 mr-3 mt-5 bg-white rounded-xl'),
          {height: '40%'},
        ]}>
        <Text style={[tailwind('px-5 mt-3 mb-3 font-15 text-gray'), {}]}>
          Trip Histories
        </Text>
        <FlatList
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
          data={earningData?.GTS}
          ListEmptyComponent={
            <View
              style={[tailwind('items-center'), {justifyContent: 'center'}]}>
              <Image
                source={assets_manifest?.corrupted}
                style={[
                  tailwind('items-center'),
                  {
                    justifyContent: 'center',
                    height: 100,
                    width: 100,
                    resizeMode: 'contain',
                  },
                ]}
              />
              <Text style={[tailwind('mt-3 font-15 text-gray font-bold'), {}]}>
                Sorry no Data found
              </Text>
            </View>
          }
          renderItem={({item, index}) => {
            return (
              <View
                style={[tailwind('flex-row px-3 py-3 items-center'), {}]}
                key={index}>
                <Image
                  source={assets_manifest?.distance}
                  style={[tailwind(''), {height: 25, width: 25}]}
                />
                <View style={[tailwind('ml-3'), {}]}>
                  <Text style={[tailwind('font-semibold font-15  text-black'), {}]}>
                    {item?.trip_string}
                  </Text>
                  <Text
                    style={[tailwind('font-bold mt-2 font-13 text-black'), {}]}>
                    {item?.time}
                  </Text>
                </View>
                <View style={[tailwind(''), {marginLeft: 'auto'}]}>
                  <Text style={[tailwind('font-semibold font-15 text-black'), {}]}>
                    ₹{item?.total}
                  </Text>
                </View>
              </View>
            );
          }}
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
