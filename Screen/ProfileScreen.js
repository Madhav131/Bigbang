import React, {Component, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from './utils/colors';
import Fonts from './utils/Fonts';
import metrics from './utils/Metrics';
import {AuthContext} from './component/context';
import axios from 'axios';
import {ACCEPT_HEADER, BASE_URL} from '../Screen/utils/const';
import {SvgUri} from 'react-native-svg';
import RNModal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
function ProfileScreen({navigation}) {
  const [userprofile, setprofile] = useState('');
  const [get_number, set_number] = useState('');
  const [get_code, set_code] = useState('');
  const [getwallet, setWallet] = useState(0);
  const [code_image, setQRImage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      getuser();
    });
  }, [navigation]);

  const logout = async () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('islogin');
    AsyncStorage.clear();
    setModalVisible(false);
    navigation.replace('splashScreen');
  };

  const ioslogout = () => {
    setModalVisible(false);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('islogin');
    AsyncStorage.clear();

    navigation.navigate('splashScreen');
  };

  const getuser = async () => {
    const Token = await AsyncStorage.getItem('token');
    setLoading(true);
    await axios
      .get(BASE_URL + 'get-user', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer' + JSON.parse(Token),
        },
      })
      .then(res => {
        console.log('profile respons-->>', res.data);
        if (res.data.success == 1) {
          set_number(res.data.data.number);
          set_code(res.data.data.qr_code);
          setWallet(res.data.data.wallet);
          setQRImage(res.data.data.image_full_path);
          setLoading(false);
        } else {
          logout();
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('profile errr-->', err);
        setLoading(false);
      });
  };

  const deleteacoount = async () => {
    var Token = await AsyncStorage.getItem('token');
    await axios
      .get(BASE_URL + 'delete-account', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + JSON.parse(Token),
        },
      })
      .then(res => {
        console.log('respons-->>', res.data);
        Toast.show(res.data.message);
        logout();
      })
      .catch(err => {});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.black} />
      <TouchableOpacity
        onPress={() => getuser()}
        style={{
          alignSelf: 'flex-end',
          marginHorizontal: '8%',
          marginTop: metrics.HEIGHT * 0.05,
        }}>
        <FontAwesome name="refresh" color={colors.black} size={30} />
      </TouchableOpacity>
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isloading === true ? (
          <ActivityIndicator color={colors.lightred} size="large" />
        ) : (
          <>
            <View style={{alignItems: 'center', width: '100%'}}>
              <SvgUri width={200} height={200} uri={code_image} />
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: Fonts.FontsSize.input,
                  fontWeight: 'bold',
                  color: colors.black,
                  marginTop: metrics.doubleBaseMargin,
                }}>
                {get_code}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: Fonts.FontsSize.input,
                  fontWeight: 'bold',
                  color: colors.black,
                  marginTop: metrics.doubleBaseMargin,
                }}>
                Mobile No: {get_number}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: Fonts.FontsSize.input,
                  fontWeight: 'bold',
                  color: colors.black,
                  marginTop: metrics.doubleBaseMargin,
                }}>
                Wallet: {getwallet}
              </Text>
            </View>
            <TouchableOpacity
              // onPress={() => logout()}
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                alignSelf: 'center',
                marginTop: '5%',
                marginHorizontal: '3%',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: '60%',
                height: metrics.HEIGHT * 0.075,
                backgroundColor: colors.lightred,
              }}>
              <Text style={{color: colors.white, fontWeight: 'bold'}}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <RNModal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.white,
            width: metrics.WIDTH * 0.85,
            borderRadius: 5,
            paddingBottom: metrics.HEIGHT * 0.06,
            brderRadius: 15,
            alignSelf: 'center',
          }}>
          <View
            style={{
              marginTop: 10,

              // top: '15%',
            }}>
            <Image
              source={require('../Screen/assets/important.jpeg')}
              style={{
                height: 200,
                width: 200,
                borderRadius: 10,
                alignItems: 'center',
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: colors.black,
                marginTop: metrics.HEIGHT * 0.01,
                marginHorizontal: '5%',
                lineHeight: 24,
                fontSize: 16,
                textAlign: 'center',
              }}>
              ARE YOU SURE YOUR ACCOUNT DELETED, IF DELETE CLEAR YOUR
              HISTORY..!!!
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '5%',
              marginTop: metrics.HEIGHT * 0.05,
            }}>
            <TouchableOpacity
              onPress={() => deleteacoount()}
              style={{
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: '45%',
                height: metrics.HEIGHT * 0.075,
                backgroundColor: colors.lightred,
              }}>
              <Text style={{color: colors.white, fontWeight: 'bold'}}>
                DELETE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (Platform.OS === 'ios' ? ioslogout() : logout())}
              style={{
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: '45%',
                height: metrics.HEIGHT * 0.075,
                backgroundColor: colors.lightred,
              }}>
              <Text style={{color: colors.white, fontWeight: 'bold'}}>
                LOGOUT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

{
  /* <TouchableOpacity
          onPress={() => navigation.navigate('scan')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: metrics.images.large,
            backgroundColor: colors.lightred,
            width: metrics.images.large,
            borderRadius: metrics.images.large,
            alignSelf: 'flex-end',
            paddingRight: '5%',
          }}>
          <MaterialCommunityIcons
            name="barcode-scan"
            color={colors.white}
            size={25}
          />
        </TouchableOpacity> */
}

{
  /* <Image
            source={
              userprofile == null || userprofile == ''
                ? require('../Screen/assets/qrcode.jpeg')
                : { uri: userprofile }
            }
            style={{
              height: 200,
              width: 200,
              borderRadius: 10,
              borderWidth: 3,
              borderColor: colors.lightred,
            }}
            resizeMode="contain"
          /> */
}
{
  /* <TouchableOpacity
            // onPress={() => navigation.navigate('EditScreen', {names: username})}

            style={{
              backgroundColor: colors.golden,
              height: 45,
              width: 45,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              left: '55%',
            }}>
            <MaterialIcons name={'edit'} color="white" size={18} />
          </TouchableOpacity> */
}
