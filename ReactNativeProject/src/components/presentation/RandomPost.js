import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment'
import {PostColors, fontColor, backgroundColor} from '../../common/assets/styles/variables'

class RandomPost extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log(this.props.city);
        const postColor = PostColors[Math.ceil(Math.random() * (PostColors.length - 1))]
        return (
            <View style={{...styles.container, ...{backgroundColor: 'white'}}}>
                <View style={styles.postHeader}>
                    <FontAwesomeIcon icon={faMapPin} color={fontColor} />
                    <Text style={{padding: 7, color: fontColor}}>{this.props.city}</Text>
                    <Text style={{padding: 7, color: fontColor}}>{Moment(Moment(this.props.time).toDate()).fromNow()}</Text>
                </View>
                <Text style={{padding: 12, color: fontColor}}>{this.props.content}</Text>
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
