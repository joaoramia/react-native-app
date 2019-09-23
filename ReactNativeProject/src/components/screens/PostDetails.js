import React, { Component } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Keyboard,
  RefreshControl,
  Alert
} from "react-native";
import { Header } from 'react-navigation';
import RandomPost from "../presentation/RandomPost";
import { getUserToken, getUserCoords } from "../../smart/helpers/session";
import LikeButton from "../presentation/LikeButton";
import { faPaperPlane, faSearch, faBiohazard, faArchive } from '@fortawesome/free-solid-svg-icons'
import { TextInput, ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { PostColors } from "../../common/assets/styles/variables";
import AlertMessage from "../presentation/AlertMessage";

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <Text style={{paddingRight: 4, fontSize: 16}}>Detalhes do post</Text>
        <FontAwesomeIcon style={{paddingLeft: 4}} icon={faArchive} size={24} color={PostColors[1]} />
      </View>
    );
  }
}

class PostDetails extends Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
  };

  state = {
    message: null
  }

  constructor(props) {
    super(props);
    this.state = { isLoading: true, refreshing: false, token: null } ;
    this.fetchData()
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
      const token = await getUserToken();
      const coords = await getUserCoords();

      const id = this.props.navigation.getParam('id', 'NO-ID')
      
      const response = await fetch(`http://127.0.0.1:8080/api/comments/${id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          coords
        })
      })

      const responseJson = await response.json();
      const {comment} = responseJson;
      let city = comment.city || '';
  
      if (typeof comment.distance === 'number') {
        if (comment.distance < 3) {
          city = 'muito perto';
        } else {
          city = comment.distance + ' km';
        }
      }

      this.setState({
        isLoading: false,
        dataSource: {...responseJson.comment},
        postComments: responseJson.postComments,
        city
      })
    } catch(err) {
      this.alertRef.current._move();
    }
  }

  async commentPost() {
    if (!this.state.message) {
      return;
    }
    try {
      const token = await getUserToken();
      const coords = await getUserCoords();
      const id = this.props.navigation.getParam('id', 'NO-ID');
      const content = this.state.message;
      
      const response = await fetch(`http://127.0.0.1:8080/api/commentPost`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            postId: id,
            content,
            color: Math.ceil(Math.random() * (5)),
            coords
        })
      })

      Keyboard.dismiss();
      this.setState({...this.state, message: null})
      this.textInput.clear();
      await this.fetchData();
    } catch(err) {
      this.alertRef.current._move();
    }
  }

  changedText(text) {
    if (text.length === 400) {
        Alert.alert('Ooops, você chegou no limite de caracteres 😬');
    } else if (text.length < 400) {
      this.setState({message: text});
    }
}

  render() {

    const { dataSource, city, postComments } = this.state;

    let comments = [];
    let users = [dataSource && dataSource.userId];
    if (postComments && postComments.length) {
      (postComments || []).sort((a, b) => a.createdAt > b.createdAt);

      (postComments || []).forEach((comment, index) => {
        let commentUserId = comment.userId;
        const postOwnerIndex = users.indexOf(commentUserId);
        if (postOwnerIndex === 0) {
          commentUserId = 'TinTin';
        } else if (postOwnerIndex < 0) {
          users.push(commentUserId);
          commentUserId = users.length - 1;
        } else {
          commentUserId = postOwnerIndex;
        }
        
      comments.push(<RandomPost
          key={index}
          commentId={index}
          content={comment.content}
          time={comment.createdAt}
          city={city}
          likes={comment.likes}
          liked={comment.liked}
          color={PostColors[comment.color || 0]}
          disliked={comment.disliked}
          navigation={this.props.navigation}
          showOptions={true}
          postOwner={commentUserId}
        >
          <LikeButton style={{width: '20%'}} likes={comment.likes} commentId={comment._id} liked={comment.liked} disliked={comment.disliked} />
      </RandomPost>)
      })
    }

    return (
      <View style={styles.container}>
        {dataSource ?
          <View style={{flex: 1}}>
            <ScrollView style={{marginBottom: 40}}>
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={async() => await this.fetchData()}
              />
              <RandomPost
                  key={dataSource._id}
                  commentId={dataSource._id}
                  content={dataSource.content}
                  time={dataSource.createdAt}
                  city={city}
                  likes={dataSource.likes}
                  liked={dataSource.liked}
                  disliked={dataSource.disliked}
                  color={PostColors[dataSource.color || 0]}
                  navigation={this.props.navigation}
                  showOptions={true}
                  marginBottom={4}
                  postOwner="TinTin"
                >
                  <LikeButton style={{width: '20%'}} likes={dataSource.likes} commentId={dataSource._id} liked={dataSource.liked} disliked={dataSource.disliked} />
              </RandomPost>
              {comments}
            </ScrollView>
            <KeyboardAvoidingView
              style={styles.bottomBar}
              behavior="padding"
              keyboardVerticalOffset = {Header.HEIGHT + 23}>
              <View style={{height: 50, width: '85%', padding: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.changedText(text)}
                    ref={input => { this.textInput = input }}
                    placeholderTextColor='rgb(100,100,100)'
                    placeholder='Faça aqui seu comentário 🙂'
                    underlineColorAndroid='transparent'
                    keyboardAppearance='dark'
                    returnKeyLabel='Enviar'
                    multiline={true}
                    maxLength={400}
                  />
              </View>
              <View style={{width: '15%', alignItems: 'center', justifyContent: 'center'}}>
                <FontAwesomeIcon onPress={async () => this.commentPost()} style={{height: '100%', width: '100%'}} icon={faPaperPlane} size={20} color={this.state.message ? 'rgb(253, 150, 40)' : 'gray'}/>
              </View>
            </KeyboardAvoidingView>
          </View>
        :
        null}
        <AlertMessage ref={this.alertRef}></AlertMessage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    position: 'relative'
  },
  bottomBar: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row'
  },
  input: {
    backgroundColor: 'rgb(235,235,235)',
    width: '100%',
    marginLeft: 7,
    padding: 9,
    borderRadius: 7
  }
});

export default PostDetails;
