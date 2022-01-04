import axios from 'axios';

export const CurrencyApi = async (currency: string) => {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const baseUrl = 'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRW';
    const fullUrl = `${baseUrl}${currency}`;
    return axios.get(fullUrl, {headers});
};

export const CountryApi = async () => {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const baseUrl = 'https://countriesnow.space/api/v0.1/countries/currency';
    const fullUrl = `${baseUrl}`;
    return axios.get(fullUrl, {headers});
};
