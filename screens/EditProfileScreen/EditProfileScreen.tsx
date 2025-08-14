import tailwind from '@tailwind';
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TopBar} from '@sharedComponents';
import assets_manifest from '@assets';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  getEditProfile,
  getMyprofileremote,
  getVerifyOtpremote,
} from '../../remote/userRemote';
import {SaveDate, saveuserInfo} from '../../store/actions/userActions';
import {errorBox} from '../../workers/utils';
import {useNavigation} from '@react-navigation/native';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CartState = useSelector(state => state.user.user);
  const [imageUri, setImageUri] = useState(null);
  const [imageUri1, setImageUri1] = useState(CartState?.driver_image);
const [loading,setLoading]=useState(false)
  const [name, setName] = useState(CartState?.driver_name);
  const [email, setEmail] = useState(CartState?.driver_email);
  const [mobile, setMobile] = useState(CartState?.driver_phone_number);
  const pickImage = fieldKey => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || !response.assets?.[0]) return;

      const imageAsset = response.assets[0];
      handleChange(fieldKey, imageAsset);
    });
  };
  const handleChange = (key, value) => {
    switch (key) {
      case 'profile':
        setImageUri(value);
        break;

      default:
        console.warn(`No setter found for key: ${key}`);
    }
  };
 
  const Edit_Profile = async () => {
    if (!name) {
      errorBox('Enter your Name');
      return;
    }
    if (!email) {
      errorBox('Enter your Email');
      return;
    }
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('email', email);
  
    // // ✅ Case 1: User selected new image (local image)
    // if (imageUri?.uri && imageUri?.fileName && imageUri?.type) {
    //   formdata.append('image', {
    //     uri: imageUri.uri,
    //     name: imageUri.fileName,
    //     type: imageUri.type,
    //   });
    // }
  
    // // ✅ Case 2: No new image selected, but existing profile image is available (URL)
    // else if (imageUri1?.startsWith('http')) {
    //   const fileName = imageUri1.split('/').pop();
    //   const ext = fileName?.split('.').pop()?.toLowerCase();
    //   const mimeType =
    //     ext === 'png'
    //       ? 'image/png'
    //       : ext === 'webp'
    //       ? 'image/webp'
    //       : 'image/jpeg'; // default
  
    //   formdata.append('image', {
    //     uri: imageUri1,
    //     name: fileName || 'profile.jpg',
    //     type: mimeType,
    //   });
    // }
  
    // 🛠️ Optional: If image is not mandatory, skip if nothing is selected
    // else {
    //   errorBox('Please select a profile image.');
    //   return;
    // }
  
    try {
      setLoading(true)

      const Data = await getEditProfile(formdata);
      if (Data?.status) {
        setLoading(false)

        const getProfile = await getMyprofileremote();
        if (getProfile?.data?.driver_name) {
          dispatch(saveuserInfo(getProfile?.data));
          navigation.reset({
            routes: [{ name: 'BottomTabNavigation' }],
          });
        }
      } else {
        setLoading(false)

        errorBox(Data?.res?.message || 'Update failed');
      }
    } catch (err) {
      setLoading(false)

      errorBox('Something went wrong.');
    }
  };
  
  const Field = ({
    label,
    value,
    isImage = false,
    uri,
    editable = false,
    onChangeText,
    fieldKey,
    onImagePress,
    already,
  }) => {
    if (!isImage) {
      /* render normal text input here … */
      return null;
    }

    // Work out what we should actually render
    const displayUri = uri // freshly‑picked image
      ? uri // string → "file:///…"
      : already // previously‑saved name
      ? `${already}`
      : null; // nothing yet

    return (
      <View>
        {/* <TouchableOpacity onPress={onImagePress}> */}
          {displayUri ? (
            <Image
              source={{uri: displayUri}}
              defaultSource={assets_manifest?.react_logo}
              style={{
                width: 120,
                height: 120,
                borderRadius: 70,
                borderWidth: 1,
                borderColor: '#ccc',
                resizeMode: 'cover',
              }}
            />
          ) : (
            <Image
              source={assets_manifest?.react_logo}
              style={{
                width: 120,
                height: 120,
                borderRadius: 70,
                borderWidth: 1,
                borderColor: '#ccc',
                resizeMode: 'cover',
              }}
            />
          )}
        {/* </TouchableOpacity> */}
      </View>
    );
  };
  if(loading){
    return<FullScreenLoading/>
  }
  return (
    <View style={[tailwind('h-full'), {}]}>
      <TopBar title="EditProfile" type={1} />
      <View style={[tailwind('items-center mt-5'), {}]}>
        <Field
          label="Insurence Image *"
          isImage
          uri={imageUri?.uri}
          already={imageUri1}
          editable
          // onImagePress={() => pickImage('profile')}
        />
        <Text style={[tailwind('font-20 font-semibold text-black mt-3'), {}]}>
          Say a little bit about yourself...
        </Text>
      </View>
      <View style={[tailwind('ml-3 mr-3 py-3 mt-5'), {}]}>
        <Text  style={[tailwind('text-gray-700')]}>Username</Text>
        <View
          style={[
            tailwind('flex-row  mt-3 px-3 items-center py-3 bg-white rounded-xl'),
            {},
          ]}>
          <Image
            source={assets_manifest?.user}
            style={[tailwind(''), {height: 20, width: 20}]}
          />
          <TextInput
            onChangeText={t => {
              setName(t);
            }}
            value={name}
            placeholder="Name"
            style={[tailwind('ml-3 text-black'), {flex: 1}]}
          />
        </View>
      </View>
      <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
        <Text  style={[tailwind('text-gray-700')]}>Email</Text>
        <View
          style={[
            tailwind('flex-row items-center  mt-3 px-3 py-3 bg-white rounded-xl'),
            {},
          ]}>
          <Image
            source={assets_manifest?.mail}
            style={[tailwind(''), {height: 20, width: 20}]}
          />
          <TextInput
            onChangeText={t => {
              setEmail(t);
            }}
            value={email}
            placeholder="email"
            style={[tailwind('ml-3 text-black'), {flex: 1}]}
          />
        </View>
      </View>
      <View style={[tailwind('ml-3 mr-3 py-3 '), {}]}>
        <Text  style={[tailwind('text-gray-700')]}>Mobile Number</Text>
        <View
          style={[
            tailwind('flex-row items-center mt-3 px-3 py-3 bg-white rounded-xl'),
            {},
          ]}>
          <Image
            source={assets_manifest?.smartphone}
            style={[tailwind(''), {height: 20, width: 20}]}
          />
          <TextInput
            editable={false}
            onChangeText={t => {
              setMobile(t);
            }}
            value={mobile}
            placeholder="Mobile Number"
            style={[tailwind('ml-3 text-black'), {flex: 1}]}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          Edit_Profile();
        }}
        style={[tailwind('ml-3 mr-3 mt-5 rounded-xl py-3 bg-secondary'), {}]}>
        <Text style={[tailwind('text-center text-black font-bold font-15'), {}]}>
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
