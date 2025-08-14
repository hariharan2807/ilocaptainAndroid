import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Topbar from '../../sharedComponents/Topbar';
import tailwind from '@tailwind';
import Datepicker from './block/Datepicker';
import {format} from 'date-fns';
import OverAllRating from './OverAllRating';
import CasesOverViewCard from '../../sharedComponents/CasesOverViewCard';
const ReportScreen = () => {
  const [date, setDate] = useState(new Date());
  const [todate, settoDate] = useState(new Date());

  const formattedfromDate = format(new Date(date), 'dd MMM');
  const formattedtoDate = format(new Date(todate), 'dd MMM');
  return (
    <View style={[tailwind('bg-background h-full')]}>
      <Topbar title={'Report'} />
      <ScrollView style={[tailwind(' p-3 ')]}>
        <Datepicker
          date={date}
          setDate={setDate}
          todate={todate}
          settoDate={settoDate}
        />
        <View style={[tailwind('flex-row items-center my-2')]}>
          <Text style={[tailwind('font-semibold font-21 text-primary')]}>
            Report
          </Text>
          <Text
            style={[tailwind('font-medium font-14 mx-2'), {color: '#818CA1'}]}>
            (From : {formattedfromDate} To:{formattedtoDate})
          </Text>
        </View>
        <OverAllRating />
        <View style={[tailwind('flex-row items-center my-2')]}>
          <Text style={[tailwind('font-semibold font-21 text-primary')]}>
            Cases List
          </Text>
          <Text
            style={[tailwind('font-medium font-14 mx-2'), {color: '#818CA1'}]}>
            (24)
          </Text>
        </View>
        <View style={[tailwind('')]}>
          <CasesOverViewCard />
          <CasesOverViewCard />
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportScreen;
