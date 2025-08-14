import tailwind from '@tailwind';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TopBar} from '@sharedComponents';
import assets_manifest from '@assets';
import {useDispatch, useSelector} from 'react-redux';
import store from '../../../store';
import Modal from 'react-native-modal';
import {
  getMyprofileremote,
  geWithdrawHistorylremote,
  geWithdrawlremote,
} from '../../../remote/userRemote';
import {saveuserInfo} from '@actions/userActions';
import {useFocusEffect} from '@react-navigation/native';
import {errorBox, infoBox} from '../../../workers/utils';
import {useQuery} from 'react-query';

export default function WithdrawlScreen() {
  const dispatch = useDispatch();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const UserInfo = useSelector(state => state.user.user);
  const AppControll = store.getState().user.appcontrol;
  const withdrawlHistory = useQuery(
    ['geWithdrawHistorylremote'],
    geWithdrawHistorylremote,
  );

  useFocusEffect(
    useCallback(() => {
      MyProfile();
    }, []),
  );

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);

    if (!withdrawAmount || isNaN(amount)) {
      return errorBox('Invalid withdrawal amount');
    }

    if (amount <= 0) {
      return errorBox('Amount must be greater than 0');
    }

    if (amount > UserInfo?.withdrawl_earning) {
      return errorBox('Amount exceeds available balance');
    }

    if (amount > AppControll.withdrawal_limits) {
      return errorBox(
        `Minimum withdrawal amount is ₹${AppControll.withdrawal_limits}`,
      );
    }
    const Response = await geWithdrawlremote({
      account_number: UserInfo?.account_no,
      ifsc: UserInfo?.ifsc_code,
      amount: amount,
      email: UserInfo?.driver_email,
      contact: UserInfo?.driver_phone_number,
      name: UserInfo?.driver_name,
    });
    if (Response?.status) {
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      infoBox(Response?.status);
    } else {
      errorBox(Response?.res?.data?.status);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }
    // Reset and close modal
    // setWithdrawAmount('');
    // setShowWithdrawModal(false);
  };

  const MyProfile = async () => {
    const profileResponse = await getMyprofileremote();
    // console.log('profileResponse', profileResponse);
    if (profileResponse?.data) {
      dispatch(saveuserInfo(profileResponse?.data));
    }
  };
  const Onpress = () => {
    setShowWithdrawModal(true);
    if (AppControll?.withdrawal_limits <= UserInfo?.withdrawl_earning) {
      setWithdrawAmount(AppControll?.withdrawal_limits);
    } else {
      let Data = Number(Math.round(UserInfo?.withdrawl_earning));
      setWithdrawAmount(JSON.stringify(Data));
    }
  };
  return (
    <View style={[tailwind('h-full bg-white'), {}]}>
      <TopBar type={1} title="Withdrawl" />
      <View
        style={[
          tailwind(
            'flex-row ml-3 mr-3 mt-5 py-3 bg-white px-5 rounded-xl white-shadow',
          ),
        ]}>
        <Image
          source={assets_manifest?.walletHistory}
          style={{width: 70, height: 70}}
        />
        <View style={tailwind('ml-5 flex-1')}>
          <Text style={tailwind('font-18 text-gray')}>Current Balance</Text>
          <Text style={tailwind('font-24 mt-2 font-bold text-black')}>
            ₹ {Math.round(UserInfo?.withdrawl_earning)}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Onpress();
            }}
            style={tailwind(
              'mt-3 bg-secondary px-4 py-2 rounded-full self-start',
            )}>
            <Text style={tailwind('text-black font-medium')}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={tailwind('text-lg font-bold mt-5 mx-5 text-black')}>
        Transaction History
      </Text>
<ScrollView showsVerticalScrollIndicator={false}>

      {withdrawlHistory?.data?.length ? (
        withdrawlHistory.data.map((item, index) => (
          <View
            key={index}
            style={[
              tailwind('mx-5 mt-4 rounded-xl p-4'),
              {
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}>
            {/* Top Row: Name + Amount */}
            <View style={tailwind('flex-row justify-between items-center')}>
              <Text style={tailwind('text-base font-semibold text-black')}>
                {item?.name || 'Withdrawal'}
              </Text>
              <Text style={tailwind('text-base font-bold text-green-600')}>
                ₹ {item?.amount}
              </Text>
            </View>

            {/* Status */}
            <Text
              style={[
                tailwind('mt-2 text-sm font-medium'),
                {
                  color:
                    item?.status === 'success'
                      ? 'green'
                      : item?.status === 'pending'
                      ? 'orange'
                      : 'red',
                },
              ]}>
              Status: {item?.status?.toUpperCase()}
            </Text>

            {/* Account Info */}
            <View style={tailwind('mt-2')}>
              <Text style={tailwind('text-xs text-gray-600')}>
                A/C Number: {item?.account_number}
              </Text>
              <Text style={tailwind('text-xs text-gray-600')}>
                IFSC: {item?.ifsc}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={tailwind('text-center text-gray-500 mt-5')}>
          No transaction history found.
        </Text>
      )}
      <View  style={[tailwind('h-40'),{}]}/>
</ScrollView>

      {/* <TouchableOpacity
        style={[
          tailwind('ml-3 mr-3 mt-5 rounded-xl py-3 bg-secondary'),
          {marginTop: 'auto'},
        ]}>
        <Text style={[tailwind('text-center font-bold font-15'), {}]}>
          Submit
        </Text>
      </TouchableOpacity> */}

      <Modal
        backdropOpacity={0.15}
        style={[
          tailwind(' h-full items-center justify-center '),
          {backgroundColor: 'transparent'},
        ]}
        isVisible={showWithdrawModal}
        onBackButtonPress={() => {
          setShowWithdrawModal(false);
        }}>
        <View
          style={[
            tailwind(
              'rounded-tl-xl pt-5 pb-8 rounded-br-xl bg-primary  w-full',
            ),
            {backgroundColor: '#ffffff'},
          ]}>
          {/* <View
            style={tailwind(
              'bg-white  pt-5 pb-8 rounded-t-2xl rounded-b-2xl',
            )}> */}
          <Text style={tailwind('text-lg text-black  mx-5 font-bold mb-3')}>
            Withdraw Funds
          </Text>

          <TextInput
            placeholder="Enter amount"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            keyboardType="numeric"
            style={tailwind(
              'border border-gray-300 rounded-lg  text-black mx-5 px-4 py-2 mb-4',
            )}
            placeholderTextColor="gray"
          />

          <View style={tailwind('flex-row  mx-5 justify-between')}>
            <TouchableOpacity
              onPress={() => setShowWithdrawModal(false)}
              style={[
                tailwind('bg-gray-200 px-4 py-3  rounded-lg'),
                {width: '48%'},
              ]}>
              <Text style={tailwind('text-black font-semibold text-center')}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWithdraw}
              style={[
                tailwind('bg-secondary px-4 py-3 rounded-lg'),
                {width: '48%'},
              ]}>
              <Text style={tailwind('text-black font-semibold text-center')}>
                Withdraw
              </Text>
            </TouchableOpacity>
            {/* </View> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}
