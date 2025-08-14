import tailwind from '@tailwind';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {TopBar} from '@sharedComponents';
import assets_manifest from '@assets';
import {useSelector} from 'react-redux';
export default function KYCVerficationScreen() {
  const CartState = useSelector(state => state.user.user);
  const [bankName, setBankName] = useState(CartState?.bank_name);
  const [accountNo, setAccountNo] = useState(CartState?.account_no);
  const [ifsc, setIfsc] = useState(CartState?.ifsc_code);
  const [aadharno, setAadharno] = useState(CartState?.aadhar_number);
  const [panno, setPanno] = useState(CartState?.pan_no);

  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="Update Your Bank Details" type={1} />
      <View style={[tailwind('py-5'), {}]}>
        {bankName && (
          <View style={[tailwind('ml-3 mr-3 py-3 mt-5'), {}]}>
            <Text  style={[tailwind('text-black font-bold')]}>BankName</Text>
            <View
              style={[
                tailwind(
                  'flex-row items-center  mt-3 px-3 py-3 bg-white rounded-xl',
                ),
                {},
              ]}>
              <Image
                source={assets_manifest?.bank}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
              <TextInput
                onChangeText={t => {
                  setBankName(t);
                }}
                editable={false}
                value={bankName}
                placeholder="Bank Name"
                style={[tailwind('ml-3 text-black'), {flex: 1}]}
              />
              <Image
                source={assets_manifest?.mark}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
            </View>
          </View>
        )}
        {accountNo && (
          <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
            <Text  style={[tailwind('text-black font-bold')]}>Account Number</Text>
            <View
              style={[
                tailwind(
                  'flex-row items-center  mt-3 px-3 py-3 bg-white rounded-xl',
                ),
                {},
              ]}>
              <Image
                source={assets_manifest?.mail}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
              <TextInput
                onChangeText={t => {
                  setAccountNo(t);
                }}
                editable={false}
                value={accountNo}
                placeholder="Account Number"
                style={[tailwind('ml-3 text-black'), {flex: 1}]}
              />
              <Image
                source={assets_manifest?.mark}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
            </View>
          </View>
        )}
        {ifsc && (
          <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
            <Text style={[tailwind('text-black font-bold')]}>IFSC Code</Text>
            <View
              style={[
                tailwind(
                  'flex-row items-center mt-3 px-3 py-3 bg-white rounded-xl',
                ),
                {},
              ]}>
              <Image
                source={assets_manifest?.smartphone}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
              <TextInput
                editable={false}
                onChangeText={t => {
                  setIfsc(t);
                }}
                value={ifsc}
                placeholder="Mobile Number"
                style={[tailwind('ml-3 text-black'), {flex: 1}]}
              />
              <Image
                source={assets_manifest?.mark}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
            </View>
          </View>
        )}
        {aadharno && (
          <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
            <Text style={[tailwind('text-black font-bold')]}>Aadhar Number</Text>
            <View
              style={[
                tailwind(
                  'flex-row items-center mt-3 px-3 py-3 bg-white rounded-xl',
                ),
                {},
              ]}>
              <Image
                source={assets_manifest?.smartphone}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
              <TextInput
                editable={false}
                onChangeText={t => {
                  setAadharno(t);
                }}
                value={aadharno}
                placeholder="Aadhar Number"
                style={[tailwind('ml-3 text-black'), {flex: 1}]}
              />
              <Image
                source={assets_manifest?.mark}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
            </View>
          </View>
        )}
        {panno && (
          <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
            <Text style={[tailwind('text-black font-bold')]}>Pan Number</Text>
            <View
              style={[
                tailwind(
                  'flex-row items-center mt-3 px-3 py-3 bg-white rounded-xl',
                ),
                {},
              ]}>
              <Image
                source={assets_manifest?.smartphone}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
              <TextInput
                editable={false}
                onChangeText={t => {
                  setPanno(t);
                }}
                value={panno}
                placeholder="Pan Number"
                style={[tailwind('ml-3 text-black'), {flex: 1}]}
              />
              <Image
                source={assets_manifest?.mark}
                style={[tailwind(''), {height: 20, width: 20}]}
              />
            </View>
          </View>
        )}
        {/* <TouchableOpacity
          style={[tailwind('ml-3 mr-3 mt-5 rounded-xl py-3 bg-secondary'), {}]}>
          <Text style={[tailwind('text-center font-bold font-15'), {}]}>
            Submit
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
