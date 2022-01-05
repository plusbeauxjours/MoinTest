import React from 'react';
import {NativeSyntheticEvent, TextInput, TextInputChangeEventData} from 'react-native';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

interface IProps {
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    value: string;
}

const Input: React.FC<IProps> = ({onChange, value}) => (
    <TextInput
        autoFocus
        autoCapitalize="none"
        autoComplete="off"
        placeholder="0"
        placeholderTextColor={colors.grey}
        selectionColor={colors.grey}
        keyboardType={'numeric'}
        style={{...fonts.Large}}
        onChange={onChange}
        value={value}
    />
);

export default Input;
