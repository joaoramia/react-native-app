import React, { Component } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text
} from "react-native";
import { NavigationEvents } from 'react-navigation';
import RandomPost from "../presentation/RandomPost";
import AddPostButton from "../presentation/AddPostButton";
import { backgroundColor } from "../../common/assets/styles/variables";
import { getUserToken, getUserCoords } from "../../smart/helpers/session";

class LogoTitle extends React.Component {
  gom(){
    alert('hi')
  }
  render() {
    return (
      <Text onPress={() => this.gom()}>HELLO!</Text>
    );
  }
}

class Feed extends Component {
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
      const token = await getUserToken();
      const coords = await getUserCoords();
      
      const response = await fetch('http://127.0.0.1:8080/api/comments', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          coords
      }),
      })

      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        dataSource: responseJson.comments
      })
      console.log(responseJson);
    } catch(err) {
      alert(err)
    }
  }

  render() {
    let posts = [];

    const { dataSource } = this.state;
    console.log(dataSource);

    for (let i = 0; i < (dataSource || []).length; i++) {
      console.log(dataSource[i].distance);
      let city = dataSource[i].city || 'unknown location';
  
      if (typeof dataSource[i].distance === 'number') {
        if (dataSource[i].distance < 3) {
          city = 'very near';
        } else {
          city = dataSource[i].distance;
        }
      }
      posts.push(
        <RandomPost
          key={dataSource[i]._id}
          commentId={dataSource[i]._id}
          content={dataSource[i].content}
          time={dataSource[i].createdAt}
          city={city}
          likes={dataSource[i].likes}
          liked={dataSource[i].liked}
          disliked={dataSource[i].disliked}
          showOptions={true}
          navigation={this.props.navigation}
        />
      );
    }
    return (
      <View style={{ position: 'relative', backgroundColor: backgroundColor }}>
        <NavigationEvents
          onWillFocus={payload => this.fetchData()}
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
        <AddPostButton navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default Feed ;
