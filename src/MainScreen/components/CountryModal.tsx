import React from 'react';
import {Modal, View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';

import {colors} from '../../colors';
import {fonts} from '../../fonts';
import {ICountry} from '../../api';
import countries from '../../countries';

interface IProps {
    isCountryModalOpen: boolean;
    closeCountryModalOpen: () => void;
    countryData: ICountry[];
    selectedCurrency: string;
    selectCountryFn: (currency: string) => void;
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const modalWidth = Width * 0.8;
const modalHeight = Height * 0.8;
const marginWidth = (Width - modalWidth) / 2;
const marginHeight = (Height - modalHeight) / 2;
const paddingHorizontal = 20;
const sideWidth = 30;

const CountryModal: React.FC<IProps> = ({
    isCountryModalOpen,
    closeCountryModalOpen,
    countryData,
    selectedCurrency,
    selectCountryFn,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isCountryModalOpen}
            onRequestClose={closeCountryModalOpen}>
            <TouchableOpacity style={styles.modalBackground} onPress={closeCountryModalOpen} activeOpacity={1} />
            <ScrollView
                keyboardShouldPersistTaps={'handled'}
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                style={styles.modalContainer}>
                {countryData?.map(
                    (country, index) =>
                        countries[`${country?.iso2}`] && (
                            <TouchableOpacity
                                key={index}
                                onPress={() => selectCountryFn(country.currency)}
                                style={styles.row}
                                activeOpacity={0.8}>
                                <Text
                                    style={{
                                        ...fonts.LargeLight,
                                        ...styles.modalText,
                                        width: sideWidth,
                                    }}>
                                    {countries[`${country?.iso2}`].flag}
                                </Text>
                                <View style={styles.countryName}>
                                    <Text
                                        style={{
                                            ...fonts.MediumBold,
                                            ...styles.modalText,
                                        }}>
                                        {countries[`${country?.iso2}`].korName}
                                    </Text>
                                    <Text
                                        style={{
                                            ...fonts.SmallLight,
                                            ...styles.modalText,
                                        }}>
                                        {countries[`${country?.iso2}`].engName}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        ...fonts.MediumLight,
                                        ...styles.modalText,
                                        width: sideWidth,
                                    }}>
                                    {country?.currency}
                                </Text>
                                <Text style={{width: sideWidth}}>
                                    {selectedCurrency === country.currency ? '✔️' : ''}
                                </Text>
                            </TouchableOpacity>
                        ),
                )}
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.modalBackground,
    },
    modalContainer: {
        position: 'absolute',
        width: modalWidth,
        height: modalHeight,
        marginHorizontal: marginWidth,
        marginVertical: marginHeight,
        backgroundColor: colors.white,
        paddingHorizontal: paddingHorizontal,
        borderRadius: 20,
    },
    countryName: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: modalWidth - paddingHorizontal - sideWidth * 3,
    },
    row: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalText: {
        textAlign: 'left',
    },
});

export default CountryModal;
