import tailwind from '@tailwind';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import React, {useState} from 'react';
import Topbar from '../../sharedComponents/Topbar';
import {ChecboxoutLine, CheckBox} from '../../assets/icons';
import Modal from 'react-native-modal';
import assets_manifest from '../../constants/assets_manifest';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
// import {
//   saveDropGeoAddressName,
//   saveDropGeoNameAction,
//   saveDropLocationAction,
//   saveGeoAddressName,
//   saveGeoNameAction,
//   saveLocationAction,
// } from '../../store/actions/appActions';
// import {removeDropLocation, removePickupLocation} from '@LocalStorage';
import RNRestart from 'react-native-restart';
import {useQuery} from 'react-query';
import { initiateTaxiBookingStatusRemote, initiateTaxiCancel_ResonRemote, initiateTaxiCancel_ResontripRemote } from '../../remote/userRemote';
import { errorBox, infoBox } from '../../workers/utils';


export default function CancelScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState();
  const [visible, setVisible] = useState(false);
  const Canceldata = useQuery(
    ['initiateTaxiCancel_ResontripRemote'],
    initiateTaxiCancel_ResontripRemote,
  );
  const Onpress = async () => {
    BookingStatusupdate();
  };
  const BookingStatusupdate = async () => {
    const Response = await initiateTaxiBookingStatusRemote({
      trip_id: route?.params?.trip_id,
      status: 'cancelled',
    });
    if (Response?.data) {
      infoBox(Response?.data?.message);
      setVisible(false);
      // dispatch(saveDropGeoNameAction(null));
      // dispatch(saveDropLocationAction(null));
      // dispatch(saveDropGeoAddressName(null));
      // dispatch(saveGeoNameAction(null));
      // dispatch(saveLocationAction(null));
      // dispatch(saveGeoAddressName(null));
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'BookingSplashScreen',
            },
          ],
        });
      }, 1000);
    } else {
      errorBox('Not Cancelled Network Issue');
    }
  };
  const ModalOpen = () => {
    CancelData();
  };
  const CancelData = async () => {
    if (!selected) {
      errorBox('Plese Choose Cancel List ');
      return;
    }
    const Response = await initiateTaxiCancel_ResonRemote({
      trip_id: route?.params?.trip_id,
      reason_id: selected,
    });
    if (Response?.data?.status) {
      infoBox(Response?.data?.message);
      setTimeout(() => {
        setVisible(true);
      }, 300);
    }
  };
  return (
    <View style={[tailwind('h-full bg-white')]}>
      <Topbar title="Cancel Taxi" type={1} />
      <View style={[tailwind('mx-3 my-3 ')]}>
        <Text style={[tailwind('mt-3')]}>
          Please select the reason for cancellation
        </Text>
        {Canceldata?.data?.data?.length
          ? Canceldata?.data?.data?.map((i: any, index: any) => {
              return (
                <TouchableOpacity
                  style={[tailwind('flex-row mt-3 mx-3')]}
                  key={index}
                  onPress={() => {
                    setSelected(i?.cancel_reason_id);
                  }}>
                  {selected == i?.cancel_reason_id ? (
                    <CheckBox />
                  ) : (
                    <ChecboxoutLine />
                  )}
                  <Text style={[tailwind('ml-3 font-16')]}>
                    {i?.cancel_reason}
                  </Text>
                </TouchableOpacity>
              );
            })
          : null}
        {/* {Canceldata?.data?.data?.length ? (
          <View style={[tailwind('mt-5')]}>
            <Text style={[tailwind('font-16'), {fontWeight: 'bold'}]}>
              Others
            </Text>
            <View style={[tailwind('mt-2'), {backgroundColor: '#F1F1F1'}]}>
              <TextInput
                style={[tailwind('mx-3 my-3'), {color: 'black'}]}
                placeholder="Other Reason"
                placeholderTextColor={'black'}
                multiline={true}
                maxLength={500} // Optional: Limit characters
              />
            </View>
          </View>
        ) : null} */}
      </View>
      <TouchableOpacity
        onPress={() => {
          ModalOpen();
        }}
        style={[
          tailwind('mx-3 py-3 mb-2 items-center rounded-xl'),
          {backgroundColor: '#FFDA00', marginTop: 'auto'},
        ]}>
        <Text style={[tailwind('font-16'), {fontWeight: 'bold'}]}>
          Cancel Rider
        </Text>
      </TouchableOpacity>
    </View>
  );
}
