import {
  HANDLE_ERROR,
  SAVE_IP,
  SAVE_JWT_TOKEN,
  VALUE_DATE,UPDATE_CART,
  USER_INFO,
  APP_CONTROL
} from '../actions/actionTypes';

const initialState = {
  error: null,
  ip: null,
  jwt_token: null,
  valuedate: null,
  cart:[],
  user:null,
  appcontrol:null
};

interface actionShape {
  type: string;
  payload: any;
}

const User = (state = initialState, action: actionShape): any => {
  switch (action.type) {
    case HANDLE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      case USER_INFO:
      return {
        ...state,
        user: action.payload,
      };
      case APP_CONTROL:
        return {
          ...state,
          appcontrol: action.payload,
        };
      case UPDATE_CART:
        return{
          ...state,
          cart:action.payload
        }
    case SAVE_IP:
      return {
        ...state,
        ip: action.payload,
      };
    case SAVE_JWT_TOKEN: {
      return {
        ...state,
        jwt_token: action.payload,
      };
    }
    case VALUE_DATE: {
      return {
        ...state,
        valuedate: action.payload,
      };
    }
    default:
      return state;
  }
};

export default User;
