import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import tailwind from '@tailwind';
// import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {errorBox, infoBox} from '../../workers/utils';
import {
  getLoginremote,
  getMyprofileremote,
  getRegisterCheck,
} from '../../remote/userRemote';
import {SaveToken, SaveToken1} from '../../workers/localStorage';
import {
  saveJWTTokenAction,
  saveuserInfo,
} from '../../store/actions/userActions';
import Spinner from 'react-native-loading-spinner-overlay';
import assets_manifest from '@assets';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
const log = console.log;

export default function LoginScreen() {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [checkbox, setcheckBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Mobile, setMobile] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    Loader();
  }, []);
  const LoginApiCondition = async () => {
    if (!Mobile) {
      errorBox('Enter Your Mobile Number');
      return;
    } else if (Mobile?.length != 10) {
      errorBox('Invalid Mobile Number');
      return;
    }
    setLoading(true);
    const RegisterCheckdata = await getRegisterCheck({mobile_number: Mobile});
    if (RegisterCheckdata?.status) {
      setLoading(false);
      if (RegisterCheckdata?.data === '0') {
        setLoading(true);

        const getlogin = await getLoginremote({mobile_number: Mobile});
        setLoading(false);
        if (getlogin?.status == 200) {
          setLoading(false);
          dispatch(saveJWTTokenAction(getlogin?.data?.data?.token));
          navigation.navigate('OtpScreen', {
            mobile: Mobile,
            token: getlogin?.data?.data?.token,
          });
        } else {
          setLoading(false);
          errorBox(getlogin?.res?.message);
        }
      } else if (RegisterCheckdata?.data === '2') {
        setLoading(false);
        navigation.navigate('NotVerfied');
      } else {
        setLoading(false);
        navigation.navigate('RegisterScreen');
      }
    } else {
      setLoading(false);
      errorBox(RegisterCheckdata?.res?.message);
    }
  };
  const Loader = () => {
    if (loading == true) {
      <FullScreenLoading />;
    } else {
    }
  };
  return (
    <View style={[tailwind('bg-background h-full  ')]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}>
        <View style={[tailwind('mx-3'), {marginTop: height / 9}]}>
          <View style={[tailwind('items-center '), {}]}>
            <Text style={[tailwind('font-bold font-20 text-black'), {}]}>
              Enter Your Phone Number
            </Text>
            <Text style={[tailwind('font-medium font-13 text-gray mt-3'), {}]}>
              You Need Enter Your Phone Number
            </Text>
          </View>
          <View
            style={[
              tailwind('flex-row px-4 my-3 items-center'),
              {width: '100%'},
            ]}>
            <Image
              source={assets_manifest?.India}
              style={[
                tailwind(''),
                {height: 30, width: 30, resizeMode: 'contain'},
              ]}
            />
            <View
              style={[
                tailwind('ml-3 flex-row items-center'),
                {borderBottomWidth: 1, width: '90%'},
              ]}>
              <Text style={[tailwind(' mr-2 text-black font-medium'), {}]}>
                +91
              </Text>
              <TextInput
                onChangeText={txt => {
                  setMobile(txt);
                }}
                value={Mobile}
                style={[
                  tailwind('flex-1 py-3 font-medium text-black font-15 '),
                  {},
                ]}
                placeholder="Phone Number"
                placeholderTextColor={'gray'}
                maxLength={10}
                keyboardType="phone-pad"
              />
            </View>
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
                LoginApiCondition();
              }}
              style={[
                tailwind('bg-secondary rounded-xl px-4 py-4 my-3 items-center'),
              ]}>
              <Text
                style={[
                  tailwind('text-center font-semibold font-16 text-black '),
                ]}>
                Login / Register
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
