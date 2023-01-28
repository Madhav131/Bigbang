import React, {Component, useState, useRef, useEffect, useReducer} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from './component/context';
import colors from './utils/colors';
import Fonts from './utils/Fonts';
import metrics from './utils/Metrics';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {BASE_URL, ACCEPT_HEADER} from './utils/const';
// import reducer from './context/Transitionhistory_reducer';
const OtpScreen = props => {
  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);

  const [first, setFirstValue] = useState('');
  const [second, setSecondValue] = useState('');
  const [third, setThirsdValue] = useState('');
  const [fourth, setFourthValue] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [isloading, SetLoading] = useState(false);

  useEffect(async () => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setMobileNumber(props.route.params.mobile);
      setFirstValue('');
      setSecondValue('');
      setThirsdValue('');
      setFourthValue('');
    });
    return unsubscribe;
  }, []);

  const verifyOTP = async () => {
    const otp_user = first + '' + second + '' + third + '' + fourth;
    if (otp_user.length < 4) {
      Toast.show('Please Enter Valid OTP....!!!');
    } else {
      SetLoading(true);
      const formdata = new FormData();
      formdata.append('number', mobile_number);
      formdata.append('otp', otp_user);
      console.log('otp fromdata-->', formdata);
      await axios
        .post(BASE_URL + 'verify-otp', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
          },
        })
        .then(res => {
          console.log('otp respons-->>', res.data);
          if (res.data.success == 1) {
            AsyncStorage.setItem('token', JSON.stringify(res.data.token));
            AsyncStorage.setItem('islogin', 'true');
            SetLoading(false);
            props.navigation.navigate('Maintabscreen');
          } else {
            SetLoading(false);
            props.navigation.navigate('LoginScreen');
          }
        })
        .catch(err => {
          console.log('otp errr-->', err);
          SetLoading(false);
        });
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Verify Otp!</Text>
        </View>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <Text
            style={{
              color: colors.gray,
              marginTop: '7%',
              fontSize: Fonts.FontsSize.medium,
              width: '100%',
              textAlign: 'center',
            }}>
            Please enter the OTP sent via SMS on {mobile_number}
          </Text>
          <Text style={[styles.text_footer, {color: colors.lightred}]}>
            OTP *{' '}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: colors.lightred,
                justifyContent: 'center',
              }}>
              <TextInput
                ref={firstInput}
                style={{
                  fontSize: Fonts.FontsSize.medium15,
                  textAlign: 'center',
                  color: colors.black,
                }}
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={1}
                onSubmitEditing={() => secondInput.current.focus()}
                blurOnSubmit={false}
                value={first}
                onChangeText={async value => {
                  await setFirstValue(value);
                  if (value) secondInput.current.focus();
                }}
              />
            </View>

            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: colors.lightred,
                justifyContent: 'center',
              }}>
              <TextInput
                ref={secondInput}
                style={{
                  fontSize: Fonts.FontsSize.medium15,
                  textAlign: 'center',
                  color: colors.black,
                }}
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={1}
                value={second}
                onSubmitEditing={() => {
                  thirdInput.current.focus();
                }}
                blurOnSubmit={false}
                onChangeText={value => {
                  setSecondValue(value);
                  if (value) thirdInput.current.focus();
                }}
              />
            </View>

            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: colors.lightred,
                justifyContent: 'center',
              }}>
              <TextInput
                ref={thirdInput}
                style={{
                  fontSize: Fonts.FontsSize.medium15,
                  textAlign: 'center',
                  color: colors.black,
                }}
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={1}
                value={third}
                onSubmitEditing={() => {
                  fourthInput.current.focus();
                }}
                blurOnSubmit={false}
                onChangeText={value => {
                  setThirsdValue(value);
                  if (value) fourthInput.current.focus();
                }}
              />
            </View>

            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: colors.lightred,
                justifyContent: 'center',
              }}>
              <TextInput
                ref={fourthInput}
                style={{
                  fontSize: Fonts.FontsSize.medium15,
                  textAlign: 'center',
                  color: colors.black,
                }}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={1}
                value={fourth}
                blurOnSubmit={false}
                onChangeText={value => {
                  setFourthValue(value);
                }}
                onSubmitEditing={() => verifyOTP()}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.signIn, {backgroundColor: colors.lightred}]}
            onPress={() => verifyOTP()}>
            {isloading === true ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[styles.textSign, {color: colors.white}]}>
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};
export default OtpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightred,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    marginBottom: '5%',
    marginTop: '5%',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: '10%',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
