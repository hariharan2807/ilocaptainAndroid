import requestServer from '../workers/requestServer';
import {BASE_URL, METHODS} from '../constants/API_constants';
import requestServerMultiPart from '../workers/requestServermultipart';

const req_dashboard = 'api/rider/dashboard';
const req_update_online_sts = 'api/rider/update_online_sts';
const req_riderlogin = 'api/rider/riderlogin';
const req_myprofile = 'api/rider/myprofile';
const req_get_new_trip = 'api/rider/get_new_trip';
const req_update_trip_sts = 'api/rider/update_trip_sts';
const req_single_trip = 'api/rider/single_trip';
const req_rider_cancellation_reasons = 'api/rider/rider_cancellation_reasons';
const req_rider_cancel_reason_update = 'api/rider/rider_cancel_reason_update';
const req_today_trip = 'api/rider/today_trip';
const req_all_trip_history = 'api/rider/all_trip_history';
const req_earnings = 'api/rider/earnings';
const req_register = 'api/rider/register';
const req_register_check = 'api/rider/register_check';
const req_verifyotp = 'api/rider/verifyotp';
const req_edit_profile = 'api/rider/edit_profile';
const req_category = 'api/rider/category';
const req_Qr = 'api/rider/qr';
const req_app_control = 'api/user/app_control';
const req_update_payment_sts = 'api/rider/update_payment_sts';
const req_Razorpay = 'api/rider/razorpay/create';
const req_sendMessage = 'api/chat/send';
const req_getMessage = 'api/chat/get';
const req_withdraw='api/rider/razorpay/withdraw'
const req_withdraw_history='api/rider/withdraw_history'
const req_get_schedule_trips='api/rider/get_schedule_trips'
const req_get_city='api/rider/city'
const req_get_zone='api/rider/zone'
const req_deactivate = 'api/rider/deactivate';

//OnlY POSTzone
//Get query key

export const getLoginremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_riderlogin,
      payload,
    );
    return response.status === 200
      ? response
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geQrremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_Qr,
      // {trip_id: params.queryKey[1]},
      payload,
    );
    return response.status === 200
      ? response
      : failedLog('geQrremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getDeactivateRemote=async()=>{
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_deactivate,
      // payload,
    );
    return response.status === 200
      ? response
      : failedLog('geQrremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
}
export const geRazorPayremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_Razorpay,
      payload,
    );
    return response.status === 200
      ? response?.data?.data
      : failedLog('geQrremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geSendMessageremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_sendMessage,
      payload,
    );
    return response.status === 200
      ? response
      : failedLog('geSendMessageremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geGetMessageremote = async (params: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_getMessage,
      {user_id: params.queryKey[1], driver_id: params.queryKey[2]},
    );
    return response.status === 200
      ? response?.data
      : failedLog('geGetMessageremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};

export const geWithdrawlremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_withdraw,
      payload
    );
    return response.status === 200
      ? response?.data
      : failedLog('geWithdrawlremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geWithdrawHistorylremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_withdraw_history,
      // payload
    );
    return response.status === 200
      ? response?.data?.data
      : failedLog('geWithdrawlremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geSchedlueremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_get_schedule_trips,
      // payload
    );
    return response.status === 200
      ? response?.data
      : failedLog('geWithdrawlremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getCityremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_get_city,
      // payload
    );
    return response.status === 200
      ? response?.data
      : failedLog('geWithdrawlremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getZoneremote = async (payload:any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_get_zone,
      payload
    );
    return response.status === 200
      ? response?.data
      : failedLog('geWithdrawlremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const geRazorpayPaymentStatusremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_update_payment_sts,
      payload,
    );
    return response.status === 200
      ? response?.data?.data
      : failedLog('geQrremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};

export const getCategoryremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_category,
      // payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getVerifyOtpremote = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_verifyotp,
      payload,
    );
    return response.status === 200
      ? response
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getResonUpdate = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_rider_cancel_reason_update,
      payload,
    );
    return response.status === 200
      ? response
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getMyprofileremote = async () => {
  try {
    const response = await requestServer(METHODS.GET, BASE_URL + req_myprofile);
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getTodayTripremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_today_trip,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getAllTripHistoryremote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_all_trip_history,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getNewOrder = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_get_new_trip,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getNewOrder()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getRiderCancelList = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_rider_cancellation_reasons,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getNewOrder()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const initiateAppControllRemote = async () => {
  try {
    const response = await requestServer(
      METHODS.GET,
      BASE_URL + req_app_control,
      // payload,
    );
    if (response.status === 200) {
      return response?.data;
    } else if (response.status === 404) {
      return response.data;
    }
  } catch (err) {
    return false;
  }
};
export const getUpdate_online_sts = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_update_online_sts,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getEarning = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_earnings,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getRegister = async (payload: any) => {
  try {
    const response = await requestServerMultiPart(
      METHODS.POST,
      BASE_URL + req_register,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getEditProfile = async (payload: any) => {
  try {
    const response = await requestServerMultiPart(
      METHODS.POST,
      BASE_URL + req_edit_profile,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getRegisterCheck = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_register_check,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getUpdate_trip_sts = async (payload: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_update_trip_sts,
      payload,
    );
    return response.status === 200
      ? response?.data
      : failedLog('getLoginremote()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};
export const getDashboard = async () => {
  try {
    const response = await requestServer(METHODS.GET, BASE_URL + req_dashboard);
    return response.status === 200
      ? response?.data
      : failedLog('getDashboard()', response);
  } catch (err) {
    return {
      status: false,
      statusCode: err?.statusCode,
      res: err?.data,
    };
  }
};

export const Get_Single_trip = async (params: any) => {
  try {
    const response = await requestServer(
      METHODS.POST,
      BASE_URL + req_single_trip,
      params,
    );
    if (response.status === 200) {
      return response?.data;
    } else if (response.status === 404) {
      return response;
    }
  } catch (err) {
    return err;
  }
};

const failedLog = (functionname: string, response: any) => {
  console.log(
    `\x1b[35m  Request ${functionname} : ${JSON.stringify(response)} \x1b[0m`,
  );
  throw response;
};
