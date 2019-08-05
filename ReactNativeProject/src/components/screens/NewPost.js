import React, { Component } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { getUserToken, getUserCoords } from "../../smart/helpers/session";
import AlertMessage from "../presentation/AlertMessage";

class NewPost extends Component {
    constructor() {
        super();
        getUserToken()
        .then(token => {
            this.setState({token});
        })
        this.alertRef = React.createRef();
    }
    state = {
        text: '',
        token: null,
        coords: null
    }

    async post() {
        let token = this.state.token;
        
        try {
            const coords = await getUserCoords();

            if (coords) {
                this.setState({...this.state, coords});
            }

            if (!token) {
                token = await getUserToken();
            }
            const postResponse = await fetch('http://127.0.0.1:8080/api/comment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: this.state.text,
                    coords,
                    color: Math.ceil(Math.random() * (5))
                }),
            })
    
            if (postResponse) {
                this.props.navigation.navigate('Feed');
            }
    
        }
        catch(err) {
            this.alertRef.current._move();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={{ height: 40, color: 'white' }}
                    placeholder="Enter your post here!"
                    placeholderTextColor='rgb(230,230,230)'
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                />
                <Button title="Send!" onPress={() => this.post()}>
                </Button>
                <AlertMessage ref={this.alertRef}></AlertMessage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#63B0CD',
        flex: 1
    }
});

export default NewPost
