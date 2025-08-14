import {Animated, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import tailwind from '@tailwind';
import Topbar from './Topbar';
const CustomizedTopBar = ({state, descriptors, navigation, position}) => {
  return (
    <>
      <Topbar title={'Cases'} />
      {/* <ScrollView></ScrollView> */}
      <View style={[tailwind('flex flex-row bg-white items-center')]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return (
            <ScrollView horizontal={true}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{flex: 1}}>
                <View
                  style={[
                    tailwind('mx-3'),
                    {
                      borderBottomWidth: 3,
                      borderBottomColor: isFocused ? '#284DDA' : '#fff',
                      marginRight: 10,
                      //   borderTopRightRadius: 6,
                      //   borderTopLeftRadius: 6,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind(
                        `text-white py-3 font-16 font-medium text-center `,
                      ),
                      {color: isFocused ? '#3F4757' : '#A7AEBD'},
                    ]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          );
        })}
      </View>
    </>
  );
};

export default CustomizedTopBar;
