import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React, {useState} from 'react';
import tailwind from '@tailwind';
import {CloseIcon, DocsIcon, UploadIcon1} from '../../../assets/icons';
import Icon from 'react-native-vector-icons/Ionicons';

const UpdateDocument = (props: any) => {
  return (
    <>
      <View style={[tailwind('mb-3')]}>
        <Text style={[tailwind('font-medium font-13'), {color: 'black'}]}>
          Upload Document*
        </Text>
        {props?.fileResponse?.length != 0 ? (
          <View style={[tailwind('flex-row ')]}>
            {props?.fileResponse.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => props?.openPdf(item?.uri)}
                  key={item?.uri}
                  style={[tailwind('relative ml-3')]}>
                  <TouchableOpacity
                    onPress={() => props?.removeDoc(item?.uri)}
                    style={[
                      tailwind('absolute'),
                      {top: 10, left: 33, zIndex: 1},
                    ]}>
                    <Icon
                      name={'close-circle-sharp'}
                      size={20}
                      color={'#F44336'}
                    />
                  </TouchableOpacity>
                  <View
                    style={[
                      tailwind(
                        'rounded-full bg-green-200 items-center justify-center my-3',
                      ),
                      {width: 50, height: 50},
                    ]}>
                    <DocsIcon />
                  </View>
                  <View>
                    <Text
                      numberOfLines={2}
                      style={[tailwind('text-center'), {width: 50}]}>
                      {item?.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {/* <TouchableOpacity
              onPress={props?.handleDocumentSelection}
              style={[tailwind('mx-3')]}>
              <View
                style={[
                  tailwind(
                    'rounded-full border items-center justify-center my-3',
                  ),
                  {width: 50, height: 50, borderColor: '#A7B6F0'},
                ]}>
                <Icon name={'add-circle'} size={20} />
              </View>
            </TouchableOpacity> */}
          </View>
        ) : (
          <TouchableOpacity
            onPress={props?.handleDocumentSelection}
            style={[
              tailwind('bg-white flex-col items-center  py-4 rounded-lg mt-4 '),
              {borderWidth: 3, borderColor: '#A7B6F0', borderStyle: 'dashed'},
            ]}>
            <UploadIcon1 />
            <Text
              style={[
                tailwind('font-12 font-medium my-1'),
                {color: '#485163'},
              ]}>
              Less then 1MB
            </Text>
            <Text
              style={[tailwind('font-10 font-regular '), {color: '#A7AEBD'}]}>
              Pdf,only Upload...
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default UpdateDocument;
