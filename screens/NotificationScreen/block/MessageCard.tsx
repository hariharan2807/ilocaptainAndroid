import {View, Text} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import {CloseIcon, DocsIcon} from '../../../assets/icons';
const MessageCard = () => {
  return (
    <View style={[tailwind('p-3 bg-white rounded-lg my-2')]}>
      <View style={[tailwind('flex-row justify-between items-center')]}>
        <Text
          style={[
            tailwind('font-semibold font-15 '),
            {color: '#3F4757', flexBasis: '80%'},
          ]}>
          LRN Notice Issued...
        </Text>
        <Text
          style={[
            tailwind('font-medium font-13'),
            {color: '#A7AEBD', flexBasis: '20%'},
          ]}>
          02:30pm
        </Text>
      </View>
      <View
        style={[tailwind('rounded-lg my-2'), {backgroundColor: '#F9F9F9 '}]}>
        <Text style={[tailwind('font-13 font-semibold  text-center py-1')]}>
          your case Lead No : SSD34489234324
        </Text>
      </View>
      <Text
        style={[
          tailwind('font-13 font-normal'),
          {color: '#67748E', lineHeight: 20},
        ]}>
        LRN Notice has been sent to you for the Loan Repayment Over Due case
        amount of Rs, 2,00,000.
      </Text>
      <View
        style={[
          tailwind(
            'flex-row items-center justify-between my-3 border py-2 px-2 rounded-lg',
          ),
          {borderColor: '#F0F1F4'},
        ]}>
        <View style={[tailwind('flex-row ')]}>
          <DocsIcon />
          <Text
            style={[tailwind('font-13 font-medium px-1'), {color: '#485163'}]}>
            LRN Notice .PDF
          </Text>
        </View>
        <CloseIcon />
      </View>
    </View>
  );
};

export default MessageCard;
