import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import tailwind from '@tailwind';
import Entypo from 'react-native-vector-icons/Entypo'
interface prototype {
  popup: boolean;
  setpopup: (value: boolean) => void;
  CancelStatus: (status: any) => void;
  PayNow: () => void;
  admin_commision:any
}

export const ModalComp = (props: prototype) => {
  return (
    <Modal
      isVisible={props?.popup}
      animationInTiming={150}
      animationOutTiming={150}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      onBackdropPress={() => props?.setpopup(true)}>
      <View
        style={[
          tailwind('bg-white rounded-2xl p-5'),
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
          <View  style={[tailwind(''),{marginLeft:"auto"}]}>
     
        {/* <Text  style={[tailwind('font-bold font-18 text-center w-full'),{textTransform:"uppercase"}]}>warning</Text> */}
        <Image
          source={require('../../assets/images/warning.png')} // replace with your warning or alert icon
          style={{
            height: 30,
            width: 30,
            resizeMode: 'contain',
            marginLeft:"auto"
          }}
        />
          
          </View>
          <Text style={[tailwind('text-black mb-2 mt-1'),{fontSize:30}]}>₹ {props?.admin_commision}</Text>
        {/* Warning Icon or Alert Image */}
        


        {/* Title */}
        <Text
          style={tailwind(
            'text-black font-bold text-lg mb-2 text-center',
          )}>
          Admin Commission Limit Exceeded
        </Text>

        {/* Message */}
        <Text
          style={tailwind('text-center text-gray-500 font-medium mb-5')}>
          You have crossed the admin commission limit. Please pay the commission
          to proceed with new bookings.
        </Text>

        {/* Buttons */}
        <View style={tailwind('flex-row justify-between w-full')}>
          <TouchableOpacity
            onPress={() => {
              props?.CancelStatus('0');
            }}
            style={[
              tailwind('flex-1 py-3 rounded-xl mr-2'),
              {backgroundColor: '#E5E5E5'},
            ]}>
            <Text
              style={tailwind(
                'text-center text-black font-bold text-base',
              )}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props?.PayNow();
            }}
            style={[
              tailwind('flex-1 py-3 rounded-xl ml-2'),
              {backgroundColor: '#FFD700'},
            ]}>
            <Text
              style={tailwind(
                'text-center text-black font-bold text-base',
              )}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
