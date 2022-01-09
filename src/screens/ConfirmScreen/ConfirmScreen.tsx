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

import {throttle} from 'lodash';
import {Observer} from 'mobx-react';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FEES, addThousandsSeparators, KOREA} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {ICurrency} from '../../utils/api';
import Toast from '../../components/Toast';
import useStore from '../../stores/useStore';
import {AppRoute} from '../../../App';

interface IProps {
    navigation?: StackNavigationProp<ParamListBase>;
    route?: RouteProp<{params: {currencyData?: ICurrency; krwAmount: number}}, 'params'>;
}

const ConfirmScreen: React.FC<IProps> = ({navigation, route: {params = {}}}) => {
    const {currencyData: _currencyData = null, krwAmount = 0} = params;
    const {toast, history} = useStore();

    const [requestTime, setRequestTime] = useState<Date>(null);
    const [currencyData, setCurrencyData] = useState<ICurrency>(null);

    const addHour = (date, hours): Date => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    };

    const limitTime = addHour(requestTime, 1);
    const year = limitTime?.getFullYear();
    const month = +limitTime?.getMonth() + 1;
    const day = limitTime?.getDate();
    const hour = limitTime?.getHours();
    const minute =
        limitTime?.getMinutes() === 0
            ? '00'
            : limitTime?.getMinutes() < 10
            ? '0' + limitTime?.getMinutes() + ''
            : limitTime?.getMinutes() + '';
    const bankName = currencyData?.provider;
    const accountNumber = currencyData?.timestamp + '';
    const accountPattern = 6;

    const goToMain = throttle((): void => navigation.replace(AppRoute.MAIN), 500);
    const toastFn = (): void => {
        clearTimeout();
        toast.on('계좌정보를 복사하였습니다.');
        setTimeout(() => {
            toast.off();
        }, 1500);
    };

    const copyFn = (): void => {
        toastFn();
        Clipboard.setString(bankName + accountNumber);
    };

    useEffect(() => {
        !requestTime && setRequestTime(new Date());
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
                <Image source={(require('../../../src/assets/successImage.png'), 3)} style={styles.image} />
                <Text style={{...fonts.LargeBold, ...styles.largText}}>송금 신청완료</Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>
                    {year}년&nbsp;{month}월&nbsp;{day}일&nbsp;{hour > 12 ? '오후' : '오전'}&nbsp;
                    {hour}:{minute}까지
                </Text>
                <Text style={{...fonts.Small, ...styles.smallText}}>아래 가상계좌로 입금을 완료해주세요!</Text>
                <View style={styles.bottomBox}>
                    <TouchableOpacity style={styles.copyIcon} onPress={copyFn} activeOpacity={0.8}>
                        <Image source={(require('../../../src/assets/copyIcon.png'), 4)} style={styles.smallImage} />
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <Text style={{...fonts.Small, ...styles.smallText, alignItems: 'center'}}>{bankName}</Text>
                    </View>
                    <Text style={{...fonts.Small, ...styles.smallText}}>
                        {accountNumber.slice(0, accountPattern) +
                            '-' +
                            accountNumber.slice(accountPattern, accountPattern + 2) +
                            '-' +
                            accountNumber.slice(accountPattern + 2, -1)}
                    </Text>
                </View>
                <View style={styles.line} />
                <View>
                    <View style={{...styles.row, justifyContent: 'space-between'}}>
                        <Text style={{...fonts.Small, ...styles.smallText}}>송금액:&nbsp;</Text>
                        <Text style={{...fonts.Small, ...styles.smallText}}>
                            {addThousandsSeparators(krwAmount + '')}&nbsp;{KOREA.currency}
                        </Text>
                    </View>
                    <View style={{...styles.row, justifyContent: 'space-between'}}>
                        <Text style={{...fonts.Small, ...styles.smallText}}>환율:&nbsp;</Text>
                        <Text style={{...fonts.Small, ...styles.smallText}}>
                            {addThousandsSeparators(currencyData?.basePrice + '')}&nbsp;{KOREA.currency}
                        </Text>
                    </View>
                    <View style={{...styles.row, justifyContent: 'space-between'}}>
                        <Text style={{...fonts.Small, ...styles.smallText}}>수수료:&nbsp;</Text>
                        <Text style={{...fonts.Small, ...styles.smallText}}>
                            {addThousandsSeparators(FEES)}&nbsp;{KOREA.currency}
                        </Text>
                    </View>
                </View>
                <View style={styles.line} />
                <Observer>
                    {() => (
                        <View style={styles.historyBox}>
                            {history?.histories?.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.history}
                                    onPress={() => history.remove(item)}
                                    activeOpacity={0.8}>
                                    <Text style={{...fonts.SmallLight, ...styles.historyText}}>{item.flag}</Text>
                                    <Text style={{...fonts.SmallLight, ...styles.historyText}}>
                                        {addThousandsSeparators(item.amount)}
                                    </Text>
                                    <Text style={{...fonts.SmallLight, ...styles.historyText}}>{item.currency}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Observer>
                <TouchableOpacity
                    testID="goToConfirm"
                    onPress={goToMain}
                    style={{
                        ...styles.confirmBtn,
                        backgroundColor: colors.primary,
                    }}>
                    <Text
                        style={{
                            ...fonts.LargeBold,
                            color: colors.white,
                        }}>
                        송금 계속하기
                    </Text>
                </TouchableOpacity>
            </View>
            <Observer>{() => toast.isToastVisible && <Toast />}</Observer>
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
        opacity: 0.5,
    },
    line: {
        height: 1,
        width: 100,
        backgroundColor: colors.lightGrey,
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
    },
    history: {
        flexDirection: 'row',
        padding: 2,
        borderWidth: 0.5,
        borderColor: colors.grey,
        borderRadius: 3,
        marginRight: 2,
        marginBottom: 2,
    },
    historyText: {
        marginLeft: 2,
    },
    bottomBox: {
        marginBottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 20,
        borderWidth: 0.5,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: 10,
    },
    copyIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: -7,
        bottom: -7,
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderColor: colors.modalBackground,
        borderWidth: 0.5,
        paddingTop: 1,
    },
    largText: {
        marginBottom: 15,
    },
    smallText: {
        color: colors.grey,
    },
    confirmBtn: {
        borderRadius: 30,
        width: 100,
        hegiht: 50,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 120,
    },
});

export default ConfirmScreen;
