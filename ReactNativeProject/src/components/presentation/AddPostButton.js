import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { createStackNavigator, createAppContainer } from 'react-navigation'

export default class AddPostButton extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.MainContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigate('NewPost')}
          style={styles.TouchableOpacityStyle}>
            <FontAwesomeIcon icon={faPlus} color='white' size={22}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  TouchableOpacityStyle: {
    position: 'absolute',
    padding: 16,
    borderRadius: 50,
    fontSize: 18,
    borderWidth: 6,
    borderColor: 'white',
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
    color: 'white',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    bottom: 10,
  }
});
