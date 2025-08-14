import Geocoder from 'react-native-geocoding';
import requestServer from '../workers/requestServer';
import {BASE_URL, METHODS} from '../constants/API_constants';

import store from '../store/';

export const getAddressByCoordinates = async (...args) => {
  const Map_Key = store.getState().app.appcontrol.map_key;

  Geocoder.init(Map_Key);
  const geocoderResponse = await new Promise((resolve, reject) => {
    Geocoder.from(...args)
      .then(json => {
        resolve(!!json.results ? json.results[0] : []);
      })
      .catch(error => {
        reject(error);
        console.warn('Error:', error);
      });
  });

  return geocoderResponse;
};

export const googlePlacesApiRemote = async (searchText: string) => {
  const Map_Key = store.getState().app.appcontrol.map_key;
  try {
    const response = await requestServer(
      METHODS.GET,
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&types=establishment&radius=100&key=${Map_Key}&components=country:in`,
    );
    return response ? response : failedLog('googlePlacesApi()', response);
  } catch (err) {
    return false;
  }
};

const failedLog = (functionname: string, response: any) => {
  throw response;
};
