import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { getUserToken } from "../../smart/helpers/session";

class NewPost extends Component {
    constructor() {
        super();
        getUserToken()
        .then(token => {
            this.setState({token});
        })
    }
    state = {
        text: '',
        token: null
    }

    async post() {
        let token = this.state.token;

        try {
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
                    content: this.state.text
                }),
            })
    
            if (postResponse) {
                this.props.navigation.navigate('Feed');
            }
        }
        catch(err) {
            alert('ERROR');
        }
    }
    render() {
        const { navigate } = this.props.navigation;
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
