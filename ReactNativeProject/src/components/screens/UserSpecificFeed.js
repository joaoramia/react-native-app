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
import { backgroundColor, PostColors } from "../../common/assets/styles/variables";
import { getUserToken } from "../../smart/helpers/session";
import { NavigationEvents } from "react-navigation";
import LikeButton from "../presentation/LikeButton";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AlertMessage from "../presentation/AlertMessage";
class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <Text style={{paddingRight: 4, fontSize: 18}}>Meus posts</Text>
        <FontAwesomeIcon icon={faUser} size={24} color={PostColors[2]} />
      </View>
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
    this.state = { isLoading: true, refreshing: false, token: null };
    this.alertRef = React.createRef();
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
          color={PostColors[dataSource[i].color || 0]}
          disliked={dataSource[i].disliked}
          clickable={true}
          showOptions={true}
          navigation={this.props.navigation}
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
        <AlertMessage ref={this.alertRef}></AlertMessage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default UserSpecificFeed ;
