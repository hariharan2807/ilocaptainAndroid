import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';

export const acquireGPSPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return {
          status: true,
        };
      } else {
        throw 'Android Permission Rejected';
      }
    } else {
      const hasLocationPermission = await Geolocation.requestAuthorization(
        'always',
      );

      if (hasLocationPermission === 'granted') {
        return {
          status: true,
        };
      } else {
        throw 'IOS Permission Rejected';
      }
    }
  } catch (err) {
    return {
      status: false,
      message: typeof err === 'string' || 'failed to get GPS Location',
    };
  }
};

export const getLocationCoords = async () => {
  return new Promise(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      async success => {
        // console.log('Coords', success);
        let obj = {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        };
        resolve(obj);
      },
      async err => {
        reject(`Failed to get Location ${JSON.stringify(err)}`);
      },
      // {timeout: 3000, enableHighAccuracy: true, maximumAge: 7000},
    );
  });
};

export const infoBox = (message: string) => {
  Toast.show({
    type: 'successMsg',
    text1: message,
    topOffset: 150,
    bottomOffset: 110,
    position: 'top',
    visibilityTime: 4000,
    props: {
      text1NumberOfLines: 3,
    },
  });
  // Snackbar.show({
  //   text: message,
  //   duration: Snackbar.LENGTH_LONG,
  //   backgroundColor: '#219653',
  //   action: {
  //     text: 'OK',
  //     textColor: 'white',
  //     onPress: () => {},
  //   },
  // });
};

export const errorBox = (message: string) => {
  Toast.show({
    type: 'errorMsg',
    text1: `${message}`,
    topOffset: 150,
    bottomOffset: 110,
    position: 'top',
    visibilityTime: 4000,
    props: {
      text1NumberOfLines: 3,
    },
  });
  // Snackbar.show({
  //   text: message,
  //   duration: Snackbar.LENGTH_LONG,
  //   backgroundColor: 'red',
  //   action: {
  //     text: 'OK',
  //     textColor: 'white',
  //     onPress: () => {},
  //   },
  // });
};
export function CartItemUniqueId(
  shop_id: any,
  product_id: any,
  selected_var: any,
  selected_addons: any,
) {
  try {
    let uniqueId = `${shop_id}*${product_id}-${selected_var.product_variation_id}+`;
    if (selected_addons.length > 0) {
      let ids = [];
      for (let i of selected_addons) {
        ids.push(`${i.addon_id}+`);
      }
      uniqueId = `${uniqueId}${ids.join(`+`)}`;
    }
    return uniqueId;
  } catch (err) {
    console.log('err', err);
    return false;
  }
}
export const getGPSPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const requestResponse = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ).then(result => {
        return result;
      });
      if (requestResponse) {
        if (requestResponse == 'limited' || requestResponse == 'granted') {
          return {
            status: true,
          };
        } else {
          return {
            status: false,
          };
        }
      }
    } else {
      const hasLocationPermission = await Geolocation.requestAuthorization(
        'always',
      );
      if (hasLocationPermission === 'granted') {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    }
  } catch (err) {
    return {
      status: false,
    };
  }
};

export const resetToInitialScreen = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'InitialScreen',
        },
      ],
    }),
  );
};

export const resetToLocationPermissionScreen = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'LocationPermission',
        },
      ],
    }),
  );
};

export const resetToOnBoardScreen = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'OnBoardingScreen',
        },
      ],
    }),
  );
};

export const resetToNoInternet = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'NoInternetScreen',
        },
      ],
    }),
  );
};

export const resetToAddressSelection = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'AddressSelectionScren',
        },
      ],
    }),
  );
};

export const resetToAddressFetching = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'AddressFetchingScreen',
        },
      ],
    }),
  );
};

export const resetToBottomTabNavigation = async (
  CommonActions: any,
  navigation: any,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabNavigation',
        },
      ],
    }),
  );
};

export const isValidImageURL = (url: any) => {
  if (url != '' || url != null) {
    return url;
  } else {
    return 'https://i.pinimg.com/originals/1e/34/5b/1e345bc4e0692b0ba3bad2e73a0a815c.jpg';
  }
};
