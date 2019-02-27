import React from 'react';
import { StatusBar, KeyboardAvoidingView, ActivityIndicator, Dimensions, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants } from 'expo';
import Carousel from 'react-native-snap-carousel';

import WeatherIcon from './WeatherIcon';

const GMAP_API_KEY = 'AIzaSyBxxWaovhL1uNQh3i0Ra_gjjLdlCsJtUJk';

const DARKSKY_API_KEY = '6d7cb41bdb5d28ca583d917aa0fde248';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class WeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weatherCards: [],
            search: ''
        }

        this._renderItem = this._renderItem.bind(this);
        this.onDeleteCard = this.onDeleteCard.bind(this);
    }

    getCoord = (address) => {
        let addressEncoded = encodeURIComponent(address);
        let request_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressEncoded}&key=${GMAP_API_KEY}`;
        return new Promise((resolve,reject) => {
            fetch(request_url)
            .then(res=>res.json())
            .then((body) => {
                result = {
                    address: body.results[0].formatted_address,
                    type: body.results[0].types[0],
                    coordinates: {
                        lat: body.results[0].geometry.location.lat,
                        lng: body.results[0].geometry.location.lng
                    }
                }                
                resolve(result);
            })
            .catch(error => console.log(error));
        })
        
    };

    getWeatherByCoord = (coordinate) => {
        request_url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${coordinate[0]},${
            coordinate[1]
        }`;
        return new Promise((resolve,reject) => {
            fetch(request_url)
            .then(res=>res.json())
            .then((res) => {
                resolve({
                    temperature: res.currently.temperature,
                    summary: res.hourly.summary,
                    icon: res.currently.icon
                })
            });
        })
    };
    
    onSearch = (addr) => {
        this.getCoord(addr)
        .then((res)=>{
            this.getWeatherByCoord([res.coordinates.lat, res.coordinates.lng])
            .then(response =>{
                if (this.state.weatherCards.length >= 5 ) {
                    this.setState(prevState => ({
                        weatherCards: prevState.weatherCards.filter((_, i) => i != 0)
                    }))
                }
                this.setState(prevState => ({
                    weatherCards: [...prevState.weatherCards, 
                        {
                            address: res.address,
                            temperature: response.temperature,
                            summary:response.summary,
                            icon: response.icon
                        }
                    ]
                }))
                
                let lastIndex = this.state.weatherCards.length - 1
                this._carousel.snapToItem(lastIndex);
                
            });
        })
        .catch(err=>{console.log(err)});
    };

    onDeleteCard = () => {
        let deleteIndex = this._carousel.currentIndex;
        this.setState(prevState => ({
            weatherCards: prevState.weatherCards.filter((_, i) => i != deleteIndex)
        }))
        // console.log(this.state.weatherCards)
    }

    _renderItem ({item, index}) {
        return (
            <View style={styles.slide}>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.summary}>{item.summary}</Text>
                <Text style={styles.temperature}>{item.temperature}°F</Text>
                <WeatherIcon icon={item.icon} ></WeatherIcon>
                <TouchableOpacity
                    onPress={this.onDeleteCard}
                    style={styles.crossButton}
                >
                    <Text style={{color: '#EDA237', fontWeight: 'bold'}}>X</Text>
                </TouchableOpacity>
            </View>
        );
    }


  render() {
    const { search } = this.state;

    return (
      
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.title}>
                    Shanyu's Weather App
                </Text>
            </View>
            <KeyboardAvoidingView style={styles.avoidView} behavior="padding" enabled>
                <View style={styles.aboveView}>
                    {this.state.weatherCards.length >= 1 &&
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.weatherCards}
                            renderItem={this._renderItem}
                            sliderWidth={width}
                            itemWidth={width*0.7}
                            style={styles.carousel}
                        ></Carousel>
                    }
                </View>
                

                <View style={styles.bottomView}>
                    <SearchBar
                        placeholder="Enter a City"
                        onChangeText={(search)=>this.setState({ search })}
                        value={search}
                        style={styles.searchBar}
                        round={true}
                        onSubmitEditing={(e) => {this.onSearch(e.nativeEvent.text)}}
                        clearTextOnFocus={true}
                    ></SearchBar>
                </View>
            </KeyboardAvoidingView>
        </View>
        

      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:width,
    height:height
  },
  header: {
    paddingTop: 20 + Constants.statusBarHeight,
    padding: 15,
    backgroundColor: '#3A6BA5',
  },
  title: {
    fontSize: 14,
    color: 'white',
  },
  avoidView: {
    flex:1,
    width:'100%',
  },
  aboveView: {
    flex:3,
    paddingTop: height * 0.07
  },
  bottomView: {
    bottom:0,
    flex:1,
    justifyContent: 'flex-end'
  },
  slide: {
    backgroundColor: '#3B5375',
    borderRadius: width*0.02,
    alignItems: 'center',
    justifyContent: 'center',
    height: height*0.5,
    paddingVertical: height * 0.07
  },
  address: {
    color:'#FFE09D',
    fontSize: width*0.07
  },
  crossButton: {
    position:'absolute',
    right:width * 0.05,
    top:width * 0.05,
    fontSize:14,
  },
  summary: {
    color: 'white',
    paddingTop: height * 0.01
  },
  temperature: {
    color: '#EDA237',
    fontSize: width*0.05,
    paddingTop: height * 0.01
  }
});