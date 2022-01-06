import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, View, TextInput} from 'react-native';
import {ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CountryModal from './components/CountryModal';

import {CurrencyApi, ICountry} from '../../utils/api';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {AppRoute} from '../../../App';
import countries from '../../utils/countries';

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

    const Korea = {flag: '🇰🇷', code: 'KR', currency: 'KRW', engName: 'South Korea', korName: '대한민국'};
    const InitCountry = {flag: '🇯🇵', code: 'JP', currency: 'JPY', engName: 'Japan', korName: '일본'};
    const FEES = 1000;
    const MAXIMUM_KOR_AMOUNT = '55000000';
    const MINIMUM_KOR_AMOUNT = '0';

    const [currencyData, setCurrencyData] = useState<ICountry>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<ISelectedCountry>(InitCountry);

    const [disalbed, setDisabled] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>(null);
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
    const [krwAmount, setKrwAmount] = useState<string>(MAXIMUM_KOR_AMOUNT);
    const [exchangeAmount, setExchangeAmount] = useState<string>(MINIMUM_KOR_AMOUNT);

    const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);

    const getCurrencyData = async () => {
        const {data} = await CurrencyApi(selectedCurrency.currency);
        setCurrencyData(data[0]);

        const priceByUnit = data[0].basePrice / data[0].currencyUnit;

        if (korAmountInputRef?.current?.isFocused()) {
            if (+((+krwAmount - FEES) / priceByUnit).toFixed(0) <= +MINIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg(`받는 금액은 최소 1 ${selectedCurrency.currency} 입니다.`);
            } else if (+krwAmount > +MAXIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg('송금 최대 금액을 넘습니다.');
                setExchangeAmount(((+MAXIMUM_KOR_AMOUNT - FEES) / priceByUnit).toFixed(0) + '');
                setKrwAmount(MAXIMUM_KOR_AMOUNT);
            } else {
                setDisabled(false);
                setErrorMsg(null);
                setIsErrorVisible(false);
                setExchangeAmount(((+krwAmount - FEES) / priceByUnit).toFixed(0) + '');
            }
        }
        if (exchangeAmountInputRef?.current?.isFocused()) {
            if (+(+exchangeAmount * priceByUnit - FEES).toFixed(0) <= +MINIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg(`받는 금액은 최소 1 ${Korea.currency} 입니다.`);
            } else if (+(+exchangeAmount * priceByUnit - FEES).toFixed(0) > +MAXIMUM_KOR_AMOUNT) {
                setDisabled(true);
                setIsErrorVisible(true);
                setErrorMsg('송금 최대 금액을 넘습니다.');
                setKrwAmount(MAXIMUM_KOR_AMOUNT);
                setExchangeAmount(((+MAXIMUM_KOR_AMOUNT - FEES) / priceByUnit).toFixed(0) + '');
            } else {
                setDisabled(false);
                setErrorMsg(null);
                setIsErrorVisible(false);
                setKrwAmount((+exchangeAmount * priceByUnit + FEES).toFixed(0) + '');
            }
        }
    };

    const onKrwAmountChange = (text): void => setKrwAmount(text.replace(/[^0-9]/g, ''));
    const onExchangeAmountChange = (text): void => setExchangeAmount(text.replace(/[^0-9]/g, ''));
    const addThousandsSeparators = (amount: string) => amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const closeCountryModalOpen = (): void => setIsCountryModalOpen(false);
    const closeCouponModalOpen = (): void => setIsCouponModalOpen(false);
    const goToConfirm = (): void =>
        navigation.replace(AppRoute.CONFIRM, {requestTime: new Date(), currencyData, krwAmount});

    const selectCountryFn = (currency: ISelectedCountry): void => {
        setSelectedCurrency(currency);
        setIsCountryModalOpen(false);
    };

    useEffect(() => {
        setSelectedCurrency(countries.find(i => i.currency === 'JPY'));
    }, []);

    useEffect(() => {
        getCurrencyData();
    }, [
        selectedCurrency,
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
                            {Korea.flag}
                            <Text style={fonts.MediumLight}>{Korea.currency}</Text>
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
                            {selectedCurrency.flag}
                            <Text style={fonts.MediumLight}>{selectedCurrency.currency}</Text>
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
                    selectedCurrency={selectedCurrency}
                    selectCountryFn={selectCountryFn}
                />
                <TouchableOpacity onPress={goToConfirm} disabled={!currencyData || disalbed}>
                    <Text style={{...fonts.LargeBold, color: disalbed ? colors.grey : colors.black}}>GOTO CONFIRM</Text>
                </TouchableOpacity>
            </View>
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
