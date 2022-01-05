import React, {useState, useCallback, useMemo} from 'react';
import {TextInput, Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList} from 'react-native';

import {ISelectedCountry} from '../MainScreen';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {countries} from '../../../utils/countries';

interface IProps {
    isCountryModalOpen: boolean;
    closeCountryModalOpen: () => void;
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
    selectedCurrency,
    selectCountryFn,
}) => {
    const [search, setSearch] = useState<string>('');

    const closeModalAndSearch = (): void => {
        setSearch('');
        closeCountryModalOpen();
    };

    const ListHeaderComponent = useMemo(
        () => (
            <TextInput
                autoFocus
                placeholder={'🔍'}
                placeholderTextColor={colors.grey}
                selectionColor={colors.secondary}
                onChangeText={setSearch}
                value={search}
                style={styles.input}
            />
        ),
        [search],
    );

    const renderItem = useCallback(
        ({item}) => (
            <TouchableOpacity onPress={() => selectCountryFn(item)} style={styles.row} activeOpacity={0.8}>
                <Text
                    style={{
                        ...fonts.LargeLight,
                        ...styles.modalText,
                        width: sideWidth,
                    }}>
                    {item.flag}
                </Text>
                <View style={styles.countryName}>
                    <Text
                        style={{
                            ...fonts.MediumBold,
                            ...styles.modalText,
                        }}>
                        {item.korName}
                    </Text>
                    <Text
                        style={{
                            ...fonts.SmallLight,
                            ...styles.modalText,
                        }}>
                        {item.engName}
                    </Text>
                </View>
                <Text
                    style={{
                        ...fonts.MediumLight,
                        ...styles.modalText,
                        width: sideWidth,
                    }}>
                    {item?.currency}
                </Text>
                <Text style={{width: sideWidth}}>{selectedCurrency.code === item.code ? '✔️' : ''}</Text>
            </TouchableOpacity>
        ),
        [selectedCurrency],
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isCountryModalOpen}
            onRequestClose={closeModalAndSearch}>
            <TouchableOpacity style={styles.modalBackground} onPress={closeModalAndSearch} activeOpacity={1} />
            <TouchableOpacity onPress={closeModalAndSearch} style={styles.closeIcon} activeOpacity={1}>
                <Text style={{fontSize: 15, color: colors.grey}}>✕</Text>
            </TouchableOpacity>

            <FlatList
                style={styles.modalContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={countries.filter(
                    country =>
                        country.korName.toLowerCase().includes(search.toLowerCase()) ||
                        country.engName.toLowerCase().includes(search.toLowerCase()) ||
                        country.currency.toLowerCase().includes(search.toLowerCase()),
                )}
                ListHeaderComponent={ListHeaderComponent}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            />
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
    closeIcon: {
        zIndex: 3,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: marginWidth - 10,
        top: marginHeight - 10,
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderColor: colors.modalBackground,
        borderWidth: 3,
        paddingTop: 1,
        paddingLeft: 1,
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
        borderBottomWidth: 0.7,
        borderBottomColor: colors.grey,
    },
    modalText: {
        textAlign: 'center',
    },
});

export default CountryModal;
