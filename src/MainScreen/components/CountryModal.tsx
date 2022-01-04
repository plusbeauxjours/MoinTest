import React, {useState} from 'react';
import {TextInput, Modal, View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';

import {colors} from '../../colors';
import {fonts} from '../../fonts';
import {ICountry} from '../../api';
import {countries} from '../../countries';
import {ISelectedCountry} from '../MainScreen';

interface IProps {
    isCountryModalOpen: boolean;
    closeCountryModalOpen: () => void;
    countryData: ICountry[];
    selectedCurrency: ISelectedCountry;
    selectCountryFn: (country: ISelectedCountry) => void;
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
    const [search, setSearch] = useState<string>('');

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
                <TextInput
                    autoFocus
                    placeholder={'🔍'}
                    placeholderTextColor={colors.grey}
                    selectionColor={colors.secondary}
                    onChangeText={setSearch}
                    value={search}
                    style={styles.input}
                />
                {countries
                    .filter(country => country.korName.includes(search) || country.engName.includes(search))
                    ?.map((country, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => selectCountryFn(country)}
                            style={styles.row}
                            activeOpacity={0.8}>
                            <Text
                                style={{
                                    ...fonts.LargeLight,
                                    ...styles.modalText,
                                    width: sideWidth,
                                }}>
                                {country.flag}
                            </Text>
                            <View style={styles.countryName}>
                                <Text
                                    style={{
                                        ...fonts.MediumBold,
                                        ...styles.modalText,
                                    }}>
                                    {country.korName}
                                </Text>
                                <Text
                                    style={{
                                        ...fonts.SmallLight,
                                        ...styles.modalText,
                                    }}>
                                    {country.engName}
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
                                {selectedCurrency.currency === country.currency ? '✔️' : ''}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
    input: {
        marginVertical: 10,
        height: 35,
    },
    modalText: {
        textAlign: 'left',
    },
});

export default CountryModal;
