import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {colors} from './src/colors';
import MainScreen from './src/MainScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <MainScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default App;
