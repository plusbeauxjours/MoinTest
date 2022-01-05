import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

import CountryModal from './components/CountryModal';

import {CurrencyApi, ICountry} from '../../utils/api';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {AppRoute} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';

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
    const [selectedCurrency, setSelectedCurrency] = useState<ISelectedCountry>({
        flag: '🇯🇵',
        code: 'JP',
        currency: 'JPY',
        engName: 'Japan',
        korName: '일본',
    });
    const [currencyData, setCurrencyData] = useState<ICountry[]>(null);

    const [amount, setAmount] = useState<number>(0);
    const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(true);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(true);

    const getCurrencyData = async (currency?: string) => {
        const {data} = await CurrencyApi(currency ?? selectedCurrency.currency);
        setCurrencyData(data[0]);
    };

    const goToConfirm = () => navigation.replace(AppRoute.CONFIRM, {requestTime: new Date(), currencyData, amount});
    const closeCountryModalOpen = () => setIsCountryModalOpen(false);
    const closeCouponModalOpen = () => setIsCouponModalOpen(false);

    const selectCountryFn = (currency: ISelectedCountry) => {
        getCurrencyData(currency?.currency);
        setSelectedCurrency(currency);
        setIsCountryModalOpen(false);
    };

    useEffect(() => {
        getCurrencyData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <Text style={fonts.LargeBold}>MainScreen{selectedCurrency.korName}</Text>
                <CountryModal
                    isCountryModalOpen={isCountryModalOpen}
                    closeCountryModalOpen={closeCountryModalOpen}
                    currencyData={currencyData}
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
});

export default MainScreen;
