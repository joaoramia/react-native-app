import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";

class NewPost extends Component {
    constructor() {
        super()
    }
    state = {
        text: ''
    }

    post() {
        return fetch('http://127.0.0.1:8080/api/comment', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: this.state.text
            }),
        })
            .then(response => {
                alert(response);
            })
            .then(_ => this.props.navigation.navigate('Feed'))
            .catch(error => {
                alert('ERROR', JSON.stringify(error));
            })
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
