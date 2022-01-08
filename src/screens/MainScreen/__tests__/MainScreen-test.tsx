import React from 'react';
import renderer from 'react-test-renderer';
import {act, fireEvent, render} from '@testing-library/react-native';

import MainScreen from '../MainScreen';

jest.mock('react-native-gesture-handler', () => jest.fn());

let component;

const getComponent = props => <MainScreen {...props} />;

describe('<MainScreen />', () => {
    const props = {};
    const component = getComponent({route: {pramrs: props}});

    it('renders', () => {
        const renderResult = renderer.create(component);
        const renderedJson = renderResult.toJSON();
        expect(renderedJson).toMatchSnapshot();
        expect(renderedJson).toBeTruthy();
    });
});
