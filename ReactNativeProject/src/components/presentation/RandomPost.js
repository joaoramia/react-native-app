import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapPin, faBandAid } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment'
import {PostColors, fontColor, backgroundColor} from '../../common/assets/styles/variables'
import LikeButton from "./LikeButton";
import { getUserToken } from "../../smart/helpers/session";

class RandomPost extends Component {
    state = {
        modalVisible: false,
      };

    constructor(props) {
        super(props)
    }

    openReportAbuse() {
        Alert.alert(
        'Reportar Abuso',
        'Apenas good vibes! Se acha que este post fere as regras de uso do app, por favor nos avise abaixo 😊',
        [
            {
                text: 'Reportar abuso',
                onPress: async () => {
                    await this.reportAbuse(this.props.commentId);

                    Alert.alert('Obrigado!', 'Vamos verificar o post o mais breve possível para tomarmos as devidas providências! Continue com sua good vibe! 😎')
                }
            },
            {
                text: 'Cancelar',
                style: 'cancel'
            }
        ],
        {cancelable: false},
        );
    }

    async reportAbuse(id) {
        try {
            const token = await getUserToken();

            const response = await fetch('http://127.0.0.1:8080/api/comment/reportAbuse/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id
                }),
            })

            const responseJson = await response.json();
            console.log(responseJson);
        } catch (err) {
            alert(err)
        }
    }

    goToDetails() {
        const { navigation } = this.props;
        navigation.navigate('PostDetails', {id: this.props.commentId});
        console.log(this.props.commentId);
    }

    render() {
        console.log(this.props.city);
        const postColor = PostColors[Math.ceil(Math.random() * (PostColors.length - 1))]
        return (
            <View style={{...styles.container, ...{backgroundColor: 'white'}}}>
                <View style={styles.postHeader}>
                    <FontAwesomeIcon icon={faMapPin} color={fontColor} onPress={() => this.goToDetails()} />
                    <Text style={{padding: 7, color: fontColor}}>{this.props.city}</Text>
                    <Text style={{padding: 7, color: fontColor}}>{Moment(Moment(this.props.time).toDate()).fromNow()}</Text>
                </View>
                <View style={styles.postBody}>
                    <Text style={{padding: 12, color: fontColor, width: '80%'}}>{this.props.content}</Text>
                    <LikeButton style={{width: '20%'}} likes={this.props.likes} commentId={this.props.commentId} liked={this.props.liked} disliked={this.props.disliked} />
                </View>
                {this.props.showOptions ? <View style={styles.postFooter}>
                    <Text style={{fontSize:22}} onPress={() => this.openReportAbuse()}>
                        ...
                    </Text>
                </View> : null}
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
    },
    postBody: {
        flexDirection: 'row',
    },
    postFooter: {
        height: 45,
        // top: 10,
        alignItems: 'center',
        alignContent: 'center',
        fontSize: 32
    }
});

export default RandomPost
