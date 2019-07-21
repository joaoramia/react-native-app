import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment'
import {PostColors} from '../../common/assets/styles/variables'

class RandomPost extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const postColor = PostColors[Math.ceil(Math.random() * (PostColors.length - 1))]
        return (
            <View style={{...styles.container, ...{backgroundColor: postColor}}}>
                <View style={styles.postHeader}>
                    <FontAwesomeIcon icon={faMapPin} color='white' />
                    <Text style={{padding: 7, color: 'white'}}>{this.props.location || 'Hamburg'}</Text>
                    <Text style={{padding: 7, color: 'white'}}>{Moment(Moment(this.props.time).toDate()).fromNow()}</Text>
                </View>
                <Text style={{padding: 12, color: 'white'}}>{this.props.content}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 2
    },
    postHeader: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default RandomPost
