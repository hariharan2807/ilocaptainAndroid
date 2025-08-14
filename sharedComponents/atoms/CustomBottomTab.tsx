import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import tailwind from '@tailwind';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import assets from '@assets';
import {
  AccoundIcon,
  AccountGrayIcon,
  Bag,
  BagColor,
  CasesGrayIcon,
  CasesIcon,
  DashboardGrayIcon,
  DashboardIcon,
} from '../../assets/icons';
import assets_manifest from '@assets';

export default function CustomBottomTab({state, descriptors, navigation}: any) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View
    style={[
      tailwind('flex-row items-center justify-between'),
      {
        paddingHorizontal: 15,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
    ]}>
  
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        // Add animation refs
        const scaleAnim = useRef(
          new Animated.Value(isFocused ? 1 : 0.8),
        ).current;
        const opacityAnim = useRef(
          new Animated.Value(isFocused ? 1 : 0.5),
        ).current;

        // Animate on focus change
        useEffect(() => {
          Animated.parallel([
            Animated.spring(scaleAnim, {
              toValue: isFocused ? 1 : 0.8,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: isFocused ? 1 : 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }, [isFocused]);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            try {
              navigation.navigate(route.state.routeNames[0]);
            } catch {
              navigation.navigate(route.name);
            }
          }
        };

        return (
          <TouchableOpacity
          key={index}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          style={[
            {
              // flex: 1,
              alignItems: 'center',
              // justifyContent: 'space-evenly',
              // marginHorizontal: 20,
              borderRadius: 30,
              backgroundColor: isFocused ? '#FFD900' : 'transparent',
              paddingVertical: 10,
              paddingHorizontal: 15,
            },
          ]}>
          <Animated.View
            style={{
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            
            {/* Icons */}
            <Image
              source={
                index === 0
                  ? assets_manifest?.Car
                  : index === 1
                  ? assets_manifest?.book
                  : assets_manifest?.setting
              }
              style={{
                height: 20,
                width: 20,
                tintColor: isFocused ? 'black' : 'gray',
                marginRight: isFocused ? 6 : 0,
              }}
            />
        
            {/* Label only when focused */}
            {isFocused && (
              <Text
                style={[
                  tailwind('font-13 font-bold'),
                  {color:isFocused?'black': '#3F4757'},
                ]}>
                {label}
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
        
        
        );
      })}
    </View>
  );
}
