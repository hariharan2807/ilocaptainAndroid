import {View, Image, Text, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import tailwind from '@tailwind';
import {EditIcon} from '../../../assets/icons';
import {useQuery} from 'react-query';
import {getprofile} from '../../../remote/userRemote';
import FullScreenLoading from '../../../sharedComponents/atoms/Screenloader';
const Profile = (props: any) => {
  // const REsponseData = useQuery(['getCaseClosed1'], getprofile);
  // if (REsponseData.status === 'loading') {
  //   return <FullScreenLoading />;
  // }
  // const Data = REsponseData?.data?.data?.data;
  // const Status = Data?.status;
  const [val,setVal]=useState(false)
  return (
    <View
      style={[
        tailwind(
          'bg-white flex-row rounded-xl justify-between  p-3 rounded-lg my-3',
        ),
      ]}>
      <View style={[tailwind('flex-row  ')]}>
        <Image
          source={require('../../../assets/images/ProfileImage.png')}
          style={[tailwind(''), {width: 60, height: 60}]}
        />
        <View style={[tailwind('px-3'),{width:"75%"}]}>
          <Text style={[tailwind('font-semibold font-19 text-primary')]}>
            {props?.name}
          </Text>
          <Text style={[tailwind('font-medium font-13 text-secondary mt-1')]}>
            {props?.email}
          </Text>
          <Text style={[tailwind('font-medium font-13 text-secondary mt-1')]}>
            {props?.phonenumber}
          </Text>
          <Text style={[tailwind('font-medium font-13 text-secondary mt-1'),{display:val?"flex":"none"}]}>
            {props?.dob}
          </Text>
          <Text style={[tailwind('font-medium font-13 text-secondary mt-1'),{display:val?"flex":"none",}]} numberOfLines={2}>
            {props?.address}
          </Text>
          <TouchableOpacity style={{marginTop:5}} onPress={()=>{
            if(val==false){
              setVal(true)
            }
            else{
              setVal(false)
            }
            }}>
          
            <Text style={{textDecorationLine:"underline",color:"black"}}>{val?"Less Details":"More Details"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => {props?.seteditProfile(true)}} style={{marginTop:"7%"}}>
        <EditIcon />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
