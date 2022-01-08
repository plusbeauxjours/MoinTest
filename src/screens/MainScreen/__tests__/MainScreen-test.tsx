import React from 'react';
import renderer from 'react-test-renderer';
import {act, fireEvent, render} from '@testing-library/react-native';

import MainScreen from '../MainScreen';

let component;
let testingLib;

describe('<MainScreen />', () => {
    beforeEach(() => {
        component = <MainScreen />;
    });

    it('renders', () => {
        const rendered = renderer.create(component).toJSON();
        expect(rendered).toMatchSnapshot();
        expect(rendered).toBeTruthy();
    });
});
