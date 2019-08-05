import React, { Component } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text,
  Animated
} from "react-native";
import { NavigationEvents } from 'react-navigation';
import RandomPost from "../presentation/RandomPost";
import AddPostButton from "../presentation/AddPostButton";
import { backgroundColor, PostColors } from "../../common/assets/styles/variables";
import { getUserToken, getUserCoords } from "../../smart/helpers/session";
import LikeButton from "../presentation/LikeButton";
import { faTape } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AlertMessage from "../presentation/AlertMessage";

class LogoTitle extends React.Component {
  state = {
    pressed: false
  }
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <Text style={{paddingRight: 4, fontSize: 18}}>Feed de notícias</Text>
        <FontAwesomeIcon style={{paddingLeft: 4}} icon={faTape} size={24} color={PostColors[1]} />
      </View>
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
    this.state = { isLoading: true, refreshing: false, token: null };
    this.alertRef = React.createRef();
  }

  async fetchData() {
    console.log('fetching data');
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
        dataSource: [...responseJson.comments]
      })
      this.forceUpdate();
      console.log(responseJson);
    } catch(err) {
      this.alertRef.current._move();
    }
  }

  render() {
    let posts = [];

    const { dataSource } = this.state;

    for (let i = 0; i < (dataSource || []).length; i++) {
      let city = dataSource[i].city || 'unknown location';
  
      if (typeof dataSource[i].distance === 'number') {
        if (dataSource[i].distance < 3) {
          city = 'muito perto';
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
          color={PostColors[dataSource[i].color || 0]}
          showOptions={true}
          navigation={this.props.navigation}
          clickable={true}
        >
          <LikeButton style={{width: '20%'}} likes={dataSource[i].likes} commentId={dataSource[i]._id} liked={dataSource[i].liked} disliked={dataSource[i].disliked} />
        </RandomPost>
      );
    }
    return (
      <View style={{ position: 'relative', backgroundColor: backgroundColor }}>
        <NavigationEvents
          onWillFocus={async payload => await this.fetchData()}
        />
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={async() => await this.fetchData()}
            />
          }
        >
          {posts}
        </ScrollView>
        <AddPostButton navigation={this.props.navigation} />
        <AlertMessage ref={this.alertRef}></AlertMessage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default Feed ;
