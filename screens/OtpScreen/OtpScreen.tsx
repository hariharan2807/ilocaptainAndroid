import tailwind from '@tailwind';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {TopBar} from '@sharedComponents';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import OTPInput from '../../screens/AcceptOrder/Block/OTPInput';
import {getMyprofileremote, getVerifyOtpremote} from '../../remote/userRemote';
import {errorBox} from '../../workers/utils';
import {
  saveJWTTokenAction,
  saveuserInfo,
} from '../../store/actions/userActions';
import {useDispatch} from 'react-redux';
import {SaveToken} from '../../workers/localStorage';
export default function OtpScreen() {
  const route = useRoute();
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const OTPdata = async () => {
    if (!otp) {
      errorBox('Please Enter OTP');
      return;
    }
    setLoading(true);

    const Response = await getVerifyOtpremote({
      otp: Number(otp),
    });
    if (Response?.status) {
      setLoading(false);

      SaveToken(route?.params?.token);
      dispatch(saveJWTTokenAction(route?.params?.token));
      const getProfile = await getMyprofileremote();
      if (getProfile?.data?.driver_name) {
        dispatch(saveuserInfo(getProfile?.data));
        navigation.reset({
          routes: [
            {
              name: 'BottomTabNavigation',
            },
          ],
        });
        // navigation.navigate('BottomTabNavigation');
      } else {
        navigation.reset({
          routes: [
            {
              name: 'EditProfileScreen',
            },
          ],
        });
        // navigation.navigate('');
      }
    } else {
      setLoading(false);

      errorBox(Response?.res?.message);
    }
  };
  return (
    <View style={[tailwind('h-full bg-white'), {}]}>
      <TopBar titile={''} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}>
        <View style={[tailwind('mx-3'), {marginTop: height / 9}]}>
          <View style={[tailwind('items-center '), {}]}>
            <Text style={[tailwind('font-bold font-20'), {}]}>
              Enter The OTP
            </Text>
            <Text style={[tailwind('font-medium font-13 text-gray mt-3'), {}]}>
              Enter Your OTP Received From The SMS
            </Text>
          </View>

          <View style={[tailwind('items-center'), {}]}>
            <OTPInput
              value={otp}
              onChangeText={(text: string) => setOtp(text)}
            />
          </View>
          {loading ? (
            <TouchableOpacity
              // onPress={() => {
              //   LoginApiCondition();
              // }}
              style={[
                tailwind('bg-secondary rounded-xl px-4 py-4 my-3 items-center'),
              ]}>
              <ActivityIndicator color={'white'} size={'small'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                OTPdata();
                // navigation.navigate('BottomTabNavigation');
                //   LoginApiCondition();
              }}
              style={[
                tailwind('bg-secondary rounded-xl px-4 py-4 my-3 items-center'),
              ]}>
              <Text
                style={[
                  tailwind('text-center font-semibold font-16 text-black '),
                ]}>
                Submit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
