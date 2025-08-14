import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tailwind from '@tailwind';
import {TextInput} from 'react-native-gesture-handler';
import {CalendarIcon} from '../../../assets/icons';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';

const Datepicker = props => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const formattedfromDate = format(new Date(props?.date), 'yyyy-MM-dd');
  const formattedtoDate = format(new Date(props?.todate), 'yyyy-MM-dd');
  return (
    <View style={[tailwind('bg-white  rounded-lg p-3')]}>
      <Text style={[tailwind('font-13 font-medium')]}>From</Text>
      <View
        style={[
          tailwind(
            'flex-row justify-between items-center px-3 py-2 rounded-full my-2',
          ),
          {backgroundColor: '#FAFBFB'},
        ]}>
        <Text style={[tailwind('font-16 font-semibold'), {color: '#5D6B82'}]}>
          {formattedfromDate}
        </Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <CalendarIcon />
        </TouchableOpacity>
      </View>
      <Text style={[tailwind('font-13 font-medium my-2')]}>To</Text>
      <View
        style={[
          tailwind(
            'flex-row justify-between items-center px-3 py-2 rounded-full my-2',
          ),
          {backgroundColor: '#FAFBFB'},
        ]}>
        <Text style={[tailwind('font-16 font-semibold'), {color: '#5D6B82'}]}>
          {formattedtoDate}
        </Text>
        <TouchableOpacity onPress={() => setOpen1(true)}>
          <CalendarIcon />
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={props?.date}
        onConfirm={date => {
          setOpen(false);
          props?.setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={open1}
        date={props?.todate}
        onConfirm={date => {
          setOpen1(false);
          props?.settoDate(date);
        }}
        onCancel={() => {
          setOpen1(false);
        }}
      />
    </View>
  );
};

export default Datepicker;
