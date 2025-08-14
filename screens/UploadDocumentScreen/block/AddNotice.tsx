import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import tailwind from '@tailwind';
import Icon from 'react-native-vector-icons/Ionicons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
const AddNotice = (props: any) => {
  // const modalizeRef = useRef<Modalize>(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 15);
  return (
    <View style={[tailwind('mt-3')]}>
      <Text style={[tailwind('font-medium font-13'), { color: "'#818CA1'" }]}>
        Select Summon Date*
      </Text>
      <TouchableOpacity
        style={{ padding: 10, flexDirection: 'row' }}
        onPress={() => {
          setOpen(true);
        }}>
        <Text style={[tailwind('font-medium font-16'), { color: 'black' }]}>
          {props.selected}
        </Text>
        <View style={{ marginLeft: 'auto' }}>
          <Icon name="chevron-down-sharp" size={20} />
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => modalizeRef.current?.open()}
        style={[
          tailwind(
            'flex-row justify-between items-center bg-white px-4 rounded-full my-3 py-3',
          ),
        ]}>
        <Text style={[tailwind('font-semibold font-16 text-primary')]}>
          {props?.noticeType.length != 0 ? props?.noticeType : 'Select'}
        </Text>
        <Icon name="chevron-down-sharp" size={20} />
      </TouchableOpacity> */}
      <View>
        {/* <Portal>
          <Modalize
            ref={modalizeRef}
            adjustToContentHeight={true}
            closeOnOverlayTap={true}>
            <View style={[tailwind('p-3')]}>
              <Text style={[tailwind('font-18 font-semibold text-primary')]}>
                Select Notice
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    modalizeRef?.current?.close()
                    props?.setnoticeType('summon notice')}}
                  style={[tailwind('flex-row  items-center py-2')]}>
                  <Icon name={'radio-button-on'} size={22} />
                  <Text style={[tailwind('font-16 font-semibold px-3 ')]}>
                    Summon notice
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalize>
        </Portal> */}
        <DatePicker
          date={date}
          open={open}
          modal
          mode="date"
          minimumDate={date}
          maximumDate={maxDate}
          onDateChange={date => {
            setDate(date);
          }}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            props.setSelected(format(date, 'dd-MM-yyyy'));
            // format(date,"DD-MM-YYYY")
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    </View>
  );
};
// radio-button-off
export default AddNotice;
