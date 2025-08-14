import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import {AppIcon, AppIconname, NotificationIcon} from '../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import assets_manifest from '@assets';
import {errorBox} from '../../../workers/utils';
interface Prototype {
  setSelected: any;
  selected: any;
  DriverStatus: (status: any) => Promise<void>;
  admin_commission_limt: any;
  user_admin_commision: any;
  setscheduled: any;
  SchedlewOrder: any;
}
const TopView = (props: Prototype) => {
  const navigation = useNavigation();
  const Onpress = () => {
    props?.DriverStatus('0');
    props?.setSelected('2');
  };
  const Onpress1 = () => {
   
    if (Number(props?.admin_commission_limt) > props?.user_admin_commision) {
      props?.DriverStatus('1');
      props?.setSelected('1');
    } else {
      errorBox('Please Pay on Admin Commision');
    }
  };
  return (
    <View style={[tailwind(' px-3 ')]}>
      <View
        style={[
          tailwind('flex-row ml-3 my-2 mr-3'),
          {justifyContent: 'space-between', alignItems: 'center'},
        ]}>
        {/* Button 1 */}
        <TouchableOpacity
          style={tailwind('py-3 items-center')}
          onPress={Onpress}>
          <Image
            source={assets_manifest?.riderOffline}
            style={{height: 30, width: 30}}
            tintColor={props?.selected === '2' ? 'black' : 'gray'}
          />
          <Text style={tailwind('mt-3 text-black font-bold')}>Offline</Text>
        </TouchableOpacity>

        {/* Dot or divider */}
        <View
          style={{
            width: 20,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#ccc',
            marginHorizontal: 10,
          }}
        />
        <TouchableOpacity
          style={tailwind('py-3 items-center')}
          onPress={() => {
            if (props?.SchedlewOrder?.length) {
              props?.setscheduled(true);
            } else {
              props?.setscheduled(false);
              errorBox('Schedlued Order Not Found');
            }
          }}>
          {/* Badge */}
          {props?.SchedlewOrder?.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                right: 10,
                backgroundColor: 'red',
                borderRadius: 999,
                paddingHorizontal: 6,
                paddingVertical: 2,
                zIndex: 10,
              }}>
              <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                {props?.SchedlewOrder.length}
              </Text>
            </View>
          )}
          {/* Calendar Icon */}
          <Image
            source={assets_manifest?.calendar}
            style={{height: 30, width: 30}}
            tintColor={'gray'}
          />

          {/* Label */}
          <Text style={tailwind('mt-3 text-black font-bold')}>Scheduled</Text>
        </TouchableOpacity>

        <View
          style={{
            width: 20,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#ccc',
            marginHorizontal: 10,
          }}
        />
        {/* Button 2 */}
        <TouchableOpacity
          style={tailwind('py-3 items-center')}
          onPress={Onpress1}>
          <Image
            source={assets_manifest?.Car}
            style={{height: 30, width: 30}}
            tintColor={props?.selected === '1' ? 'green' : 'gray'}
          />
          <Text style={tailwind('mt-3 text-black font-bold')}>Online</Text>
        </TouchableOpacity>

        {/* Dot */}
        {/* <View
          style={{
            width: 40,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#ccc',
            marginHorizontal: 10,
          }}
        />

        <TouchableOpacity
        onPress={()=>{
          navigation?.navigate('TopHomeScreen')
        }}
          style={[tailwind('py-3 items-center'), {justifyContent: 'center'}]}>
          <Image
            source={assets_manifest?.home}
            style={{height: 30, width: 30}}
          />
          <Text style={tailwind('mt-3 font-bold')}>Home</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default TopView;
