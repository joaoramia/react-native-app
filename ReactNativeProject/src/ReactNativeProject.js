import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Feed from "./components/screens/Feed";
import NewPost from "./components/screens/NewPost";
import { AuthLoading } from "./components/screens/AuthLoading";

const RootStack = createSwitchNavigator(
    {
      AuthLoading,
      Feed,
      NewPost
    },
    {
      initialRouteName: 'AuthLoading',
    }
  );

const AppContainer = createAppContainer(RootStack, RootStack);

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
