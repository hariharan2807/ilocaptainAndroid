import {METHODS} from '../constants/API_constants';
import store from '../store/index';
import {
  getTokenuser,
} from './localStorage';

const requestServerMultiPart = function (
  method: string,
  url: string,
  payload?: any,
): any {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 150000);
  return new Promise(async (resolve, reject) => {
    //for token
    let token = store.getState().user.jwt_token;

    if (!token) {
      const sinfoToken = await getTokenuser();
      token = sinfoToken;
    
    }
    let options: any = {
      signal: controller.signal,
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    };
    if (method === METHODS.POST || method === METHODS.GET) {
      options.body = JSON.stringify(payload);
    }

    fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
      method: 'POST',
      body: payload,
    })
      .then(async serverResponse => {
        clearTimeout(timeoutId);
        if (serverResponse.ok) {
          logRequest(url, payload);
          if (serverResponse.headers.get('content-length') === '0') {
            resolve({status: serverResponse.status});
          } else {
            serverResponse
              .json()
              .then(data => {
                resolve({status: serverResponse.status, data});
              })
              .catch(err => {
                ErrorRequest(url, payload);
                reject('Parse Failed');
              });
          }
        } else {
          ErrorRequest(url, payload);

          serverResponse
            .json()
            .then(data => {
              // console.log('data-----', data);
              reject({status: false, statusCode: serverResponse.status, data});
            })
            .catch(err => {
              reject({status: false, statusCode: serverResponse.status, err});
            });
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);

        console.log('err', err);
        ErrorRequest(url, payload);
        reject({status: false, err});
      });
  });
};

export default requestServerMultiPart;

const logRequest = (url: string, payload: any) => {
  console.log(`\x1b[32m  Request ${url} : ${JSON.stringify(payload)} \x1b[0m`);
};
const ErrorRequest = (url: string, payload: any) => {
  console.log(
    `\x1b[33m [*ERROR*] Request ${url} : ${JSON.stringify(payload)} \x1b[0m`,
  );
};
