import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from './src/screens/MainScreen';
import ConfirmScreen from './src/screens/ConfirmScreen';

const Stack = createStackNavigator();

export enum AppRoute {
    MAIN = 'Main Screen',
    CONFIRM = 'Confirm Screen',
}

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={AppRoute.MAIN}>
                <Stack.Screen name={AppRoute.MAIN} component={MainScreen} />
                <Stack.Screen name={AppRoute.CONFIRM} component={ConfirmScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
