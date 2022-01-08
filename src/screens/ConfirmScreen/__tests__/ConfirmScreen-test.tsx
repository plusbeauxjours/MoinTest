import 'react-native';

import React from 'react';
import renderer from 'react-test-renderer';

import ConfirmScreen from '../ConfirmScreen';

jest.mock('react-native-gesture-handler', () => jest.fn());

const getComponent = props => <ConfirmScreen {...props} />;

describe('<ConfirmScreen>', () => {
    const props = {
        currencyData: {
            basePrice: 1039.41,
            cashBuyingPrice: 1057.59,
            cashSellingPrice: 1021.23,
            change: 'RISE',
            changePrice: 0.61,
            changeRate: 0.000587216,
            code: 'FRX.KRWJPY',
            country: '일본',
            createdAt: '2016-10-21T06:13:31.000+0000',
            currencyCode: 'JPY',
            currencyName: '엔',
            currencyUnit: 100,
            date: '2022-01-07',
            exchangeCommission: 2.0505,
            fcSellingPrice: null,
            high52wDate: '2021-09-23',
            high52wPrice: 1080,
            highPrice: 1039.77,
            id: 41,
            low52wDate: '2021-06-04',
            low52wPrice: 1008.02,
            lowPrice: 1035.43,
            modifiedAt: '2022-01-07T11:03:40.000+0000',
            name: '일본 (KRW/JPY100)',
            openingPrice: 1035.43,
            provider: '하나은행',
            recurrenceCount: 252,
            signedChangePrice: 0.61,
            signedChangeRate: 0.000587216,
            tcBuyingPrice: null,
            time: '20:03:39',
            timestamp: 1641553419942,
            ttBuyingPrice: 1029.23,
            ttSellingPrice: 1049.59,
            usDollarRate: 0.8633,
        },
        krwAmount: '"55000000',
    };

    const component = getComponent({route: {pramrs: props}});
    it('render', () => {
        const renderResult = renderer.create(component);
        const renderedJson = renderResult.toJSON();
        expect(renderedJson).toMatchSnapshot();
        expect(renderedJson).toBeTruthy();
    });
});
