import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  Share,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './utils/colors';
import Fonts from './utils/Fonts';
import metrics from './utils/Metrics';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from './utils/const';

const HomeScreen = props => {
  const [postdata, setpostdata] = useState([]);
  useEffect(async () => {
    props.navigation.addListener('focus', async () => {
      await timeline();
    });

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  }, [props]);

  const tokenExpire = () => {
    AsyncStorage.clear();
    AsyncStorage.removeItem('islogin');
    AsyncStorage.removeItem('token');
    props.navigation.replace('splashScreen');
  };

  const timeline = async () => {
    const Token = await AsyncStorage.getItem('token');

    await axios
      .get(BASE_URL + 'get-timeline', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer' + JSON.parse(Token),
        },
      })
      .then(res => {
        console.log('timeline respons-->>', res.data);
        if (res.data.success == 1) {
          setpostdata(res.data.data);
        } else {
          tokenExpire();
        }
      })
      .catch(err => {
        console.log('timeline errr-->', err);
      });
  };

  function handleBackButton() {
    if (props.navigation.isFocused()) {
      console.log('handle back from home ');
      BackHandler.exitApp();
    } else {
      props.navigation.goBack(null);

      return true;
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={colors.black} barStyle="light-content" />
      <View style={{width: '100%', height: '100%'}}>
        <FlatList
          data={postdata}
          keyExtractor={item => item.id}
          style={{marginTop: '3%'}}
          // extraData={this.state}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  marginBottom: '3%',
                  backgroundColor: 'white',
                  padding: '3%',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../Screen/assets/logo05.png')}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                      backgroundColor: colors.black,
                    }}
                    resizeMode="cover"
                  />
                  <View style={{marginLeft: '4%'}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: Fonts.FontsSize.regular16,
                        fontWeight: 'bold',
                      }}>
                      {item.title}
                    </Text>
                  </View>
                </View>
                <View style={{alignItems: 'center', width: '100%'}}>
                  <Image
                    source={{uri: item.image_full_path}}
                    style={{
                      width: metrics.WIDTH * 0.9,
                      height: metrics.WIDTH * 0.85,
                      marginTop: '4%',
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    resizeMode={'stretch'}
                  />
                </View>
              </View>
            );
          }}
        />

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
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const Data = [{id: 1}, {id: 2}, {id: 3}];
