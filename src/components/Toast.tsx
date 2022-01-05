import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from '../utils/colors';
import {fonts} from '../utils/fonts';

interface IProps {
    text: string;
}

const Toast: React.FC<IProps> = ({text}) => {
    return (
        <View style={styles.modalPopupArea}>
            <View style={styles.modalPopup}>
                <Text style={{...fonts.SmallLight, ...styles.smallText}}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    smallText: {
        color: colors.grey,
    },
    modalPopupArea: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        alignItems: 'center',
    },
    modalPopup: {
        padding: 5,
        borderRadius: 10,
        elevation: 6,
        shadowColor: colors.grey,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {width: 3, height: 3},
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.5,
    },
});

export default Toast;
