import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation'

export class AuthLoading extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        Geolocation.getCurrentPosition(async info => {
            if (info.coords) {
                await AsyncStorage.setItem('coords', JSON.stringify(info.coords));
            }
        })
        const userToken = await AsyncStorage.getItem('userToken');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if (userToken) {
            this.props.navigation.navigate('Feed')
        } else {
            this.signUp();
        }
    };

    signUp() {
        fetch('http://127.0.0.1:8080/api/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: {},
        })
            .then(res => res.json())
            .then(res => {
                AsyncStorage.setItem('userToken', res.token);
                alert(res.token)
                this.props.navigation.navigate('Feed');
            })
            .catch(err => {
                alert('ERROR!', JSON.stringify(err));
            })
    }

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {}
});
