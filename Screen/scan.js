import React, { Component, Fragment, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Linking, View, Image, ImageBackground, BackHandler, AsyncStorage, Modal, TextInput } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle'
import { BASE_URL, ACCEPT_HEADER } from './utils/const';
import axios from 'axios';
import metrics from "./utils/Metrics";
import colors from './utils/colors';

import Toast from 'react-native-simple-toast'

const Scan = (props) => {
    const [scan, setscan] = useState(false)
    const [ScanResult, setscanResult] = useState(false)
    const [result, setresult] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const [getrefund, setRefund] = useState("")

    const onSuccess = (e) => {
        const check = e.data.substring(0, 4);
        console.log('scanned data---------' + check, e);
        setscan(false)
        setresult(e)
        setscanResult(false)
        // this.setState({
        //     result: e,
        //     scan: false,
        //     ScanResult: true
        // })
        if (check === 'http') {
            Linking.openURL(e.data).catch(err => console.error('An error occured', err));
        } else if (e.data === "refund") {
            console.log("refund")
            // getRefund()
            setModalVisible(true)
        }
        else {
            setscan(false)
            setresult(e)
            setscanResult(true)
            // this.setState({
            //     result: e,
            //     scan: false,
            //     ScanResult: true
            // })
            props.navigation.navigate('placeorder', { "rideid": check })
        }
    }



    async function activeQR() {
        // await this.setState({ scan: true, result: null })
        setscan(true)
        setresult(null)
    }

    useEffect(async () => {
        // props.navigation.navigate('placeorder', { "rideid": "4" })

        await activeQR()
        props.navigation.addListener('focus', async () => {
            await activeQR()
        });
    }, [])


    const getRefund = async () => {
        var Token = await AsyncStorage.getItem("token")
        console.log("token : ", Token)

        const formdata = new FormData;
        formdata.append("amount", getrefund)

        console.log("refund --->", formdata)
        // refundtest
        await axios.post(BASE_URL + "refundnew", formdata, {
            headers: {
                "Accept": ACCEPT_HEADER,
                "Authorization": "Bearer " + JSON.parse(Token)
            }
        }).then(async res => {
            console.log("==================res : ", res.data)
            if (res.success === 1) {
                await setscan(false)
                await setscanResult(true)
            }
            Toast.show(res.data.message)
        }).catch(err => {
            console.log(JSON.stringify(err, 2, null))
        })
        props.navigation.navigate("Homes")
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.scrollViewStyle}>
                {scan &&
                    <QRCodeScanner
                        reactivate={true}
                        showMarker={true}
                        // cameraType="front"
                        // ref={(node) => { scanner = node }}
                        onRead={onSuccess}
                        topContent={
                            <Text style={styles.centerText}>
                                Please move your camera {"\n"} over the QR Code
                            </Text>
                        }
                    />
                }
            </View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: metrics.HEIGHT * 0.03,

                }}>

                    <View style={{
                        margin: 20,
                        backgroundColor: "white",
                        borderRadius: 20,
                        height: metrics.HEIGHT * 0.4,
                        width: metrics.WIDTH * 0.8,
                        elevation: 5
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            marginTop: metrics.HEIGHT * 0.02,
                            color: colors.black,
                            fontSize: 22,
                            fontWeight: 'bold'

                        }}>
                            REFUND
                        </Text>

                        <View style={{
                            borderRadius: 10,
                            borderColor: colors.black,
                            borderWidth: 1,
                            width: metrics.WIDTH * 0.7,
                            height: metrics.HEIGHT * 0.07,
                            justifyContent: 'center',
                            marginTop: metrics.HEIGHT * 0.08,
                            alignSelf: 'center'
                        }}>
                            <TextInput
                                placeholder='Enter Amount'
                                placeholderTextColor={colors.black}
                                style={{ color: colors.black }}
                                keyboardType="number-pad"
                                onChangeText={(value) => setRefund(value)}
                            />



                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: '5%', width: metrics.WIDTH * 0.7, marginTop: metrics.HEIGHT * 0.04, justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => getRefund()}
                                style={{
                                    backgroundColor: colors.black,
                                    height: metrics.HEIGHT * 0.06,
                                    width: metrics.WIDTH * 0.3,
                                    borderRadius: 10,
                                    justifyContent: 'center'
                                }}>
                                <Text style={{ textAlign: 'center', color: colors.white, fontSize: 16 }}>
                                    Refund
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false)
                                    props.navigation.navigate("Homes")
                                }}
                                style={{
                                    backgroundColor: colors.black,
                                    height: metrics.HEIGHT * 0.06,
                                    width: metrics.WIDTH * 0.3,
                                    borderRadius: 10,
                                    justifyContent: 'center'
                                }}>
                                <Text style={{ textAlign: 'center', color: colors.white, fontSize: 16 }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
        </SafeAreaView>
    );
}

export default Scan;