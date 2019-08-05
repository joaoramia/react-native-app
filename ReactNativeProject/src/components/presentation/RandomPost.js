import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapPin, faCircle } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment'
import 'moment/min/locales'
import {fontColor, postHeaderFontSize} from '../../common/assets/styles/variables'
import { getUserToken } from "../../smart/helpers/session";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

class RandomPost extends Component {
    state = {
        modalVisible: false,
        liked: this.props.liked,
        disliked: this.props.disliked,
        likes: this.props.likes
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
        } catch (err) {
            alert(err)
        }
    }

    goToDetails() {
        const { navigation } = this.props;
        navigation.navigate('PostDetails', {id: this.props.commentId});
    }

    render() {
        Moment.locale('pt-br')
        return (
                <View style={{...styles.container, ...{backgroundColor: this.props.color }}}>
                    <TouchableWithoutFeedback style={styles.postHeader} onPress={() => this.props.clickable && this.goToDetails()}>
                        <FontAwesomeIcon size={postHeaderFontSize} icon={faMapPin} color={fontColor}/>
                        <Text style={{paddingLeft: 5, fontSize: postHeaderFontSize, color: fontColor}}>{this.props.city}</Text>
                        <FontAwesomeIcon style={{marginLeft: 5, marginRight: 5}} size={6} icon={faCircle} color={fontColor}/>
                        <Text style={{fontSize: postHeaderFontSize, color: fontColor}}>{Moment(Moment(this.props.time).toDate()).fromNow()}</Text>
                    </TouchableWithoutFeedback>
                    <View style={styles.postBody}>
                        <Text style={{padding: 12, color: fontColor, width: '80%', fontSize: 17}} onPress={() => this.props.clickable && this.goToDetails()}>{this.props.content}</Text>
                        {this.props.children}
                    </View>
                    {
                        this.props.showOptions ?
                            <View style={styles.postFooter}>
                                <Text style={{fontSize:22, color: fontColor}} onPress={() => this.openReportAbuse()}>
                                    ...
                                </Text>
                            </View>
                        :
                            null
                    }
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 4
    },
    postHeader: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7
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
