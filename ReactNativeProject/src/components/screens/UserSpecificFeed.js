import React, { Component } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text
} from "react-native";
import RandomPost from "../presentation/RandomPost";
import AddPostButton from "../presentation/AddPostButton";
import { backgroundColor } from "../../common/assets/styles/variables";
import { getUserToken } from "../../smart/helpers/session";
import { NavigationEvents } from "react-navigation";
class LogoTitle extends React.Component {
  gom(){
    alert('hi')
  }
  render() {
    return (
      <Text onPress={() => this.gom()}>My Comments!</Text>
    );
  }
}

class UserSpecificFeed extends Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, refreshing: false, token: null } ;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  async fetchData() {
    try {
      const token = await getUserToken()
      const response = await fetch('http://127.0.0.1:8080/api/me/comments', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        dataSource: responseJson.comments
      })
    } catch(err) {
      alert(err)
    }
  }

  render() {
    let posts = [];

    const { dataSource } = this.state;

    for (let i = 0; i < (this.state.dataSource || []).length; i++) {
      posts.push(
        <RandomPost
          key={dataSource[i]._id}
          content={dataSource[i].content}
          time={dataSource[i].createdAt}
        />
      );
    }
    return (
      <View style={{ position: 'relative', backgroundColor: backgroundColor }}>
        <NavigationEvents
          onWillFocus={() => this.fetchData()}
        />
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {posts}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default UserSpecificFeed ;
