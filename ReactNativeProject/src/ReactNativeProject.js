import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Feed from "./components/screens/Feed";
import NewPost from "./components/screens/NewPost";

const RootStack = createStackNavigator(
    {
      Feed: Feed,
      NewPost: NewPost
    },
    {
      initialRouteName: 'Feed',
    }
  );

const AppContainer = createAppContainer(RootStack);

class ReactNativeProject extends Component {
    render() {
        return (
            <AppContainer />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    }
});

export default ReactNativeProject
