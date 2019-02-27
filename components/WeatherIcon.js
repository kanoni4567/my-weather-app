import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const icons = {
    sunny: {
        imgName: 'sunny', 
        uri: require('../assets/icons/sunny.png')
    },
    rainy: {
        imgName: 'rainy', 
        uri: require('../assets/icons/rainy.png')
    },
    cloudy: {
        imgName: 'cloudy', 
        uri: require('../assets/icons/cloudy.png')
    },
    snowy: {
        imgName: 'snowy', 
        uri: require('../assets/icons/snowy.png')
    }
  }

export default class WeatherIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    toIconName = iconstr => {
        result = 'sunny';
        if (iconstr.includes('rain')) {
            result = 'rainy';
        } else if (iconstr.includes('cloud')) {
            result = 'cloudy';
        } else if (iconstr.includes('snow')) {
            result = 'snowy';
        }
        return result;
    }

    render() {
        let iconName = this.toIconName(this.props.icon);
        return(
            <Image source={icons[iconName].uri}></Image>
        )
    }
}