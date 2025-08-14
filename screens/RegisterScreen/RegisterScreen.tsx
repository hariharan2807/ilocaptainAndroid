import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import tailwind from '@tailwind';
import {TopBar} from '@sharedComponents';
import {launchImageLibrary} from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {acquireGPSPermission, errorBox, infoBox} from '../../workers/utils';
import {
  getCategoryremote,
  getCityremote,
  getMyprofileremote,
  getRegister,
  getUpdate_online_sts,
  getZoneremote,
  initiateAppControllRemote,
} from '../../remote/userRemote';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import assets_manifest from '@assets';
import {appControl, saveuserInfo} from '@actions/userActions';
import {useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-get-location';
import LottieView from 'lottie-react-native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState(new Date());
  const [licenceExpiry, setLicenceExpiry] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState('');
  const [owner, setOwner] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicle_model, setvehicle_model] = useState('');
  const [idProofType, setIdProofType] = useState('');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('male');
  const [dateopen, seDatetOpen] = useState(false);
  const [expiryopen, seExpiryOpen] = useState(false);
  const [rcFrontImage, setRcFrontImage] = useState(null);
  const [profileimage, setProfileImage] = useState(null);

  const [rcBackImage, setRcBackImage] = useState(null);
  const [idProofImage, setIdProofImage] = useState(null);
  const [idProofImageBack, setIdProofImageBack] = useState(null);
  const [vehicle_image, setvehicle_image] = useState(null);
  const [licenseImage, setLicense_image] = useState(null);
  const [licenseImageback, setLicense_imageback] = useState(null);
  const [CityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState([]);
  const [selectCity, setSelectCity] = useState(null);
  const [zoneOpen, setZoneOpen] = useState(false);

  const [zone, setZone] = useState([]);
  const [selectZone, setSelectZone] = useState(null);
  const [bankPassbook, setBankPassbook] = useState(null);
  const [insurence_image, setInsurence_image] = useState(null);
  const formatDate = date => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // ensures 2-digit month
    const day = `0${date.getDate()}`.slice(-2); // ensures 2-digit day
    return `${year}-${month}-${day}`;
  };
  const [items, setItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ]);
  const [proofopen, setProofOpen] = useState(false);
  const [carType, setCarType] = useState(false);
  const [carTypeItems, setCarTypeItems] = useState([]); // List of items
  const [carTypeValue, setCarTypeValue] = useState(null); // Selected value

  const [proofvalue, setProofValue] = useState('Aadhaar');
  const [proof, setProof] = useState([
    {label: 'Aadhaar', value: 'Aadhaar'},
    {label: 'Pan', value: 'Pan'},
  ]);
  const dispatch = useDispatch();
  const [TurnOnLoad, setTurnOnLoad] = useState(false);
  const [navigated, setNavigated] = useState(null);

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0065,
    longitudeDelta: 0.0065,
  });
  useEffect(() => {
    Category();
    CityApi();
  }, []);
  useEffect(() => {
    if (selectCity) {
      ZoneApi(selectCity);
    }
  }, [selectCity]);
  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [TurnOnLoad]),
  );
  const requestLocationPermission = async () => {
    const getProfile = await getMyprofileremote();
    const Response11 = await initiateAppControllRemote();
    if (Response11?.data) {
      dispatch(appControl(Response11?.data));
    } else {
      dispatch(appControl(null));
    }
    setNavigated(getProfile?.data);

    if (getProfile?.data?.driver_name) {
      dispatch(saveuserInfo(getProfile?.data));
    }
    let permission = await acquireGPSPermission();
    if (permission.status) {
      getLocation();
    } else {
      errorBox('Kindly Give Permission To Access Location');
    }
    return null;
  };
  const getLocation = async () => {
    try {
      const locationEnabled = await DeviceInfo.isLocationEnabled();
      if (locationEnabled) {
        const currentLocation = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        setLocation({
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          latitudeDelta: 0.0065,
          longitudeDelta: 0.0065,
        });
      } else {
        promptEnableLocationServices();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  const promptEnableLocationServices = () => {
    Alert.alert(
      'Enable Location Services',
      'Location services are disabled. Please enable them to continue.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Enable',
          onPress: () => {
            if (Platform.OS === 'ios') {
              setTimeout(() => {
                setTurnOnLoad(true);
              }, 2000);
              Linking.openURL('App-Prefs:root=Privacy&path=LOCATION');
            } else {
              setTimeout(() => {
                setTurnOnLoad(true);
              }, 2000);
              Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
              // Linking.openSettings();
            }
          },
        },
      ],
    );
  };
  const Category = async () => {
    const Response = await getCategoryremote();

    if (Response?.status) {
      const dropdownItems = Response?.data?.map(item => ({
        label: item.category_name,
        value: item.category_id,
      }));

      setCarTypeItems(dropdownItems);
      setCarTypeValue(dropdownItems?.[0]?.value); // just value, not full object
    } else {
      setCarTypeItems([]);
      setCarTypeValue(null);
      errorBox(Response?.res?.message);
    }
  };

  const handleChange = (key, value) => {
    switch (key) {
      case 'profileImage':
        setProfileImage(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'vehicle_image':
        setvehicle_image(value);
        break;
      case 'phone_number':
        setPhoneNumber(value);
        break;
      case 'experience':
        setExperience(value);
        break;
      case 'vehicle_model':
        setvehicle_model(value);
        break;
      case 'DOB':
        setDOB(value);
        break;
      case 'licence_expiry':
        setLicenceExpiry(value);
        break;

      case 'gender':
        setGender(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      case 'owner':
        setOwner(value);
        break;
      case 'vehicleNumber':
        setVehicleNumber(value);
        break;
      case 'rcFrontImage':
        setRcFrontImage(value);
        break;
      case 'rcBackImage':
        setRcBackImage(value);
        break;
      case 'id_proof_number':
        setIdProofNumber(value);
        break;
      case 'id_proof_image':
        setIdProofImage(value);
        break;
      case 'id_proof_image_Back':
        setIdProofImageBack(value);
        break;

      case 'bank_name':
        setBankName(value);
        break;
      case 'account_number':
        setAccountNumber(value);
        break;
      case 'ifsc_code':
        setIfscCode(value);
        break;
      case 'insurance_number':
        setInsuranceNumber(value);
        break;
      case 'license_number':
        setLicenseNumber(value);
        break;
      case 'licenseImage':
        setLicense_image(value);
        break;
      case 'licenseImageBack':
        setLicense_imageback(value);
        break;
      case 'bank_passbook':
        setBankPassbook(value);
        break;
      case 'insurence_image':
        setInsurence_image(value);
        break;
      default:
        console.warn(`No setter found for key: ${key}`);
    }
  };
  const pickImage = fieldKey => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || !response.assets?.[0]) return;

      const imageAsset = response.assets[0]; // 👈 store full object (not just uri)
      handleChange(fieldKey, imageAsset);
    });
  };

  const Data = async () => {
    setLoading(true);

    if (!name) {
      return errorBox('Enter Your Name');
    } else if (!fullName) {
      return errorBox('Enter Your Full Name');
    } else if (!DOB) {
      return errorBox('Enter Your Date Of Birth');
    } else if (!value) {
      return errorBox('Select Your Gender');
    } else if (!owner) {
      return errorBox('Enter Your Owner');
    } else if (!vehicleNumber) {
      return errorBox('Enter Your Vehicle Number');
    } else if (!rcFrontImage) {
      return errorBox('Select Your Rc Front Image');
    } else if (!rcBackImage?.uri) {
      return errorBox('Select Your Rc Back Image');
    } else if (!proofvalue) {
      return errorBox('Select Your ID Proof');
    } else if (!idProofNumber) {
      return errorBox('Enter Your ID Proof Number');
    } else if (!idProofImage?.uri) {
      return errorBox('Select Your ID Proof front Image');
    } else if (!bankName) {
      return errorBox('Enter Your Bank Name');
    } else if (!accountNumber) {
      return errorBox('Enter Your Bank Account Number');
    } else if (!bankPassbook?.uri) {
      return errorBox('Select Your Bank PassBook Image');
    } else if (!insuranceNumber) {
      return errorBox('Enter Your Insurence Number');
    } else if (!licenseNumber) {
      return errorBox('Enter Your License Number');
    } else if (!licenseImage?.uri) {
      return errorBox('Select YourLicense Front Image');
    } else if (!licenceExpiry) {
      return errorBox('Select Your License Expiry');
    } else if (!insurence_image?.uri) {
      return errorBox('Select Your Insurence Image');
    } else if (!experience) {
      return errorBox('Enter Your Experience');
    } else if (!licenseImageback?.uri) {
      return errorBox('Select Your License Back Image');
    } else if (!profileimage?.uri) {
      return errorBox('Select Your Profile Image');
    } else if (!idProofImageBack?.uri) {
      return errorBox('Select Your ID Proof Back Image');
    } else if (!vehicle_image?.uri) {
      return errorBox('Select Your Vehicle Image Image');
    }
    setLoading(true);
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('dob', formatDate(DOB));
    formdata.append('gender', value);
    formdata.append('vechical_number', vehicleNumber);
    formdata.append('id_proof', proofvalue);
    formdata.append('id_proof_number', idProofNumber);
    formdata.append('bank_name', bankName);
    formdata.append('bank_account_number', accountNumber);
    formdata.append('back_IFSC_code', ifscCode);
    formdata.append('full_name', fullName);
    formdata.append('insurence_number', insuranceNumber);
    formdata.append('lisence_number', licenseNumber);
    formdata.append('license_expiry_date', formatDate(licenceExpiry));
    formdata.append('phone_number', phoneNumber);
    formdata.append('experience', experience);
    formdata.append('vehicle_model', vehicle_model);
    formdata.append('payment_method', 'COD');
    formdata.append('category_id', carTypeValue);
    formdata.append('city_id', selectCity);
    formdata.append('zone_id', selectZone?selectZone:null);

    const rcFrontImageUri = rcFrontImage?.uri;
    const rcFrontImageName = rcFrontImage?.fileName;
    const rcFrontImageType = rcFrontImage?.type;

    const rcBackImageUri = rcBackImage?.uri || rcBackImage?.assets?.[0]?.uri;
    const rcBackImageName =
      rcBackImage?.fileName || rcBackImage?.assets?.[0]?.fileName;
    const rcBackImageType = rcBackImage?.type || rcBackImage?.assets?.[0]?.type;

    const idProofImageUri = idProofImage?.uri || idProofImage?.assets?.[0]?.uri;
    const idProofImageName =
      idProofImage?.fileName || idProofImage?.assets?.[0]?.fileName;
    const idProofImageType =
      idProofImage?.type || idProofImage?.assets?.[0]?.type;

    const idProofImageBackUri =
      idProofImageBack?.uri || idProofImageBack?.assets?.[0]?.uri;
    const idProofImageBackName =
      idProofImageBack?.fileName || idProofImageBack?.assets?.[0]?.fileName;
    const idProofImageBackType =
      idProofImageBack?.type || idProofImageBack?.assets?.[0]?.type;

    const insurence_imageUri =
      insurence_image?.uri || insurence_image?.assets?.[0]?.uri;
    const insurence_imageName =
      insurence_image?.fileName || insurence_image?.assets?.[0]?.fileName;
    const insurence_imageType =
      insurence_image?.type || insurence_image?.assets?.[0]?.type;

    const licenseImageUri = licenseImage?.uri;
    const licenseImageName = licenseImage?.fileName;
    const licenseImageType = licenseImage?.type;

    const licenseImageBackUri = licenseImageback?.uri;
    const licenseImageBackName = licenseImageback?.fileName;
    const licenseImageBackType = licenseImageback?.type;

    const ProfileUri = profileimage?.uri;
    const ProfileName = profileimage?.fileName;
    const ProfileType = profileimage?.type;

    const vehicle_imageUri = vehicle_image?.uri;
    const vehicle_imageName = vehicle_image?.fileName;
    const vehicle_imageType = vehicle_image?.type;

    if (rcBackImageUri && rcBackImageName && rcBackImageType) {
      formdata.append('rc_back_imge', {
        uri: rcBackImageUri,
        name: rcBackImageName,
        type: rcBackImageType,
      });
    }
    if (rcFrontImageUri && rcFrontImageName && rcFrontImageType) {
      formdata.append('rc_front_imge', {
        uri: rcFrontImageUri,
        name: rcFrontImageName,
        type: rcFrontImageType,
      });
    }
    if (idProofImageUri && idProofImageName && idProofImageType) {
      formdata.append('id_proof_front_image', {
        uri: idProofImageUri,
        name: idProofImageName,
        type: idProofImageType,
      });
    }
    if (idProofImageBackUri && idProofImageBackName && idProofImageBackType) {
      formdata.append('id_proof_back_image', {
        uri: idProofImageBackUri,
        name: idProofImageBackName,
        type: idProofImageBackType,
      });
    }
    if (insurence_imageUri && insurence_imageName && insurence_imageType) {
      formdata.append('insurence_image', {
        uri: insurence_imageUri,
        name: insurence_imageName,
        type: insurence_imageType,
      });
    }
    if (licenseImageUri && licenseImageName && licenseImageType) {
      formdata.append('lisence_front_image', {
        uri: licenseImageUri,
        name: licenseImageName,
        type: licenseImageType,
      });
    }
    if (licenseImageBackUri && licenseImageBackName && licenseImageBackType) {
      formdata.append('lisence_back_image', {
        uri: licenseImageBackUri,
        name: licenseImageBackName,
        type: licenseImageBackType,
      });
    }
    if (ProfileUri && ProfileName && ProfileType) {
      formdata.append('profile_image', {
        uri: ProfileUri,
        name: ProfileName,
        type: ProfileType,
      });
    }
    if (vehicle_imageUri && vehicle_imageName && vehicle_imageType) {
      formdata.append('vehicle_image', {
        uri: vehicle_imageUri,
        name: vehicle_imageName,
        type: vehicle_imageType,
      });
    }
    setLoading(true);

    // formdata.append('status', Data?.status);
    const DataValueRegister = await getRegister(formdata);
    if (DataValueRegister?.status) {
      setLoading(false);
      // DriverStatus(1);
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}], // replace with your actual Home screen name
      });
    } else {
      setLoading(false);

      errorBox(DataValueRegister?.res?.message);
    }
  };
  const DriverStatus = async (status: any) => {
    const Response = await getUpdate_online_sts({
      online_status: status,
      current_latitude: location?.latitude,
      current_longitude: location?.longitude,
    });
    if (Response?.status) {
      infoBox('Status Updated');
    } else {
      errorBox(Response?.res?.message);
    }
  };
  const CityApi = async () => {
    try {
      setLoading(true);
      const Response = await getCityremote();
      console.log('CityApi', Response);

      if (Response?.status) {
        const dropdownItems = Response?.data?.map(item => ({
          label: item.city_name,
          value: item.city_id,
        }));
        setCity(dropdownItems);
        // ZoneApi(dropdownItems[0]?.value);
        setSelectCity(dropdownItems[0]?.value); // Only store value, not whole object
      } else {
        setCity([]);
        setSelectCity(null);
      }
    } catch (error) {
      console.error('CityApi Error', error);
      setCity([]);
      setSelectCity(null);
    } finally {
      setLoading(false);
    }
  };
  const ZoneApi = async (id: any) => {
    try {
      // setLoading(true);
      const Response = await getZoneremote({city_id: id});
      console.log('CityApi', Response);

      if (Response?.status) {
        const dropdownItems = Response?.data?.map(item => ({
          label: item.zone_name,
          value: item.zone_id,
        }));
        setZone(dropdownItems);
        setSelectZone(dropdownItems[0]?.value); // Only store value, not whole object
      } else {
        setZone([]);
        setSelectZone(null);
      }
    } catch (error) {
      console.error('Zone Error', error);
      setZone([]);
      setSelectZone(null);
    } finally {
      // setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={[tailwind('flex-1 justify-center items-center')]}>
        <LottieView
          source={require('../../assets/gif/load.json')}
          autoPlay
          loop
          style={{width: 80, height: 80}}
        />
        {/* <FastImage
          source={require('../../assets/gif/ini.gif')}
          style={{
            height: 120,
            width: '100%',
            borderRadius: 10,
          }}
          resizeMode="contain"
        /> */}
      </View>
    );
  }

  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="Register" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register Details</Text>

        {/* Section 1: Personal Info */}
        <Section
          title="Personal Info"
          visible={profileimage?.uri && name && DOB && value && phoneNumber}>
          <View style={[tailwind('items-center mb-3'), {}]}>
            <Field
              label="Profile Image *"
              isImage
              uri={profileimage?.uri}
              onImagePress={() => pickImage('profileImage')}
            />
          </View>

          <Field
            label="Name *"
            value={name}
            fieldKey="name"
            editable
            onChangeText={(key, val) => setName(val)}
          />

          <Text style={styles.label}>Date of Birth *</Text>

          <TouchableOpacity
            onPress={() => seDatetOpen(true)}
            style={[
              tailwind('border mt-2 mb-2 px-3 rounded-full py-3 '),
              {borderColor: '#B0B0B0'},
            ]}>
            <Text style={[tailwind(''), {}]}>{formatDate(DOB)}</Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={dateopen}
            date={DOB}
            mode="date"
            maximumDate={new Date()}
            onConfirm={date => {
              seDatetOpen(false);
              setDOB(date);
            }}
            onCancel={() => seDatetOpen(false)}
          />
          {/* <Field
            label="DOB"
            value={DOB}
            fieldKey="DOB"
            editable
            onChangeText={(key, val) => setDOB(val)}
          /> */}
          <Text style={styles.label}>Gender *</Text>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Gender"
            style={{
              marginBottom: open ? 100 : 10,
              marginTop: 10,
              borderColor: '#B0B0B0',
            }} // important for scroll
          />
          <Field
            label="Mobile Number *"
            value={phoneNumber}
            fieldKey="phone_number"
            editable
            onChangeText={handleChange}
          />
        </Section>
        <Section title={'Location & Area'} visible={selectCity && selectZone}>
          {city?.length != 0 && (
            <View>
              <Text style={styles.label}>City *</Text>
              <DropDownPicker
                open={CityOpen}
                value={selectCity}
                items={city}
                setOpen={setCityOpen}
                setValue={setSelectCity}
                setItems={setCity}
                placeholder="Select City"
                style={{
                  marginBottom: CityOpen ? 100 : 10,
                  marginTop: 10,
                  borderColor: '#B0B0B0',
                }}
              />
            </View>
          )}
          {zone?.length != 0 && (
            <View>
              <Text style={styles.label}>Zone *</Text>

              <DropDownPicker
                open={zoneOpen}
                value={selectZone}
                items={zone}
                setOpen={setZoneOpen}
                setValue={setSelectZone}
                setItems={setZone}
                placeholder="Select Zone"
                style={{
                  marginBottom: zoneOpen ? 100 : 10,
                  marginTop: 10,
                  borderColor: '#B0B0B0',
                }}
              />
            </View>
          )}
        </Section>
        {/* Section 2: Vehicle Info */}
        <Section
          title="Vehicle Info"
          visible={
            rcFrontImage?.uri &&
            rcBackImage?.uri &&
            vehicle_image?.uri &&
            owner &&
            vehicleNumber &&
            vehicle_model &&
            carTypeValue
          }>
          <Field
            label="Owner *"
            value={owner}
            fieldKey="owner"
            editable
            onChangeText={handleChange}
          />
          <Field
            label="Vehicle Number *"
            value={vehicleNumber}
            fieldKey="vehicleNumber"
            editable
            onChangeText={handleChange}
          />
          <Field
            label="Vehicle Name*"
            value={vehicle_model}
            fieldKey="vehicle_model"
            editable
            onChangeText={handleChange}
          />
          <Text style={styles.label}>Car Type *</Text>

          <DropDownPicker
            open={carType}
            value={carTypeValue}
            items={carTypeItems}
            setOpen={setCarType}
            setValue={setCarTypeValue}
            setItems={setCarTypeItems}
            placeholder="Car Type *"
            style={{
              marginBottom: carType ? 100 : 10,
              marginTop: 10,
              borderColor: '#B0B0B0',
            }} // important for scroll
          />
          <Field
            label="Vehicle Image *"
            isImage
            uri={vehicle_image?.uri}
            onImagePress={() => pickImage('vehicle_image')}
          />
          {/* <Field label="RC Front Image" isImage uri={rcFrontImage} /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
            <Field
              label="RC Front Image"
              isImage
              uri={rcFrontImage?.uri}
              onImagePress={() => pickImage('rcFrontImage')}
            />
            <Field
              label="RC Back Image"
              isImage
              uri={rcBackImage?.uri}
              onImagePress={() => pickImage('rcBackImage')}
            />
          </View>
        </Section>

        {/* Section 3: ID Proof */}
        <Section
          title="ID Proof"
          visible={
            idProofImage?.uri &&
            idProofImageBack?.uri &&
            proofvalue &&
            idProofNumber
          }>
          <Text style={styles.label}>Proof Type *</Text>

          <DropDownPicker
            open={proofopen}
            value={proofvalue}
            items={proof}
            setOpen={setProofOpen}
            setValue={setProofValue}
            setItems={setProof}
            placeholder="Proof Type *"
            style={{
              marginBottom: proofopen ? 100 : 10,
              marginTop: 10,
              borderColor: '#B0B0B0',
            }} // important for scroll
          />
          {/* <Field
            label="Type"
            value={idProofType}
            fieldKey="id_proof"
            editable
            onChangeText={handleChange}
          /> */}
          <Field
            label={`${proofvalue} Number *`}
            value={idProofNumber}
            fieldKey="id_proof_number"
            editable
            onChangeText={handleChange}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
            <Field
              label={`${proofvalue} Front Image *`}
              isImage
              uri={idProofImage?.uri}
              // editable
              onImagePress={() => pickImage('id_proof_image')}
            />
            <Field
              label={`${proofvalue} Back Image *`}
              isImage
              uri={idProofImageBack?.uri}
              // editable
              onImagePress={() => pickImage('id_proof_image_Back')}
            />
          </View>
        </Section>

        {/* Section 4: Bank Details */}
        <Section
          title="Bank Info"
          visible={
            bankPassbook?.uri &&
            fullName &&
            bankName &&
            accountNumber &&
            ifscCode
          }>
          <Field
            label="Bank Name *"
            value={bankName}
            fieldKey="bank_name"
            editable
            onChangeText={handleChange}
          />

          <Field
            label="Account Number *"
            value={accountNumber}
            fieldKey="account_number"
            editable
            onChangeText={handleChange}
          />

          <Field
            label="IFSC Code *"
            value={ifscCode}
            fieldKey="ifsc_code"
            editable
            onChangeText={handleChange}
          />
          <Field
            label="Full Name *"
            value={fullName}
            fieldKey="fullName"
            editable
            onChangeText={(key, val) => setFullName(val)}
          />
          <Field
            label="Bank Passbook Image *"
            isImage
            uri={bankPassbook?.uri}
            editable
            onImagePress={() => pickImage('bank_passbook')}
          />
        </Section>

        {/* Section 5: Insurance & License */}
        <Section
          title="Insurance & License"
          visible={
            insurence_image?.uri &&
            licenseNumber &&
            insuranceNumber &&
            experience &&
            licenceExpiry &&
            licenseImage?.uri &&
            licenseImageback?.uri
          }>
          <Field
            label="Insurance Number *"
            value={insuranceNumber}
            fieldKey="insurance_number"
            editable
            onChangeText={handleChange}
          />

          <Field
            label="License Number *"
            value={licenseNumber}
            fieldKey="license_number"
            editable
            onChangeText={handleChange}
          />
          <Field
            label="Driving Experience Year*"
            value={experience}
            fieldKey="experience"
            editable
            onChangeText={handleChange}
          />
          <Text style={styles.label}>License Expiry Date *</Text>

          <TouchableOpacity
            onPress={() => seExpiryOpen(true)}
            style={[
              tailwind('border mt-2 mb-2 px-3 rounded-full py-3 '),
              {borderColor: '#B0B0B0'},
            ]}>
            <Text style={[tailwind(''), {}]}>{formatDate(licenceExpiry)}</Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={expiryopen}
            date={licenceExpiry}
            mode="date"
            // maximumDate={new Date()}
            onConfirm={date => {
              seExpiryOpen(false);
              setLicenceExpiry(date);
            }}
            onCancel={() => seExpiryOpen(false)}
          />
          <Field
            label="Insurence Image *"
            isImage
            uri={insurence_image?.uri}
            editable
            onImagePress={() => pickImage('insurence_image')}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
            <Field
              label="License Front Image *"
              isImage
              uri={licenseImage?.uri}
              editable
              onImagePress={() => pickImage('licenseImage')}
            />
            <Field
              label="License Back Image *"
              isImage
              uri={licenseImageback?.uri}
              editable
              onImagePress={() => pickImage('licenseImageBack')}
            />
          </View>
          {/* <Field label="License Image" isImage uri={userData.lisence_image} /> */}
        </Section>
        <TouchableOpacity
          onPress={() => {
            Data();
          }}
          style={[
            tailwind('bg-secondary rounded-xl px-4 py-4 my-3 items-center'),
          ]}>
          {loading ? (
            <ActivityIndicator color={'white'} size={'small'} />
          ) : (
            <Text
              style={[
                tailwind('text-center font-semibold font-16 text-black '),
              ]}>
              Register
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const Section = ({title, children, visible}) => (
  <View style={styles.section}>
    <View style={[tailwind('flex-row'), {justifyContent: 'space-between'}]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {visible && (
        <Image
          source={assets_manifest?.mark}
          style={[tailwind(''), {height: 30, width: 30}]}
        />
      )}
    </View>
    {children}
  </View>
);

const Field = ({
  label,
  value,
  isImage = false,
  uri,
  editable = false,
  onChangeText,
  fieldKey,
  onImagePress,
}) => {
  if (isImage) {
    return (
      <View
      // style={[styles.imageFieldContainer]}
      >
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onImagePress}>
          {uri ? (
            <Image source={{uri}} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.field}>
      {/* <Text style={styles.label}>{label}</Text> */}
      {editable ? (
        <TextInput
          mode="outlined"
          label={`   ${label}`}
          placeholderTextColor="black"
          // style={styles.input}
          style={[
            tailwind('text-black font-16 font-bold'),
            {
              borderRadius: 50,
              backgroundColor: 'white', // Optional: ensure background doesn't override border radius
            },
          ]}
          value={value}
          onChangeText={text => onChangeText(fieldKey, text)}
          // placeholder={`Enter ${label}`}
          outlineColor="#B0B0B0" // gray when not focused
          activeOutlineColor="#001a4f" // pink when focused (e.g., hot pink)
          theme={{
            roundness: 50, // applies to ripple and internal elements
          }}
        />
      ) : (
        <Text style={styles.value}>{value || 'Not provided'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  field: {
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  imageFieldContainer: {
    // width: 140,
    alignItems: 'center',
  },

  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode: 'cover',
  },

  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },

  placeholderText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
});
