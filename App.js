import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WeatherView from './components/WeatherView';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <WeatherView></WeatherView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03031B',
  },
});
