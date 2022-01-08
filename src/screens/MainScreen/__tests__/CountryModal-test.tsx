import React from 'react';
import renderer from 'react-test-renderer';
import CountryModal from '../components/CountryModal';

const getComponent = props => <CountryModal {...props} />;

describe('<CountryModal />', () => {
    const props = {
        isCountryModalOpen: true,
        closeCountryModalOpen: jest.fn(),
        selectedCountry: 'JP',
        selectCountryFn: jest.fn(),
    };
    const component = getComponent(props);
    it('renders', () => {
        const renderResult = renderer.create(component);
        const renderedJson = renderResult.toJSON();
        expect(renderedJson).toMatchSnapshot();
        expect(renderedJson).toBeTruthy();
    });
});
