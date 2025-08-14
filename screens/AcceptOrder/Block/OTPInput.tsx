import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import tailwind from 'tailwind-rn';

const CELL_COUNT = 4;

const OTPInput = ({value, onChangeText}) => {
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onChangeText}
        cellCount={CELL_COUNT}
        rootStyle={[styles.codeFieldRoot, tailwind('w-56')]}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 0,
  },
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginVertical: 7,
    marginHorizontal: 30,
    
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD900',
    borderRadius: 50,
  },
  cellText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
    focusCell: {
      // borderBottomColor: '#007AFF',
      // borderBottomWidth: 2,
      backgroundColor:"#FFD900"

    },
});

export default OTPInput;
