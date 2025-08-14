import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path} from 'react-native-svg';

const AccountGrayIcon = () => {
  return (
    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.6497 8.65862C13.5505 9.68521 15.6574 12.3913 15.8001 15.6088C13.4266 16.1821 10.8127 16.5 8.06664 16.5C5.32062 16.5 2.70667 16.1821 0.333252 15.6088C0.475926 12.3912 2.58277 9.68515 5.48376 8.65859C6.25594 9.06315 7.13451 9.29235 8.06674 9.29235C8.99894 9.29235 9.87748 9.06318 10.6497 8.65862ZM8.06674 0.500031C10.0694 0.500031 11.6929 2.12353 11.6929 4.12615C11.6929 6.1288 10.0694 7.75231 8.06674 7.75231C6.06413 7.75231 4.44059 6.1288 4.44059 4.12615C4.44059 2.1235 6.06409 0.500031 8.06674 0.500031Z"
        fill="#A7AEBD"
      />
    </Svg>
  );
};

export default AccountGrayIcon;
