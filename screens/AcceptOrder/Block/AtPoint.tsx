import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tailwind from '@tailwind';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OTPInput from './OTPInput';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useQuery} from 'react-query';
import {
  geGetMessageremote,
  getResonUpdate,
  getUpdate_trip_sts,
  initiateTaxiCancel_ResontripRemote,
} from '../../../remote/userRemote';
import {ChecboxoutLine, CheckBox} from '../../../assets/icons';
import {acquireGPSPermission, errorBox} from '../../../workers/utils';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';

interface prototype {
  pickup_address: string;
  distance: string;
  trip_type: string;
  fare: string;
  setStatus: any;
  status: any;
  OpenGoogleMap: () => any;
  Call: () => any;
  dropAddress: string;
  setOtp: any;
  otp: string;
  Valididation: () => any;
  navigation: any;
  updateTripStatus: () => any;
  Reson: [];
  selected: any;
  setSelected: any;
  loading: boolean;
  setLoading: any;
  tax: any;
  coupon_amount: any;
  total: any;
  trip_id: number;
  location: any;
  error: any;
  payment_mode_name: string;
  qr: any;
  OpenRef: any;
  user_id: any;
  driver_id: any;
  GetMessage: any;
}
export const AtPoint = (props: prototype) => {
  const [openModal, setOpenModal] = useState(false);
  const [selected1, setSelected1] = useState('');
  // const Qr=useQuery(['geQrremote',props?.trip_id],geQrremote)

  useEffect(() => {
    if (props?.selected) {
      setSelected1('');
    }
    // Data();
  }, [props?.selected]);

  // 2️⃣ When user types into input, clear checkbox selection
  useEffect(() => {
    if (selected1?.length > 0 && props?.selected) {
      props?.setSelected(null);
    }
  }, [selected1]);
  const CancelReson = async () => {
    props?.setLoading(true);
    const permission = await acquireGPSPermission();
    if (!permission.status) {
      errorBox('Kindly Give Permission To Access Location');
      props?.setLoading(false);
      return;
    }
    const locationEnabled = await DeviceInfo.isLocationEnabled();
    if (!locationEnabled) {
      errorBox('Location is turned off');
      props?.setLoading(false);
      return;
    }
    const currentLocation = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    try {
      const reasonResponse = await getResonUpdate({
        trip_id: props?.trip_id,
        reason_id: props?.selected ? props?.selected?.cancel_reason_id : 0,
        custom_reason: selected1,
      });
      if (!reasonResponse?.data?.status) {
        props?.setLoading(false);
        setOpenModal(true);
        errorBox('Invalid Cancel Reason');
        return;
      }

      const updateResponse = await getUpdate_trip_sts({
        trip_id: props?.trip_id,
        current_latitude: currentLocation.latitude,
        current_longitude: currentLocation.longitude,
        trip_status: 'cancelled',
      });
      props?.setLoading(false);
      if (updateResponse?.status) {
        setTimeout(() => {
          props?.navigation?.reset({
            index: 0,
            routes: [{name: 'BottomTabNavigation'}],
          });
        }, 500);
      } else {
        errorBox('Error while updating trip status');
      }
    } catch (error) {
      props?.setLoading(false);
      errorBox('Something went wrong');
    }
  };
  const Onpress = () => {
    props?.OpenRef?.current.close();
    props?.navigation.navigate('MessageScreen', {
      user_id: props?.user_id,
      driver_id: props?.driver_id,
    });
  };
  return (
    <View>
      {props?.status != 'drop_location_reached' ? (
        <View style={[tailwind('mt-5 mx-3 p-3'), {}]}>
          {props?.status != 'pickup_location_reached' ? (
            props?.status == 'booked' ||
            props?.status == 'pickup_location_reached' ? (
              <View style={[tailwind('flex-row'), {}]}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    backgroundColor: 'green',
                    marginHorizontal: 10,
                  }}
                />
                <Text style={[tailwind('text-gray'), {}]}>Pickup Address</Text>
              </View>
            ) : (
              <View style={[tailwind('flex-row'), {}]}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    backgroundColor: 'red',
                    marginHorizontal: 10,
                  }}
                />
                <Text style={[tailwind('text-gray'), {}]}>Drop Address</Text>
              </View>
            )
          ) : null}

          {props?.status != 'pickup_location_reached' ? (
            <View
              style={[
                tailwind('flex-row  items-center px-5 py-2'),
                {width: '100%', borderBottomWidth: 1},
              ]}>
              <View style={[tailwind(''), {width: '90%'}]}>
                <Text style={[tailwind('mt-1 text-black'), {}]}>
                  {props?.status == 'booked'
                    ? props?.pickup_address
                    : props?.dropAddress}
                </Text>
              </View>
              <TouchableOpacity
                style={[tailwind('items-center ml-3'), {}]}
                onPress={() => {
                  props?.OpenGoogleMap();
                }}>
                <Entypo name="direction" color="black" size={25} />
              </TouchableOpacity>
            </View>
          ) : null}

          {props?.status == 'booked' ? (
            <View>
              <View style={[tailwind('flex-row mt-5 items-center'), {}]}>
                <TouchableOpacity
                  style={[tailwind(''), {width: '25%'}]}
                  onPress={() => {
                    Onpress();
                  }}>
                  <MaterialIcons name="message" color="black" size={40} />

                  {props?.GetMessage?.length && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: 40,
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: '#FFD900',
                      }}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props?.Call();
                  }}>
                  <Ionicons name="call" color="black" size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setOpenModal(true);
                    // props?.navigation.navigate('CancelScreen');
                  }}
                  style={[
                    tailwind('rounded-xl py-4 items-center bg-secondary'),
                    {marginLeft: 'auto', width: '50%'},
                  ]}>
                  <Text style={[tailwind('text-black font-17 font-bold'), {}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  tailwind('mt-5'),
                  {height: 1, width: '100%', backgroundColor: 'silver'},
                ]}
              />
            </View>
          ) : null}
          {props?.status != 'pickup_location_reached' ? (
            <View
              style={[
                tailwind('flex-row mt-5 items-center'),
                {justifyContent: 'space-between'},
              ]}>
              <View style={[tailwind('items-center'), {}]}>
                <Text style={[tailwind('text-black font-semibold')]}>Distance</Text>
                <View style={[tailwind('flex-row mt-2 items-center'), {}]}>
                  <Entypo name="map" color="black" size={20} />
                  <Text style={[tailwind('ml-1 text-gray-700'), {}]}>
                    {Number(props?.distance).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={[tailwind('items-center'), {}]}>
                <Text  style={[tailwind('text-black font-semibold')]}>Trip Type</Text>
                <View style={[tailwind('flex-row mt-2 items-center'), {}]}>
                  <Ionicons name="car-sport" color="black" size={20} />
                  <Text style={[tailwind('ml-1 text-gray-700'), {}]}>{props?.trip_type}</Text>
                </View>
              </View>
              <View style={[tailwind('items-center'), {}]}>
                <Text style={[tailwind('text-black font-semibold')]}>Estimated Fare</Text>
                <View style={[tailwind('flex-row mt-2 items-center'), {}]}>
                  <FontAwesome name="rupee" color="gray" size={20} />
                  <Text style={[tailwind('ml-1 text-gray-700'), {}]}>
                    {Math.round(props?.total)}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          {props?.status == 'pickup_location_reached' ? (
            <View>
              <Text style={[tailwind('font-16 font-bold mb-5 text-black'), {}]}>
                OTP Confirmation Code{' '}
              </Text>
              <View style={[tailwind('items-center'), {}]}>
                <OTPInput
                  value={props?.otp}
                  onChangeText={(text: string) => props?.setOtp(text)}
                />
                {props?.error != '' && (
                  <Text
                    style={[
                      tailwind('font-bold '),
                      {color: props?.error == 'OTP Verified' ? 'green' : 'red'},
                    ]}>
                    {props?.error}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
          {
            props?.loading ? (
              <TouchableOpacity
                disabled
                style={[
                  tailwind('px-3 mt-5 mb-2 py-3 bg-secondary rounded-xl'),
                  {},
                ]}>
                <ActivityIndicator color={'white'} size={'small'} />
              </TouchableOpacity>
            ) : props?.status == 'booked' ? (
              <TouchableOpacity
                style={[
                  tailwind('px-3 mt-5 mb-2 py-3 bg-secondary rounded-xl'),
                  {},
                ]}
                onPress={() => {
                  props?.updateTripStatus();
                }}>
                <Text
                  style={[tailwind('text-black font-bold text-center'), {}]}>
                  At Point
                </Text>
              </TouchableOpacity>
            ) : props?.status == 'pickup_location_reached' ? (
              <TouchableOpacity
                style={[tailwind('px-3 mt-5 py-3 bg-secondary rounded-xl'), {}]}
                onPress={() => {
                  props?.updateTripStatus();
                }}>
                <Text
                  style={[tailwind('text-black font-bold text-center'), {}]}>
                  Start Trip
                </Text>
              </TouchableOpacity>
            ) : (
              // props?.status == 'trip_started' ? (
              <TouchableOpacity
                style={[tailwind('px-3 mt-5 py-3 bg-secondary rounded-xl'), {}]}
                onPress={() => {
                  props?.updateTripStatus();
                }}>
                <Text
                  style={[tailwind('text-black font-bold text-center'), {}]}>
                  Destination Reached
                </Text>
              </TouchableOpacity>
            )
            // ) : props?.status == 'drop_location_reached' ? (
            //   <TouchableOpacity
            //     style={[tailwind('px-3 mt-5 py-3 bg-secondary rounded-xl'), {}]}
            //     onPress={() => {
            //       props?.updateTripStatus();
            //     }}>
            //     <Text style={[tailwind('text-black font-bold text-center'), {}]}>
            //       End Trip
            //     </Text>
            //   </TouchableOpacity>
            // ) : (
            //   <TouchableOpacity
            //     style={[tailwind('px-3 mt-5 py-3 bg-secondary rounded-xl'), {}]}
            //     onPress={() => {
            //       props?.navigation?.reset({
            //         index: 0,
            //         routes: [{name: 'BottomTabNavigation'}],
            //       });
            //       // props?.setStatus(4);
            //     }}>
            //     <Text style={[tailwind('text-black font-bold text-center'), {}]}>
            //       Completed
            //     </Text>
            //   </TouchableOpacity>
            // )
          }
          <Modal
            isVisible={openModal}
            onBackdropPress={() => setOpenModal(true)} // ✅ Closes on outside tap
          >
            <View style={tailwind('bg-white rounded-lg px-3 py-5')}>
              <TouchableOpacity
                style={[tailwind(' p-2'), {alignSelf: 'flex-end'}]}
                onPress={() => setOpenModal(false)} // ✅ Closes on X tap
              >
                <FontAwesome name="close" size={20} color="black" />
              </TouchableOpacity>

              <View style={tailwind(' mx-4')}>
                {props?.Reson?.length
                  ? props.Reson.map((i: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={tailwind('flex-row mt-3 mx-3')}
                        onPress={() => props?.setSelected(i)}>
                        {props?.selected?.cancel_reason_id ===
                        i.cancel_reason_id ? (
                          <CheckBox />
                        ) : (
                          <ChecboxoutLine />
                        )}
                        <Text style={tailwind('ml-3 font-16')}>
                          {i.cancel_reason}
                        </Text>
                      </TouchableOpacity>
                    ))
                  : null}
              </View>
              <View style={[tailwind('px-2 mt-3 rounded-xl py-2 bg-gray'), {}]}>
                <TextInput
                  placeholder="Other"
                  onChangeText={txt => {
                    setSelected1(txt);
                  }}
                  value={selected1}
                />
              </View>

              {props?.loading ? (
                <TouchableOpacity
                  disabled
                  style={[
                    tailwind('px-3 mt-5 mb-2 py-3 bg-secondary rounded-xl'),
                    {},
                  ]}>
                  <ActivityIndicator color={'white'} size={'small'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={tailwind('px-3 mt-5 py-3 bg-secondary rounded-xl')}
                  onPress={() => {
                    // props?.updateTripStatus();
                    CancelReson(); // Optional: Close after submit
                  }}>
                  <Text style={tailwind('text-black font-bold text-center')}>
                    Submit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Modal>
        </View>
      ) : (
        <View style={[tailwind('mx-3 mt-5'), {}]}>
          <View
            style={[tailwind('flex-row items-center mb-5'), {width: '100%'}]}>
            <Text style={[tailwind('font-15  font-bold text-black'), {width: '45%'}]}>
              Total Estimate Fare
            </Text>
            {props?.payment_mode_name !== 'Cash On Delivery' && (
              <Text
                style={[
                  tailwind('text-black'),
                  {fontWeight: 'bold', marginLeft: 'auto'},
                ]}>
                ₹{Math.round(props?.total)}
              </Text>
            )}
          </View>

          {props?.payment_mode_name == 'Cash On Delivery' ? (
            <View>
              {props?.payment_mode_name && (
                <View style={[tailwind('flex-row items-center py-2'), {}]}>
                  <Text style={[tailwind('font-15 text-black'), {fontWeight: 'bold'}]}>
                    Payment Mode
                  </Text>
                  <Text
                    style={[
                      tailwind('font-15 text-black'),
                      {fontWeight: 'bold', marginLeft: 'auto'},
                    ]}>
                    {props?.payment_mode_name}
                  </Text>
                </View>
              )}
              {props?.fare != '0' && (
                <View style={[tailwind('flex-row items-center py-2'), {}]}>
                  <Text  style={[tailwind('text-black')]}>Trip Amount</Text>
                  <Text
                    style={[
                      tailwind('text-black'),
                      {fontWeight: 'bold', marginLeft: 'auto'},
                    ]}>
                    ₹{Math.round(Number(props?.fare))}
                  </Text>
                </View>
              )}
              {props?.tax != '0.00' && (
                <View style={[tailwind('flex-row items-center py-2'), {}]}>
                  <Text style={[tailwind('text-black')]}>Tax</Text>
                  <Text
                    style={[
                      tailwind('text-black'),
                      {fontWeight: 'bold', marginLeft: 'auto'},
                    ]}>
                    ₹{Math.round(props?.tax)}
                  </Text>
                </View>
              )}
              {props?.coupon_amount != '0.00' && (
                <View style={[tailwind('flex-row items-center py-2'), {}]}>
                  <Text style={[tailwind(''), {color: 'green'}]}>
                    Coupon discount
                  </Text>
                  <Text
                    style={[
                      tailwind(''),
                      {fontWeight: 'bold', marginLeft: 'auto', color: 'green'},
                    ]}>
                    - ₹{Math.round(props?.coupon_amount)}
                  </Text>
                </View>
              )}
              <View
                style={[
                  tailwind('bg-gray mt-3 mb-3'),
                  {height: 2, width: '100%'},
                ]}
              />
              {props?.total && (
                <View style={[tailwind('flex-row items-center py-2'), {}]}>
                  <Text style={[tailwind('font-18 font-bold text-black'), {}]}>Total</Text>
                  <Text style={[tailwind('font-bold text-black'), {marginLeft: 'auto'}]}>
                    ₹ {Math.round(props?.total)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {props?.qr?.image_url ? (
                <View style={[tailwind('items-center'), {}]}>
                  <Image
                    source={{uri: props?.qr?.image_url}}
                    style={[tailwind(''), {height: 200, width: 200}]}
                  />
                </View>
              ) : (
                <View style={[tailwind('items-center'), {}]}>
                  <Text>QR Not Generated Some Technical Issue</Text>
                </View>
              )}
            </View>
          )}

          {props?.loading ? (
            <TouchableOpacity
              disabled
              style={[
                tailwind('px-3 mt-5 mb-2 py-3 bg-secondary rounded-xl'),
                {},
              ]}>
              <ActivityIndicator color={'white'} size={'small'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                tailwind('px-3 mt-5 mb-2 py-3 bg-secondary rounded-xl'),
                {},
              ]}
              onPress={() => {
                props?.updateTripStatus();
              }}>
              <Text style={[tailwind('text-black font-bold text-center'), {}]}>
                End Trip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
