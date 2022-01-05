import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

import CurrencyModal from './components/CountryModal';

import {CountryApi, CurrencyApi, ICountry} from '../api';
import {colors} from '../colors';
import {fonts} from '../fonts';
import {AppRoute} from '../../App';
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
    const [countryData, setCountryData] = useState<ICountry[]>(null);

    const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(true);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(true);

    const getCountryData = async () => {
        const {
            data: {data},
        } = await CountryApi();
        setCountryData(data);
    };

    const goToConfirm = () => navigation.replace(AppRoute.CONFIRM);
    const closeCountryModalOpen = () => setIsCountryModalOpen(false);
    const closeCouponModalOpen = () => setIsCouponModalOpen(false);

    const selectCountryFn = currency => {
        setSelectedCurrency(currency);
        setIsCountryModalOpen(false);
    };

    useEffect(() => {
        getCountryData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <Text style={fonts.LargeBold}>MainScreen{selectedCurrency.korName}</Text>
                <CurrencyModal
                    isCountryModalOpen={isCountryModalOpen}
                    closeCountryModalOpen={closeCountryModalOpen}
                    countryData={countryData}
                    selectedCurrency={selectedCurrency}
                    selectCountryFn={selectCountryFn}
                />
                <TouchableOpacity onPress={goToConfirm}>
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
