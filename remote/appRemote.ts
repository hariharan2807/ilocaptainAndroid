import {BASE_URL, METHODS} from 'constants/API_constants';
import requestServer from '../workers/requestServer';

// API Routes

const failedLog = (functionname: string, response: any) => {
  console.log(
    `\x1b[35m  Request ${functionname} : ${JSON.stringify(response)} \x1b[0m`,
  );
  throw response;
};
