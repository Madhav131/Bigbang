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
  ImageBackground,
  Platform,
} from 'react-native';
import colors from './utils/colors';
import metrics from './utils/Metrics';
import RNModal from 'react-native-modal';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from './utils/const';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
const DATA = [
  {
    id: 1,
    name: 'abc',
    pt: 2,
    used: 1,
    price: 200,
    img: require('../Screen/assets/qrcode.jpeg'),
  },
  {
    id: 2,
    name: 'xyz',
    pt: 5,
    used: 3,
    price: 500,
    img: require('../Screen/assets/qrcode.jpeg'),
  },
  {
    id: 3,
    name: 'fff',
    pt: 3,
    used: 3,
    price: 500,
    img: require('../Screen/assets/qrcode.jpeg'),
  },
];
const Ridelist = props => {
  const [getridelist, setRidelist] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [getimg, setimg] = useState('');
  const [ridename, setRidename] = useState('');
  const [getdis, setDis] = useState('');
  const [amount, setaemount] = useState('');
  const [holiday, setHoliday] = useState('');
  const [weekend, setWeekend] = useState('');
  const [getpicker, setPicker] = useState();
  const [rideid, setRideID] = useState('');
  const [isloading, setLoading] = useState(false);
  const [loadride, setLoadRide] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      await ridelist();
    });
    return unsubscribe;
  }, [props]);

  const tokenExpire = () => {
    AsyncStorage.clear();
    AsyncStorage.removeItem('islogin');
    AsyncStorage.removeItem('token');
    props.navigation.replace('splashScreen');
  };

  const ridelist = async () => {
    const Token = await AsyncStorage.getItem('token');
    setLoadRide(true);
    await axios
      .get(BASE_URL + 'get-ride', {
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

  const creteticket = async () => {
    if (getpicker === '') {
      Toast.show('select person...!!!');
    } else {
      const Token = await AsyncStorage.getItem('token');
      setLoading(true);
      const fromdata = new FormData();
      fromdata.append('ride_id', rideid);
      fromdata.append('total_person', getpicker);
      fromdata.append('payment_type', 'wallet');
      console.log('ticket fromdat->', fromdata);
      await axios
        .post(BASE_URL + 'create-ticket', fromdata, {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer' + JSON.parse(Token),
          },
        })
        .then(res => {
          console.log('crete ticket respons-->>', res.data);
          if (res.data.success == 1) {
            Toast.show(res.data.message);
            setModalVisible(false);
            setPicker('');
            setLoading(false);
          } else {
            setLoading(false);
            Toast.show(res.data.message);
            setModalVisible(false);
            setPicker('');
          }
        })
        .catch(err => {
          console.log('rete ticket errr-->', err);
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
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
                  <ImageBackground
                    source={{uri: item.image_full}}
                    style={{
                      height: 180,
                      width: '100%',
                      borderColor: colors.lightred,
                      borderWidth: 0.5,
                      borderRadius: 10,
                    }}
                    imageStyle={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                    resizeMode="cover">
                    <Text style={styles.image_text}>{item.name}</Text>
                  </ImageBackground>

                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      setimg(item.image_full);
                      setRidename(item.name);
                      setDis(item.description);
                      setaemount(item.amount);
                      setHoliday(item.holiday);
                      setWeekend(item.weekend);
                      setRideID(item.id);
                    }}
                    style={[
                      styles.btn_view,
                      {
                        backgroundColor: colors.lightred,
                      },
                      // {
                      //   backgroundColor:
                      //     item.pt !== item.used
                      //       ? colors.lightgreen
                      //       : colors.lightred,
                      // },
                    ]}>
                    <Text style={styles.btn_text}>Book Ticket</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            //   numColumns={2}
          />
        </View>
      )}
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

              top: '10%',
            }}>
            <Image
              source={{uri: getimg}}
              style={{
                height: 180,
                width: '90%',
                marginHorizontal: '5%',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />

            <Text
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                color: colors.black,
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center',
              }}>
              {ridename}
            </Text>
            <Text
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                color: colors.black,
                fontWeight: 'bold',
                fontSize: 16,
                marginHorizontal: '5%',
              }}>
              Description:
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black,
                }}>
                {' '}
                {getdis}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: '5%',
              }}>
              <Text style={styles.text_modal}>Amount: {amount}</Text>
              <Text style={styles.text_modal}>Weekend: {weekend}</Text>
              <Text style={styles.text_modal}>Holiday: {holiday}</Text>
            </View>
            <Text
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                color: colors.black,
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: metrics.WIDTH * 0.04,
              }}>
              Select Person:{' '}
            </Text>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '5%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.lightred,
              }}>
              <Picker
                // mode="dropdown"
                selectedValue={getpicker}
                itemStyle={{height: 50}}
                style={{
                  color: colors.black,
                }}
                onValueChange={(itemValue, itemIndex) => setPicker(itemValue)}>
                <Picker.Item label="Select Person" value="" />
                <Picker.Item label="1" value={1} />
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
                <Picker.Item label="5" value={5} />
                <Picker.Item label="6" value={6} />
                <Picker.Item label="7" value={7} />
                <Picker.Item label="8" value={8} />
                <Picker.Item label="9" value={9} />
                <Picker.Item label="10" value={10} />
              </Picker>
            </View>
            {isloading === true ? (
              <ActivityIndicator
                color={colors.lightred}
                size="small"
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: '5%',
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => creteticket()}
                style={[
                  styles.modal_view,
                  {
                    backgroundColor: colors.lightred,
                  },
                  // {
                  //   backgroundColor:
                  //     item.pt !== item.used
                  //       ? colors.lightgreen
                  //       : colors.lightred,
                  // },
                ]}>
                <Text style={styles.btn_text}>Book</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </RNModal>
    </View>
  );
};

export default Ridelist;

const styles = StyleSheet.create({
  container: {
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

    // width: metrics.WIDTH * 0.4,
  },
  fistview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    marginTop: '2%',
    marginBottom: '2%',
  },
  textview: {
    color: colors.black,
    fontSize: 18,
  },
  btn_view: {
    padding: '5%',
    width: metrics.WIDTH * 0.9,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  modal_view: {
    marginTop: metrics.HEIGHT * 0.05,
    padding: '5%',
    width: metrics.WIDTH * 0.6,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  btn_text: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
  text_modal: {
    marginTop: metrics.HEIGHT * 0.02,
    color: colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
  image_text: {
    color: colors.black,
    padding: '2%',
    fontSize: 17,
    elevation: 8,
    width: metrics.WIDTH * 0.4,
    borderBottomRightRadius: 10,
    backgroundColor: colors.white,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 10,
  },
});
