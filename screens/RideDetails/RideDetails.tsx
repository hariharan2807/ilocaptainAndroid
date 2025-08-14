import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import tailwind from '@tailwind';
import {AddressCom, Invoice, TopBar} from '@sharedComponents';
import {useRoute} from '@react-navigation/native';
import {Get_Single_trip} from '../../remote/userRemote';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
export default function RideDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const pickupAddress =
    'P. U. Chinnappa Nagar, Ashok Nagar, K L, K S Nagar, Pudukkottai, Tamil Nadu 622001';
  const dropAddress =
    '9RPC+5C5, 867/2, N Main St, Melaraja Vidi, Brindavan, Pudukkottai, Tamil Nadu 622001';
  useEffect(() => {
    Single_trip();
  }, []);
  const Single_trip = async () => {
    try {
      setLoading(true);
      const Response = await Get_Single_trip({trip_id: route?.params?.trip_id});
      setLoading(false);
      if (Response?.status) {
        setLoading(false);
        setData(Response?.data);
      } else {
        setLoading(false);
        setData(null);
      }
    } catch (err) {
      console.error('Single_trip error:', err);
    }
  };
  if (loading) {
    return <FullScreenLoading />;
  }
  return (
    <View style={[tailwind('h-full bg-white'), {}]}>
      <TopBar title="ILO Driver Receipt" type={1} />

      <View style={[tailwind('px-3 py-3 mt-5'), {}]}>
        <Text style={[tailwind('font-24 font-bold text-center'), {}]}>
          Dear {data?.customer_name} , Thanks for using Ilo Driver
        </Text>
        <Text style={[tailwind('font-14 font-medium text-center mt-5'), {}]}>
          We hope you enjoyed your ride
        </Text>
      </View>
      <View style={[tailwind('px-3 mt-5 py-3'), {}]}>
        <Invoice
          total={data?.total}
          payment_mode_name={data?.payment_mode_name}
          driver_earning={data?.driver_earning}
          admin_commission={data?.admin_commission}
        />
      </View>
      <View
        style={[tailwind('mt-3'), {borderStyle: 'dashed', borderWidth: 1}]}
      />
      <View style={[tailwind('mt-5 px-3'), {}]}>
        <Text style={[tailwind('font-18 font-medium'), {}]}>
          Booking Details
        </Text>
        <View style={[tailwind('flex-row mt-3'), {}]}>
          {data?.service_name ? (
            <Text style={[tailwind('ml-2'), {}]}>{data?.service_name}</Text>
          ) : null}
          {data?.category_name ? (
            <Text style={[tailwind('ml-2'), {}]}>{data?.category_name}</Text>
          ) : null}
          {data?.distance ? (
            <Text style={[tailwind('ml-2'), {}]}>{`${data?.distance} Km`}</Text>
          ) : null}
        </View>
        <AddressCom
          pickupAddress={data?.pickup_address}
          dropAddress={data?.drop_address}
        />
      </View>
      <View
        style={[tailwind('mt-5'), {borderStyle: 'dashed', borderWidth: 1}]}
      />
      {/* <TouchableOpacity
        style={[
          tailwind('px-3 py-3 ml-3 mr-3 rounded-xl bg-secondary'),
          {marginTop: 'auto'},
        ]}>
        <Text style={[tailwind('text-center font-18 font-bold'), {}]}>
          Write Review
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
