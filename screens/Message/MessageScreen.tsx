import {TopBar} from '@sharedComponents';
import tailwind from '@tailwind';
import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React from 'react';
import {geGetMessageremote, geSendMessageremote} from '../../remote/userRemote';
import {useQuery} from 'react-query';
import {useRoute} from '@react-navigation/native';
import {errorBox} from '../../workers/utils';
import FullScreenLoading from '../../sharedComponents/atoms/Screenloader';
export default function MessageScreen() {
  const route = useRoute();
  const [message, setMessage] = useState('');
  const [dataValue, SetDataValue] = useState([]);
  const flatListRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const isAtBottomRef = useRef(true);

  const GetMessage = useQuery(
    ['geGetMessageremote', route?.params?.user_id, route?.params?.driver_id],
    geGetMessageremote,
    {refetchInterval: 3000},
  );
  const sortedMessages = [...(dataValue || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;

    // Detect if user is at the bottom
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50; // 20px tolerance

    isAtBottomRef.current = isAtBottom;

    if (isAtBottom) {
      setShowScrollToBottom(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
    setShowScrollToBottom(false);
  };

  // useEffect(() => {
  //   if (!showScrollToBottom && sortedMessages.length > 0) {
  //     scrollToBottom();
  //   }
  // }, [sortedMessages]);

  useEffect(() => {
    if (GetMessage?.isSuccess) {
      SetDataValue(GetMessage?.data?.data);
    } else {
      SetDataValue([]);
    }
  }, [GetMessage?.data?.data]);

  useEffect(() => {
    if (sortedMessages.length > 0) {
      if (isAtBottomRef.current) {
        scrollToBottom(); // auto-scroll if user is at bottom
      } else {
        setShowScrollToBottom(true); // show button if user scrolled up
      }
    }
  }, [sortedMessages]);

  const SendMessage = async () => {
    const Response = await geSendMessageremote({
      sender_id: route?.params?.driver_id,
      sender_type: 'driver',
      receiver_id: route?.params?.user_id,
      receiver_type: 'user',
      message: message,
    });
    if (Response?.status) {
      setMessage('');
    } else {
      errorBox(Response?.res?.message);
    }
  };
  const data = [
    {
      id: 1,
      sender_id: 1,
      sender_type: 'user',
      receiver_id: 4,
      receiver_type: 'driver',
      message: 'Are you coming',
      created_at: '2025-06-26T10:45:47.000000Z',
      updated_at: '2025-06-26T10:45:47.000000Z',
    },
    {
      id: 2,
      sender_id: 4,
      sender_type: 'driver',
      receiver_id: 1,
      receiver_type: 'user',
      message: 'yes am coming',
      created_at: '2025-06-26T10:46:31.000000Z',
      updated_at: '2025-06-26T10:46:31.000000Z',
    },
    {
      id: 3,
      sender_id: 4,
      sender_type: 'driver',
      receiver_id: 1,
      receiver_type: 'user',
      message: 'yes am coming',
      created_at: '2025-06-26T10:52:17.000000Z',
      updated_at: '2025-06-26T10:52:17.000000Z',
    },
  ];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const renderItem = ({item}) => {
    const isUser = item.sender_type === 'driver';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.rightAlign : styles.leftAlign,
        ]}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.driverBubble,
          ]}>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
    );
  };
  if (GetMessage?.isLoading) {
    return <FullScreenLoading />;
  }
  return (
    <View style={[tailwind('h-full bg-white')]}>
      <TopBar title="Message" type={1} />

      {/* FlatList */}
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 10}}
        // style={[tailwind('flex')]}
        // inverted
        onScroll={handleScroll}
        // scrollEventThrottle={800}
        ListFooterComponent={<View style={[tailwind('h-10'), {}]} />}
      />
      {showScrollToBottom && (
        <TouchableOpacity
          onPress={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: 80, // just above input
            right: 20,
            backgroundColor: '#f1f0f0',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 15,
            elevation: 3,
            zIndex: 10,
          }}>
          <Text style={{color: 'black'}}> New Message</Text>
        </TouchableOpacity>
      )}

      <View style={[tailwind('mx-3 mb-3 '), {backgroundColor: '#f9f9f9'}]}>
        <View
          style={[
            tailwind('flex-row px-3 py-2 items-center rounded-full border'),
          ]}>
          <TextInput
            onChangeText={txt => setMessage(txt)}
            value={message}
            style={[tailwind('flex-1 px-2 py-2 text-black')]}
            placeholder="Enter Your Message"
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity
            onPress={SendMessage}
            style={tailwind('bg-secondary px-4 py-2 rounded-full ml-2')}>
            <Text style={tailwind('text-black font-medium')}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 0,
  },
  driverBubble: {
    backgroundColor: '#f1f0f0',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
