import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StatusBar,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Clipboard,
    BackHandler,
} from 'react-native';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {ICurrency} from '../../utils/api';
import Toast from '../../components/Toast';

interface IProps {
    navigation?: StackNavigationProp<ParamListBase>;
    route?: RouteProp<{params: {requestTime?: Date; currencyData?: ICurrency; amount: number}}, 'params'>;
}

const ConfirmScreen: React.FC<IProps> = ({navigation, route: {params = {}}}) => {
    const {requestTime: _requestTime = null, currencyData: _currencyData = null, amount = 0} = params;

    const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
    const [requestTime, setRequestTime] = useState<Date>(null);
    const [currencyData, setCurrencyData] = useState<ICurrency>(null);

    const addHour = (date, hours) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    };

    const limitTime = addHour(requestTime, 1);
    const year = limitTime?.getFullYear();
    const month = +limitTime?.getMonth() + 1;
    const day = limitTime?.getDate();
    const hour = limitTime?.getHours();
    const minute = limitTime?.getMinutes() < 10 ? '0' : '' + limitTime?.getMinutes() + '';
    const bankName = currencyData?.provider;
    const accountNumber = currencyData?.timestamp + '';
    const accountPattern = 6;

    const toastFn = () => {
        clearTimeout();
        setTimeout(() => {
            setIsToastVisible(true);
        }, 50);
        setTimeout(() => {
            setIsToastVisible(false);
        }, 1500);
    };

    const copyFn = () => {
        toastFn();
        Clipboard.setString(bankName + accountNumber);
    };

    useEffect(() => {
        !requestTime && setRequestTime(_requestTime);
        !currencyData && setCurrencyData(_currencyData);
    }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <Image source={require('../../../src/assets/successImage.png')} style={styles.image} />
                <Text style={{...fonts.LargeBold, ...styles.largText}}>송금 신청완료</Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>
                    {year}년&nbsp;{month}월&nbsp;{day}일&nbsp;{hour > 12 ? '오후' : '오전'}&nbsp;
                    {hour}:{minute}까지
                </Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>아래 가상계좌로 입금을 완료해주세요!</Text>
                <View style={styles.bottomBox}>
                    <TouchableOpacity style={styles.copyIcon} onPress={copyFn} activeOpacity={0.8}>
                        <Image source={require('../../../src/assets/copyIcon.png')} style={styles.smallImage} />
                        {/* <Text style={{...fonts.SmallLight, ...styles.smallText}}>복사</Text> */}
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <Text style={{...fonts.MediumBold, ...styles.smallText, alignItems: 'center'}}>{bankName}</Text>
                    </View>
                    <Text style={{...fonts.MediumBold, ...styles.smallText}}>
                        {accountNumber.slice(0, accountPattern) +
                            '-' +
                            accountNumber.slice(accountPattern, accountPattern + 2) +
                            '-' +
                            accountNumber.slice(accountPattern + 2, -1)}
                    </Text>
                </View>
                <Text style={{...fonts.Small, ...styles.smallText}}>수수료 :{}</Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>환율 :{currencyData?.basePrice}</Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>송금액 :{amount}</Text>
            </View>
            {isToastVisible && <Toast text={'계좌정보를 복사하였습니다.'} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    smallImage: {
        width: 12,
        height: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomBox: {
        position: 'absolute',
        bottom: 200,
        marginBottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 0.5,
        borderColor: colors.grey,
        borderRadius: 10,
    },
    copyIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: -5,
        top: -5,
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderColor: colors.modalBackground,
        borderWidth: 1,
        paddingTop: 1,
    },
    largText: {
        marginBottom: 5,
    },
    smallText: {
        color: colors.grey,
    },
});

export default ConfirmScreen;
