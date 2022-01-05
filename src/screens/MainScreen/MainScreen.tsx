import React, {useState, useEffect} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    View,
    NativeSyntheticEvent,
    TextInputChangeEventData,
} from 'react-native';
import {ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Input from './components/Input';
import CountryModal from './components/CountryModal';

import {CurrencyApi, ICountry} from '../../utils/api';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {AppRoute} from '../../../App';
import countries from '../../utils/countries';
import {ReactComponentElement} from 'react';

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
    const Korea = {flag: '🇰🇷', code: 'KR', currency: 'KRW', engName: 'South Korea', korName: '대한민국'};
    const InitCountry = {flag: '🇯🇵', code: 'JP', currency: 'JPY', engName: 'Japan', korName: '일본'};

    const [currencyData, setCurrencyData] = useState<ICountry[]>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<ISelectedCountry>(InitCountry);

    const [krwAmount, setKrwAmount] = useState<string>(null);
    const [exchangeAmount, setExchangeAmount] = useState<string>(null);

    const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);

    const getCurrencyData = async () => {
        const {data} = await CurrencyApi(selectedCurrency.currency);
        setCurrencyData(data[0]);
    };

    const goToConfirm = (): void =>
        navigation.replace(AppRoute.CONFIRM, {requestTime: new Date(), currencyData, krwAmount});
    const closeCountryModalOpen = (): void => setIsCountryModalOpen(false);
    const closeCouponModalOpen = (): void => setIsCouponModalOpen(false);

    const selectCountryFn = (currency: ISelectedCountry): void => {
        setSelectedCurrency(currency);
        setIsCountryModalOpen(false);
    };

    const onKrwAmountChange = (e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
        const value = e.nativeEvent.text;
        setKrwAmount(value);
    };
    const onExchangeAmountChange = (e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
        const value = e.nativeEvent.text;
        setExchangeAmount(value);
    };

    useEffect(() => {
        setSelectedCurrency(countries.find(i => i.currency === 'JPY'));
    }, []);

    useEffect(() => {
        getCurrencyData();
    }, [selectedCurrency]);

    const CurrencyComponent = ({country, disabled = false}: {country: ISelectedCountry; disabled?: boolean}) => (
        <View style={styles.row}>
            <TouchableOpacity
                style={styles.row}
                onPress={() => setIsCountryModalOpen(true)}
                activeOpacity={0.8}
                disabled={disabled}>
                <Text>
                    {country.flag}
                    <Text style={fonts.Large}>{country.currency}</Text>
                </Text>
            </TouchableOpacity>
            <Input onChange={onExchangeAmountChange} value={exchangeAmount} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <CurrencyComponent country={Korea} disabled />
                <CurrencyComponent country={selectedCurrency} />
                <CountryModal
                    isCountryModalOpen={isCountryModalOpen}
                    closeCountryModalOpen={closeCountryModalOpen}
                    selectedCurrency={selectedCurrency}
                    selectCountryFn={selectCountryFn}
                />
                <TouchableOpacity onPress={goToConfirm} disabled={!currencyData}>
                    <Text style={fonts.LargeBold}>GOTO CONFIRM</Text>
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
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default MainScreen;
