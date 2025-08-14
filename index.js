/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import OneSignal from 'react-native-onesignal';
import App from './App';
import {name as appName} from './app.json';
import { getNotification, saveNotification, saveOpenNotification } from './workers/localStorage';
import { format } from 'date-fns';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

OneSignal.setAppId('f325aa88-d4df-4a4e-9bb9-e83e8728ad27');
// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.setLogLevel(6, 0);


// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
// OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
// OneSignal.Notifications.addEventListener('received', async (notification) => {
//   console.log('OneSignal: notification received:', notification);
//   await NotificationHandle(notification.payload); // Adjust according to the structure of your notification payload
// });

// // Listener for when notifications are clicked
// OneSignal.Notifications.addEventListener('clicked', notifications => {
//   console.log('OneSignal: notification clicked:', notifications);
// });
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  // console.log('Prompt response:', response);
});
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    console.log(
      '\x1b[36m OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    try{
      // let notification = notificationReceivedEvent.getNotification();
      let notification = notificationReceivedEvent.getNotification();
      // console.log('\x1b[36m notification: ', notification);
      const data = notification?.additionalData;
      // console.log('additionalData: ', data);
      const title = notification?.title;
      const body = notification?.body;
      const bigPicture = notification?.bigPicture;
      const launchURL = data?.linkURL;
  
      const order_status = data?.order_status;
      const type = data?.type;
      const order_id = data?.order_id;
      const order_type = data?.order_type;
      const category_id = data?.category_id;
      const category_name = data?.category_name;
      const notification_type = data?.notification_type;
      const event_id = data?.event_id;

      let date =new Date();
      let f_date = format(new Date(), 'dd-MM-yyyy');
      let f_time = format(new Date(), 'hh:mm - a');
  
      const obj = {
        title: title,
        body: body,
        picture: bigPicture,
        launchURL: launchURL,
        notification_type:notification_type,
        order_status: order_status,
        type: type,
        order_id: order_id,
        order_type: order_type,
        category_id: category_id,
        category_name:category_name,
        status: false,
        date: date,
        event_id:event_id,
        f_date: f_date,
        time: f_time,
      };
      SaveNotificationToLocal(obj)
      notificationReceivedEvent.complete(notification);
      // Complete with null means don't show a notification.
    }catch(err){
      // console.log('notification: err ', err);
    }
   
  
  },
);
//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  // console.log('\x1b[36m OneSignal: notification opened:', notification?.notification);
  try{
    const data = notification?.notification?.additionalData;
    const title = notification?.notification?.title;
    const body = notification?.notification?.body;
    const bigPicture = notification?.notification?.bigPicture;
    const launchURL = notification?.notification?.additionalData?.linkURL;
  
    const order_status = data?.order_status;
    const type = data?.type;
    const notification_type=data.notification_type;
    const order_type = data?.order_type;
    const order_id = data?.order_id;
    const category_id = data?.category_id;
    const category_name = data?.category_name;
    const event_id = data?.event_id;
    let date =new Date();
  
    const obj = {
      title: title,
      body: body,
      picture: bigPicture,
      launchURL: launchURL,
      notification_type:notification_type,
      order_status: order_status,
      type: type,
      order_id: order_id,
      order_type: order_type,
      category_id: category_id,
      category_name:category_name,
      status: false,
      event_id:event_id,
      date: date,
    };
    oprnHandlerNav(obj);
  }catch(err){
      // console.log('notificatOneSignal: notification opened : err ', err);
    }

});
AppRegistry.registerComponent(appName, () => App);


const SaveNotificationToLocal = async (params: any) => {
    // console.log('\x1b[35m SaveNotificationToLocal:', params);
    let value = [];
    try {
        const oldnotification = await getNotification();
        if (oldnotification?.length > 0) {
          const finder = oldnotification.some(item => {
            return item.time == params.time;
          });
          // console.log('\x1b[36m finder',finder);
          if (finder) {
            return;
          } else {
            value = [params, ...oldnotification]
            await saveNotification(value)
            store.dispatch(saveNotificationAction(value));
          }
        } else {
          value = [params, ...oldnotification]
          await saveNotification(value)
          store.dispatch(saveNotificationAction(value));
        }
       
    } catch (err) {
        Redlog('SaveNotificationToLocal err'), err
        // value = [params]
        // await saveNotification(value)
    }

}
const oprnHandlerNav = async (params: any) => {
  // console.log('\x1b[35m oprnHandlerNav:', params);
  try {
    saveOpenNotification(params)
    // store.dispatch(openNotificationAction(params));
  } catch (err) {
    // store.dispatch(openNotificationAction(params));
  }

}