import React, { Component } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView
} from "react-native";
import RandomPost from "../presentation/RandomPost";
import AddPostButton from "../presentation/AddPostButton";
import { backgroundColor } from "../../common/assets/styles/variables";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, refreshing: false } ;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  fetchData() {
    return fetch('http://127.0.0.1:8080/api/comments')
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.comments,
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    return this.fetchData() ;
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
