import React, {useState, useEffect} from 'react';
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
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import colors from './utils/colors';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {ACCEPT_HEADER, BASE_URL} from './utils/const';

const LoginScreen = props => {
  const [get_number, set_number] = useState('');
  const [isloading, SetLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      set_number('');
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    if (get_number === '') {
      Toast.show('Enter The Mobile Number..!!');
    } else {
      SetLoading(true);
      const formdata = new FormData();
      formdata.append('number', get_number);
      console.log('login fromdata-->', formdata);
      await axios
        .post(BASE_URL + 'user-login', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
          },
        })
        .then(res => {
          console.log('respons login-->>', res.data);
          if (res.data.success == 1) {
            Toast.show(res.data.message);
            SetLoading(false);
            props.navigation.replace('OtpScreen', {
              mobile: get_number,
            });
          } else {
            SetLoading(false);
          }
        })
        .catch(err => {
          console.log('errr login-->', err);
          SetLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
            <View style={styles.header}>
              <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
              <Text style={styles.text_footer}>Mobile Number</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color={colors.lightred} size={20} />
                <TextInput
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#666666"
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  maxLength={10}
                  // autoFocus={true}
                  onChangeText={value => set_number(value)}
                />
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {
                    // props.navigation.navigate('OtpScreen', {
                    //   mobile: get_number,
                    // });
                    login();
                  }}>
                  <LinearGradient
                    colors={[colors.lightred, colors.lightred]}
                    style={styles.signIn}>
                    {isloading === true ? (
                      <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                      <Text style={[styles.textSign, {color: colors.white}]}>
                        Sign In
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  //   onPress={() => navigation.navigate('SingUpScreen')}
                  style={[
                    styles.signIn,
                    {
                      borderColor: colors.lightred,
                      borderWidth: 1,
                      marginTop: '10%',
                      backgroundColor: colors.white,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: colors.black,
                      },
                    ]}>
                    Sign Up
                  </Text>
                </TouchableOpacity> */}
              </View>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;
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
    color: colors.lightred,
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightred,
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
    color: colors.black,
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
    // elevation: 3,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

//   const [checkPermission, setcheckPermission] = useState("");

//   useEffect(async () => {
//     await messageListener();

//     PushNotification.createChannel(
//       {
//         channelName: 'channel',
//         channelId: 'channel',
//         playSound: false,
//         soundName: 'default',
//         vibrate: true,
//       },
//       created => console.log(`createChannel returned '${created}'`),
//     );
//     Book();
//     const unsubscribe = navigation.addListener('focus', () => {
//       Book();
//     });

//     return unsubscribe;
//   }, [navigation]);
// const messageListener = async () => {
//   messaging().onMessage(async remoteMessage => {
//     console.log('remote---------', remoteMessage);
//     PushNotification.localNotification({
//       message: remoteMessage.notification.body,
//       title: remoteMessage.notification.title,
//       bigPictureUrl: remoteMessage.notification.android.imageUrl,
//       smallIcon: remoteMessage.notification.android.imageUrl,
//       channelId: 'channel',
//       repeatTime: 1,
//     });
//     // setMessage(remoteMessage)
//   });
// };
// backgroundNotificationHandler = async remoteMessage => {
//   console.log('----------background message : ', remoteMessage);
//   PushNotification.localNotification({
//     message: remoteMessage.notification.body,
//     title: remoteMessage.notification.title,
//     bigPictureUrl: remoteMessage.notification.android.imageUrl,
//     smallIcon: remoteMessage.notification.android.imageUrl,
//     channelId: 'channel',
//     repeatTime: 1,
//   });
//   // setMessage(remoteMessage)
// };

// setMessage = async remoteMessage => {
//   console.log(remoteMessage);
// };
