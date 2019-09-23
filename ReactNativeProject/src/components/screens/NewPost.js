import React, { Component } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { getUserToken, getUserCoords } from "../../smart/helpers/session";
import AlertMessage from "../presentation/AlertMessage";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native-gesture-handler";

class NewPost extends Component {
    constructor() {
        super();
        getUserToken()
        .then(token => {
            this.setState({token});
        })
        this.alertRef = React.createRef();
        this.inputRef = React.createRef();
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

    changedText(text) {
        if (text.length === 400) {
            Alert.alert('Ooops, você chegou no limite de caracteres por post 😬');
        } else if (text.length < 400) {
            this.setState({text});
        }
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Seu post aqui 😆 é anônimo! 🕶"
                    placeholderTextColor='rgb(230,230,230)'
                    onChangeText={(text) => this.changedText(text)}
                    value={this.state.text}
                    ref={this.inputRef}
                    multiline={true}
                    maxLength={400}
                />

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.state.text ? this.post() : null}
                    style={styles.TouchableOpacityStyle}>
                    <FontAwesomeIcon icon={faPaperPlane} size={20} color={this.state.text ? 'rgb(253, 150, 40)' : 'gray'}/>
                </TouchableOpacity>
                <AlertMessage ref={this.alertRef}></AlertMessage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textInput: {
        height: '50%',
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'rgb(240,240,240)',
        margin: 10,
        padding: 8,
        borderRadius: 3,
        fontSize: 22
    },
    button: {
        backgroundColor: 'rgb(240,240,240)',
        color: 'rgb(253, 150, 40)'
    },
    TouchableOpacityStyle: {
        padding: 20,
        fontSize: 22,
        backgroundColor: 'white',
        color: 'white',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        textAlign: 'center'
    }
});

export default NewPost
