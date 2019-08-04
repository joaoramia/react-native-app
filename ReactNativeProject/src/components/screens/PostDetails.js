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

class PostDetails extends Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, refreshing: false, token: null } ;
    const {navigation} = this.props;
    console.log(navigation.getParam('id'));
    this.fetchData()
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

      const id = this.props.navigation.getParam('id', 'NO-ID')
      
      const response = await fetch(`http://127.0.0.1:8080/api/comments/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })

      const responseJson = await response.json();
      const {comment} = responseJson;
      let city = comment.city || 'unknown location';
  
      if (typeof comment.distance === 'number') {
        if (comment.distance < 3) {
          city = 'very near';
        } else {
          city = comment.distance;
        }
      }

      this.setState({
        isLoading: false,
        dataSource: responseJson.comment,
        city
      })
      console.log(responseJson);
    } catch(err) {
      alert(err)
    }
  }

  render() {

    const { dataSource, city } = this.state;

    return (
      <View style={{ position: 'relative', backgroundColor: backgroundColor }}>
          {
            dataSource ? 
                <RandomPost
                key={dataSource._id}
                commentId={dataSource._id}
                content={dataSource.content}
                time={dataSource.createdAt}
                city={city}
                likes={dataSource.likes}
                liked={dataSource.liked}
                disliked={dataSource.disliked}
                showOptions={true}
                />
            :
                null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default PostDetails ;
