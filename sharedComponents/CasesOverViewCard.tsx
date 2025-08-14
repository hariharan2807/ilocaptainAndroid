import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {CourtOrderIcon} from '../assets/icons';
import tailwind from '@tailwind';
import {primaryColorBG} from '../constants/API_constants';
import {useNavigation} from '@react-navigation/native';
const CasesOverViewCard = (props: any) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        tailwind('bg-white px-4 py-4 rounded-lg my-2 '),
        {
          borderTopWidth: 4,
          borderTopColor: primaryColorBG,
          borderTopRightRadius: 4,
          borderTopLeftRadius: 4,
        },
      ]}>
      <View style={[tailwind('flex-row items-center ')]}>
        <CourtOrderIcon />
        <Text style={[tailwind('font-19 font-semibold px-3 text-primary')]}>
          Loan Repayment Over Due
        </Text>
      </View>
      <View
        style={[tailwind('border-b mt-3'), {borderColor: '#F0F1F4'}]}></View>
      <View style={[tailwind('my-2')]}>
        <View style={[tailwind('flex-row justify-between items-center  ')]}>
          <View>
            <Text
              style={[tailwind('font-13 font-regular text-secondary mb-1')]}>
              Lead No
            </Text>
            <Text
              style={[
                tailwind('font-medium font-15 text-primary'),
                
              ]}>
              {props.leadno}
            </Text>
          </View>
          <View>
            <Text
              style={[
                tailwind('font-13 font-regular text-secondary mb-1'),
                {marginLeft: 'auto'},
              ]}>
              Status
            </Text>
            <Text
              style={[
                tailwind('font-medium font-15 text-primary text-right'),
                {color: '#00CFE8', textTransform: 'capitalize'},
              ]}>
              {props.status}
            </Text>
          </View>
        </View>
        <View style={[tailwind('flex-row justify-between items-center  my-3')]}>
          <View style={[tailwind(''),{width:"47%"}]}>
            <Text
              style={[tailwind('font-13 font-regular text-secondary mb-1')]}>
              Borrower
            </Text>
            <Text
              style={[
                tailwind('font-medium font-15 text-primary'),
                {textTransform: 'capitalize'},
              ]} numberOfLines={2}>
              {props.borrower}
            </Text>
          </View>
          <View style={[tailwind(''),{width:"47%",}]}>
            <Text
              style={[
                tailwind('font-13 font-regular text-secondary text-right mb-1'),
              ]}>
              Case Type
            </Text>
            <Text
              style={[
                tailwind('font-medium font-15 text-primary text-right'),
                {textTransform: 'capitalize'},
              ]} numberOfLines={1}>
              {props.casetype}
            </Text>
          </View>
        </View>
        <View style={[tailwind('flex-row justify-between items-center  ')]}>
        <View style={[tailwind(''),{width:"47%"}]}>
            <Text
              style={[tailwind('font-13 font-regular text-secondary mb-1')]}>
              Bank
            </Text>
            <Text
              style={[
                tailwind('font-medium font-15 text-primary'),
                {textTransform: 'capitalize'},
              ]} numberOfLines={2}>
              {props.name}
            </Text>
          </View>
          <View>
            <Text
              style={[tailwind('font-13 font-regular text-secondary mb-1')]}>
              Repayment Value
            </Text>
            {
              props.Payment?  <Text
              style={[
                tailwind('font-medium font-15 text-primary text-right'),
                {textTransform: 'capitalize'},
              ]}>
              {' '}
              ₹ {props.Payment}
            </Text>:<Text
              style={[
                tailwind('font-medium font-15 text-primary text-right'),
                {textTransform: 'capitalize',textAlign:"center"},
              ]}>
              {' '}
              -
            </Text>
            }
           
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CaseDetailsScreen', {data: {name: props.caseid}})
        }
        style={[
          tailwind('border rounded-full mt-2'),
          {borderColor: primaryColorBG},
        ]}>
        <Text
          style={[
            tailwind('text-center py-3 font-semibold font-16'),
            {color: primaryColorBG},
          ]}>
          View Case Details
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CasesOverViewCard;
