import React, {useState, useEffect} from 'react';
import {Text, View, Modal} from 'react-native';

import CurrencyModal from './components/CountryModal';

import {CountryApi, CurrencyApi, ICountry} from '../api';

const MainScreen = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY');
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
        const {data} = await CurrencyApi(selectedCurrency);
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
            <Text>MainScreen</Text>
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
