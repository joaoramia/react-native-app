import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Feed from "./components/screens/Feed";
import UserSpecificFeed from "./components/screens/UserSpecificFeed";
import NewPost from "./components/screens/NewPost";
import { faMapPin, faUser, faComment } from '@fortawesome/free-solid-svg-icons'
import { AuthLoading } from "./components/screens/AuthLoading";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { fontColor } from "./common/assets/styles/variables";

const StackNav = createStackNavigator({
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => ({
        title: `Feed`,
      })
    },
    NewPost
  },
  { 
    initialRouteName: 'Feed'
  }
)

const TabNav = createBottomTabNavigator({
  Feed: {
    screen: StackNav,
    navigationOptions: {
      title: "Feed",
      tabBarIcon: () => (
        <FontAwesomeIcon icon={faComment} color={fontColor} />
      )
    }
  },
  UserSpecificFeed: {
    screen: UserSpecificFeed,
    navigationOptions: ({ navigation }) => ({
      title: `My comments`,
      tabBarIcon: () => (
        <FontAwesomeIcon icon={faUser} color={fontColor} />
      )
    })
  }
})

const RootStack = createSwitchNavigator(
  {
    AuthLoading,
    // Feed,
    TabNav,
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
