import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Feed from "./components/screens/Feed";
import UserSpecificFeed from "./components/screens/UserSpecificFeed";
import NewPost from "./components/screens/NewPost";
import PostDetails from "./components/screens/PostDetails";
import { faUser, faComment, faTape } from '@fortawesome/free-solid-svg-icons'
import { AuthLoading } from "./components/screens/AuthLoading";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { fontColor, PostColors } from "./common/assets/styles/variables";

const StackNav = createStackNavigator({
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => ({
        title: `Feed`,
      })
    },
    NewPost,
    PostDetails
  },
  { 
    initialRouteName: 'Feed',
    // navigationOptions: ({ navigation }) => ({
    //   tabBarVisible: navigation.state.routes[navigation.state.index].routeName === 'PostDetails' ? false : true
    // })
  }
)

const StackNavUser = createStackNavigator({
    UserSpecificFeed: {
      screen: UserSpecificFeed,
      navigationOptions: ({ navigation }) => ({
        title: `My comments`,
      })
    },
    PostDetails
  },
  { 
    initialRouteName: 'UserSpecificFeed'
  }
)

const TabNav = createBottomTabNavigator({
  Feed: {
    screen: StackNav,
    navigationOptions: {
      title: "Feed",
      tabBarIcon: () => (
        <FontAwesomeIcon icon={faTape} size={24} color={PostColors[1]} />
      )
    }
  },
  UserSpecificFeed: {
    screen: StackNavUser,
    navigationOptions: ({ navigation }) => ({
      showLabel: false,
      tabBarIcon: () => (
        <FontAwesomeIcon icon={faUser} size={24} color={PostColors[2]} />
      )
    })
  }
},
{
  tabBarOptions: {showLabel: false}
})

const RootStack = createSwitchNavigator(
  {
    AuthLoading,
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
