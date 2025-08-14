import {View, Text, FlatList} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import { RiderDetails } from '../../../sharedComponents/RideDetails';
export const All = () => {
  return <View style={[tailwind(' h-full bg-black mt-3'), {}]}>
{/* <FlatList
          data={DataVal}
          renderItem={({item}) => (
            <RiderDetails
              drivername={item?.drivername}
              fare={item?.fare}
              distance={item?.distance}
              pickupAddress={item?.pickupAddress}
              dropAddress={item?.dropAddress}
              date={item?.date}
              time={item?.time}
              status={item?.status}
              rating={item?.rating}
            />
          )}
          ListFooterComponent={<View style={[tailwind('h-20'), {}]} />}
          keyExtractor={(item, index) => index.toString()}
        />   */}
        </View>;
};
