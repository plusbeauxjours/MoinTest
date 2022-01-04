import React, {useState, useEffect} from 'react';
import {Text, View, Modal} from 'react-native';

import CurrencyModal from './components/CountryModal';

import {CountryApi, CurrencyApi, ICountry} from '../api';

export interface ISelectedCountry {
    flag: string;
    code: string;
    currency: string;
    engName: string;
    korName: string;
}

const MainScreen = () => {
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

    const getCurrencyData = async () => {
        const {data} = await CurrencyApi(selectedCurrency.currency);
    };

    const closeCountryModalOpen = () => setIsCountryModalOpen(false);
    const closeCouponModalOpen = () => setIsCouponModalOpen(false);
    const selectCountryFn = currency => {
        setSelectedCurrency(currency);
        setIsCountryModalOpen(false);
    };

    useEffect(() => {
        getCountryData();
        getCurrencyData();
    }, []);

    return (
        <View>
            <Text>MainScreen{selectedCurrency.korName}</Text>
            <CurrencyModal
                isCountryModalOpen={isCountryModalOpen}
                closeCountryModalOpen={closeCountryModalOpen}
                countryData={countryData}
                selectedCurrency={selectedCurrency}
                selectCountryFn={selectCountryFn}
            />
        </View>
    );
};
export default MainScreen;
