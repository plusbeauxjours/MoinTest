import {ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import {colors} from '../colors';
import {fonts} from '../fonts';

interface IProps {
    navigation?: StackNavigationProp<ParamListBase>;
}

const ConfirmScreen: React.FC<IProps> = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.body}>
                <Text style={fonts.LargeBold}>ConfirmScreen</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ConfirmScreen;
