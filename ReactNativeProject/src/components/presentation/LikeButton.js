import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { getUserToken } from '../../smart/helpers/session';

export default class LikeButton extends Component {
    state = {
        likes: this.props.likes,
        liked: this.props.liked,
        disliked: this.props.disliked,
        loading: false
    };

    async like(id, value) {
        this.setState({
            isLoading: true
        })
        try {
            const token = await getUserToken();

            const response = await fetch('http://127.0.0.1:8080/api/comment/like/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id,
                    value
                }),
            })

            const responseJson = await response.json();
            this.setState({
                isLoading: false,
                liked: value > 0,
                disliked: value < 0,
                likes: this.state.likes + value
            })
            console.log(responseJson);
        } catch (err) {
            alert(err)
        }
    }

    render() {
        const { likes, commentId, liked, disliked } = this.state;
        return (
            <View style={styles.MainContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => !liked && !disliked ? this.like(commentId, 1) : null}
                    style={styles.TouchableOpacityStyle}>
                    <FontAwesomeIcon icon={faAngleUp} size={28} color={liked ? 'gray': 'black'} />
                </TouchableOpacity>
                <Text>{likes || 0}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => !liked && !disliked ? this.like(commentId, -1) : null}
                    style={liked ? styles.liked : styles.TouchableOpacityStyle}>
                    <FontAwesomeIcon icon={faAngleDown} size={28} color={disliked ? 'gray' : 'black'} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5F5F5',
    },
    liked: {
        color: 'red'
    },
    TouchableOpacityStyle: {
        fontSize: 40
    }
});
