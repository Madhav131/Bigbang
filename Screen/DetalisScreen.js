import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator,
  Platform,
} from 'react-native';
import colors from './utils/colors';
import metrics from './utils/Metrics';
import RNModal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BASE_URL, ACCEPT_HEADER} from './utils/const';
import axios from 'axios';
import {SvgUri} from 'react-native-svg';

const DetailsScreen = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [getridelist, setRidelist] = useState([]);
  const [loadride, setLoadRide] = useState(false);
  const [code_image, setQRImage] = useState('');
  const [get_code, set_code] = useState('');

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      await ticket();
    });
    return unsubscribe;
  }, [props]);

  const ticket = async () => {
    const Token = await AsyncStorage.getItem('token');
    setLoadRide(true);
    await axios
      .get(BASE_URL + 'get-ticket', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer' + JSON.parse(Token),
        },
      })
      .then(res => {
        console.log('Ridelist respons-->>', res.data);
        if (res.data.success == 1) {
          setRidelist(res.data.data);
          setLoadRide(false);
        } else {
          tokenExpire();
          setLoadRide(false);
        }
      })
      .catch(err => {
        console.log('Ridelist errr-->', err);
        setLoadRide(false);
      });
  };

  return (
    <View style={styles.firstview}>
      {loadride === true ? (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.transparentBlack5,
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={colors.lightred} />
          <Text
            style={{
              color: colors.white,

              fontSize: 16,
              marginTop: 2,
            }}>
            Please wait...
          </Text>
        </View>
      ) : (
        <View style={styles.listview}>
          <FlatList
            data={getridelist}
            renderItem={({item, index}) => {
              return (
                <View style={styles.flatview}>
                  <View style={styles.fistview}>
                    <Text style={styles.textview}>Name: {item.ride.name}</Text>
                    <Text style={styles.textview}>
                      Ticket: {item.total_person}
                    </Text>
                  </View>
                  <View style={styles.fistview}>
                    <Text style={styles.textview}>Price: {item.price}</Text>
                    <Text style={styles.textview}>
                      Used: {item.used === null ? 0 : item.used}
                    </Text>
                  </View>
                  <View style={styles.fistview}>
                    <Text style={[styles.textview]}>
                      Total Amount: {item.total_amount}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      set_code(item.qr_code);
                      setQRImage(item.image_full_path);
                      setModalVisible(true);
                    }}
                    style={[
                      styles.btn_view,
                      {backgroundColor: colors.lightgreen},
                      // {
                      //   backgroundColor:
                      //     item.pt !== item.used
                      //       ? colors.lightgreen
                      //       : colors.lightred,
                      // },
                    ]}>
                    <Text style={styles.btn_text}>Show QRcode</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      )}
      {/* <TouchableOpacity
        onPress={() => props.navigation.navigate('scan')}
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
      </TouchableOpacity> */}
      <RNModal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.white,
            width: metrics.WIDTH * 0.85,
            borderRadius: 5,
            paddingBottom: metrics.HEIGHT * 0.1,
            brderRadius: 10,
            alignSelf: 'center',
          }}>
          <View
            style={{
              marginTop: 10,

              top: '15%',
            }}>
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>
              Scan Qr Code
            </Text>
            <Text
              style={{
                color: colors.black,
                marginTop: metrics.HEIGHT * 0.01,

                textAlign: 'center',
              }}>
              {get_code}
            </Text>
            <View style={{alignSelf: 'center', marginTop: '5%'}}>
              <SvgUri width={200} height={200} uri={code_image} />
            </View>
            {/* <Image
              source={require('../Screen/assets/qrcode.jpeg')}
              style={{
                height: 200,
                width: 200,
                borderRadius: 10,
                alignItems: 'center',
                alignSelf: 'center',
              }}
            /> */}
          </View>
        </View>
      </RNModal>
    </View>
  );
};

export default DetailsScreen;
const styles = StyleSheet.create({
  firstview: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listview: {
    marginTop: metrics.HEIGHT * 0.02,
    // marginHorizontal: '5%',
  },
  flatview: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: '5%',
    elevation: 7,
    marginHorizontal: '5%',
    borderColor: Platform.OS === 'ios' ? colors.gray : null,
    borderWidth: Platform.OS === 'ios' ? 1 : null,
  },
  fistview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '2%',
    marginBottom: '2%',
  },
  textview: {
    color: colors.black,
    fontSize: 18,
  },
  btn_view: {
    height: metrics.HEIGHT * 0.06,
    borderRadius: 10,

    marginBottom: '2%',
    width: metrics.WIDTH * 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  btn_text: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
});
