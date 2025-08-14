import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import AddNotice from './block/AddNotice';
import tailwind from '@tailwind';
import Topbar from '../../sharedComponents/Topbar';
import UpdateDocument from './block/UpdateDocument';
import AddNotes from './block/AddNotes';
import DocumentPicker, {types} from 'react-native-document-picker';
import {errorBox, infoBox} from '../../workers/utils';
import UpdateImage from './block/UpdateImage';
import Modal from 'react-native-modal';
import FileViewer from 'react-native-file-viewer';
import {useRoute} from '@react-navigation/native';
import {getuploaddocument} from '../../remote/userRemote';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';

const UploadDocumentScreen = () => {
  const [fileResponse, setFileResponse] = useState([]);
  const [pdf, setPdf] = useState({});
  const navigation = useNavigation();
  const [conformTime, setconformTime] = useState('Selected Time');

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeopen, settimeOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [noticeType, setnoticeType] = useState('');
  const pdfUri = useRef('');
  const route = useRoute();
  const [selected, setSelected] = useState('Select Summon Date');

  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });

      const newData = {
        fileCopyUri: response[0].fileCopyUri,
        name: response[0].name,
        type: response[0].type,
        size: response[0].size,
        uri: response[0].uri,
      };
      setPdf(newData);
      const ValueData = newData?.uri;

      let existsCheck = fileResponse.some(
        (data: any) => data.uri == newData.uri,
      );

      if (existsCheck) {
        return errorBox('Already updated');
      } else {
        setFileResponse(res => [...res, newData]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeDoc = (uri: any) => {
    const remove = fileResponse?.filter(item => item.uri != uri);
    setFileResponse(remove);
  };

  const openPdf = uri => {
    FileViewer.open(uri);
  };
  const Application = async () => {
    // if (selected == 'Select Summon Date') {
    //   errorBox('selected Date');
    //   return;
    // }else if (conformTime == 'Selected Time') {
    //   errorBox('Selected Your Time');
    //   return;
    // } 
    // else if (!pdf || pdf === "") {
    //   errorBox("Please select a PDF file");
    //   return;
    // } else if (pdf.type !== "application/pdf") {
    //   errorBox("Please select a valid PDF file");
    //   return;
    // }
    if (!selected || selected === 'Select Summon Date') {
      errorBox('Please select a valid summon date');
      return;
    }

    // Validate that a time is selected and is not the placeholder
    if (!conformTime || conformTime === 'Selected Time') {
      errorBox('Please select a valid time');
      return;
    }

    // Validate PDF selection
    if (!pdf || pdf === "" || !pdf?.uri) {
      errorBox("Please select a PDF file to upload");
      return;
    }

    // Validate PDF type
    if (pdf?.type !== "application/pdf") {
      errorBox("Selected file must be a PDF");
      return;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append('case_id', route?.params?.id);
    formdata.append('summonpdf', {
      uri: pdf.uri,
      name: pdf.name,
      type: pdf.type,
    });
    formdata.append('summonvalidate_date', `${selected} ${conformTime}`);
    const REsponseData = await getuploaddocument(formdata);
    setLoading(false);
    if (REsponseData?.status) {
      infoBox('Summon Upload Success Fully');
      setLoading(false)

      return navigation.goBack();
    } else {
      setLoading(false)

    }
  };
  return (
    <View style={[tailwind(' bg-background h-full')]}>
      <View></View>
      <Spinner visible={loading} color="#29627F" />
      <Topbar title="Upload Document" />

      <ScrollView style={[tailwind('p-3 h-full')]}>
        <AddNotice
          noticeType={noticeType}
          setnoticeType={setnoticeType}
          selected={selected}
          setSelected={setSelected}
        />
        <TouchableOpacity
          onPress={() => {
            settimeOpen(true);
          }}>
          <Text style={[tailwind('font-13 font-medium'), {color: 'black'}]}>
            Time
          </Text>
          <Text
            style={[
              tailwind('py-2 rounded-full my-2 px-4 font-medium font-16 '),
              {backgroundColor: '#FAFBFB', color: '#485163'},
            ]}>
            {conformTime}
          </Text>
        </TouchableOpacity>
        <UpdateDocument
          handleDocumentSelection={handleDocumentSelection}
          fileResponse={fileResponse}
          removeDoc={removeDoc}
          openPdf={openPdf}
        />
        <DatePicker
          date={date}
          open={timeopen}
          modal
          mode="time"
          // is24={true}
          // onDateChange={(txt) => { setTime1(txt); }}
          onConfirm={time1 => {
            settimeOpen(false);
            // setTime1(time1)
            setconformTime(format(time1, 'hh:mm a'));

            // format(date,"DD-MM-YYYY")
          }}
          onCancel={() => {
            settimeOpen(false);
          }}
        />
        {/* <UpdateImage
          handleDocumentSelection={handleDocumentSelection}
          fileResponse={fileResponse}
          removeDoc={removeDoc}
        /> */}
        {/* <AddNotes /> */}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          Application();
        }}
        style={[tailwind('py-3 rounded-full bg-primary mb-4 mx-4')]}>
        <Text
          style={[tailwind('font-16 font-bold text-center text-white')]}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
export default UploadDocumentScreen;
