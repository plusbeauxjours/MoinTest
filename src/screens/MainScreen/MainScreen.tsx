import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, View, TextInput, FlatList} from 'react-native';

import {ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Observer} from 'mobx-react';
import {throttle} from 'lodash';
import CountryModal from './components/CountryModal';

import {FEES, MAXIMUM_KOR_AMOUNT, MINIMUM_KOR_AMOUNT, addThousandsSeparators, KOREA} from '../../utils/constants';
import {CurrencyApi, ICurrency} from '../../utils/api';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {AppRoute} from '../../../App';
import Toast from '../../components/Toast';
import useStore from '../../stores/useStore';

export interface ISelectedCountry {
    flag: string;
    code: string;
    currency: string;
    engName: string;
    korName: string;
}

interface IProps {
    navigation?: StackNavigationProp<ParamListBase>;
}

const MainScreen: React.FC<IProps> = ({navigation}) => {
    const korAmountInputRef = useRef(null);
    const exchangeAmountInputRef = useRef(null);
    const {toast, history} = useStore();

    const InitCountry = {flag: '🇯🇵', code: 'JP', currency: 'JPY', engName: 'Japan', korName: '일본'};

    const [currencyData, setCurrencyData] = useState<ICurrency>(null);
    const [selectedCountry, setSelectedCountry] = useState<ISelectedCountry>(InitCountry);

    const [disalbed, setDisabled] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>(null);
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
    const [krwAmount, setKrwAmount] = useState<string>(MAXIMUM_KOR_AMOUNT);
    const [exchangeAmount, setExchangeAmount] = useState<string>(MINIMUM_KOR_AMOUNT);

    const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);

    const getCurrencyData = async (): Promise<void> => {
        const {data} = await CurrencyApi(selectedCountry.currency);
        setCurrencyData(data[0] || null);

        const priceByUnit = data[0].basePrice / data[0].currencyUnit;

        if (korAmountInputRef?.current?.isFocused()) {
            if (+((+krwAmount - +FEES) / priceByUnit).toFixed(0) <= +MINIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg(`받는 금액은 최소 1 ${selectedCountry.currency} 입니다.`);
            } else {
                setDisabled(false);
                setErrorMsg(null);
                setIsErrorVisible(false);
                setExchangeAmount(((+krwAmount - +FEES) / priceByUnit).toFixed(0));
            }
        }
        if (exchangeAmountInputRef?.current?.isFocused()) {
            if (+(+exchangeAmount * priceByUnit - +FEES).toFixed(0) <= +MINIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg(`받는 금액은 최소 1 ${KOREA.currency} 입니다.`);
            } else {
                setDisabled(false);
                setErrorMsg(null);
                setIsErrorVisible(false);
                setKrwAmount((+exchangeAmount * priceByUnit + +FEES).toFixed(0));
            }
        }
    };

    const onKrwAmountChange = (text): void => {
        if (+text.replace(/[^0-9]/g, '') > +MAXIMUM_KOR_AMOUNT) {
            setErrorMsg('송금 최대 금액을 넘습니다.');
            setDisabled(true);
            setIsErrorVisible(true);
        } else {
            setKrwAmount(text.replace(/[^0-9]/g, ''));
        }
    };

    const onExchangeAmountChange = (text): void => {
        const priceByUnit = currencyData?.basePrice / currencyData?.currencyUnit;
        if (!priceByUnit) {
            setErrorMsg('환율 정보가 없습니다.');
            setDisabled(true);
            setIsErrorVisible(true);
        } else if (+(+text.replace(/[^0-9]/g, '') * priceByUnit - +FEES).toFixed(0) > +MAXIMUM_KOR_AMOUNT) {
            setErrorMsg('송금 최대 금액을 넘습니다.');
            setDisabled(true);
            setIsErrorVisible(true);
        } else {
            setExchangeAmount(text.replace(/[^0-9]/g, ''));
        }
    };
    const closeCountryModalOpen = (): void => setIsCountryModalOpen(false);
    const closeCouponModalOpen = (): void => setIsCouponModalOpen(false);
    const goToConfirm = (): void => {
        history.add({...selectedCountry, amount: exchangeAmount, createdAt: new Date()});
        clearTimeout();
        toast.on('송금중입니다.\n잠시만 기다려주세요.');
        setTimeout(
            throttle(() => {
                navigation.replace(AppRoute.CONFIRM, {currencyData, krwAmount});
                toast.off();
            }, 500),
            500,
        );
    };

    const selectCountryFn = (currency: ISelectedCountry): void => {
        setSelectedCountry(currency);
        setIsCountryModalOpen(false);
    };

    useEffect(() => {
        getCurrencyData();
    }, [
        selectedCountry,
        korAmountInputRef?.current?.isFocused() && krwAmount,
        exchangeAmountInputRef?.current?.isFocused() && exchangeAmount,
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => setIsCountryModalOpen(true)}
                        activeOpacity={0.8}
                        disabled>
                        <Text>
                            {KOREA.flag}
                            <Text style={fonts.MediumLight}>{KOREA.currency}</Text>
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        autoFocus
                        ref={korAmountInputRef}
                        autoCapitalize="none"
                        autoComplete="off"
                        placeholder="0"
                        placeholderTextColor={colors.grey}
                        selectionColor={colors.grey}
                        keyboardType={'numeric'}
                        style={{...fonts.Large}}
                        onChangeText={onKrwAmountChange}
                        defaultValue={krwAmount}
                        textAlign="left"
                        value={addThousandsSeparators(krwAmount)}
                    />
                </View>
                {isErrorVisible && korAmountInputRef?.current?.isFocused() && (
                    <Text style={{...fonts.Small, ...styles.errorText}}>{errorMsg}</Text>
                )}
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => setIsCountryModalOpen(true)}
                        activeOpacity={0.8}>
                        <Text>
                            {selectedCountry.flag}
                            <Text style={fonts.MediumLight}>{selectedCountry.currency}</Text>
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        ref={exchangeAmountInputRef}
                        autoCapitalize="none"
                        autoComplete="off"
                        placeholder="0"
                        placeholderTextColor={colors.grey}
                        selectionColor={colors.grey}
                        keyboardType={'numeric'}
                        style={{...fonts.Large}}
                        onChangeText={onExchangeAmountChange}
                        defaultValue={exchangeAmount}
                        textAlign="left"
                        value={addThousandsSeparators(exchangeAmount)}
                    />
                </View>
                {isErrorVisible && exchangeAmountInputRef?.current?.isFocused() && (
                    <Text style={{...fonts.Small, ...styles.errorText}}>{errorMsg}</Text>
                )}
                <CountryModal
                    isCountryModalOpen={isCountryModalOpen}
                    closeCountryModalOpen={closeCountryModalOpen}
                    selectedCountry={selectedCountry}
                    selectCountryFn={selectCountryFn}
                />
                <TouchableOpacity
                    onPress={goToConfirm}
                    disabled={!currencyData || disalbed || +krwAmount > +MAXIMUM_KOR_AMOUNT}>
                    <Text
                        style={{
                            ...fonts.LargeBold,
                            color:
                                !currencyData || disalbed || +krwAmount > +MAXIMUM_KOR_AMOUNT
                                    ? colors.grey
                                    : colors.black,
                        }}>
                        GOTO CONFIRM
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 100,
    },
    errorText: {
        color: colors.red,
    },
});

export default MainScreen;
