import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Text, View} from 'react-native';
import {CountryApi, CurrencyApi} from '../api';

const MainScreen = () => {
    const [targetCountry, setTargetCountry] = useState<string>('JPY');
    const getCountryData = async () => {
        const {data} = await CountryApi();
        console.log(data);
    };

    const getCurrencyData = async () => {
        const {data} = await CurrencyApi(targetCountry);
        console.log(data);
    };

    useEffect(() => {
        getCountryData();
        getCurrencyData();
    }, []);
    return (
        <View>
            <Text>MainScreen</Text>
        </View>
    );
};
export default MainScreen;
