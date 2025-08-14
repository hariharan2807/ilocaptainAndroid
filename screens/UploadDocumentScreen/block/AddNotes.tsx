import {View, Text, TextInput} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
const AddNotes = () => {
  return (
    <View style={[tailwind('')]}>
      <Text style={[tailwind('font-13 font-medium '), {color: '#818CA1'}]}>
        Add Notes*
      </Text>
      <View style={[tailwind('bg-white rounded-lg my-3')]}>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Add additional Information  if u have...."
          placeholderTextColor={'#A7AEBD'}
        />
      </View>
    </View>
  );
};

export default AddNotes;
