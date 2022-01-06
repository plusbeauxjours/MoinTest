import axios, {AxiosResponse} from 'axios';
import {throttle} from 'lodash';
import useStore from '../stores/useStore';

export interface ICurrency {
    code: string;
    currencyCode: string;
    currencyName: string;
    country: string;
    name: string;
    date: string;
    time: string;
    recurrenceCount: number;
    basePrice: number;
    openingPrice: number;
    highPrice: number;
    lowPrice: number;
    change: string;
    changePrice: number;
    cashBuyingPrice: number;
    cashSellingPrice: number;
    ttBuyingPrice: number;
    ttSellingPrice: number;
    tcBuyingPrice: number;
    fcSellingPrice: number;
    exchangeCommission: number;
    usDollarRate: number;
    high52wPrice: number;
    high52wDate: string;
    low52wPrice: number;
    low52wDate: string;
    currencyUnit: number;
    provider: string;
    timestamp: 1641294091141;
    id: number;
    modifiedAt: string;
    createdAt: string;
    signedChangePrice: number;
    signedChangeRate: number;
    changeRate: number;
}

export const CurrencyApi = throttle(async (currency: string): Promise<AxiosResponse<any, any>> => {
    const {toast} = useStore();
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const baseUrl = 'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRW';
    const fullUrl = `${baseUrl}${currency}`;
    const result = axios.get(fullUrl, {headers});
    if (result) {
        return result;
    } else {
        toast.on('데이터를 받아오는데 문제가 발생하였습니다.');
    }
}, 1000);

export interface ICountry {
    name: string;
    currency: string;
    iso2: string;
    iso3: string;
}

export const CountryApi = async (): Promise<AxiosResponse<any, any>> => {
    const {toast} = useStore();
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const baseUrl = 'https://countriesnow.space/api/v0.1/countries/currency';
    const fullUrl = `${baseUrl}`;
    const result = axios.get(fullUrl, {headers});
    if (result) {
        return result;
    } else {
        toast.on('데이터를 받아오는데 문제가 발생하였습니다.');
    }
};
