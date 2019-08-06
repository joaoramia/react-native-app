import React, { Component } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { fontColor, dangerNotificationColor } from '../../common/assets/styles/variables';

export default class AlertMessage extends Component {
    constructor(props) {
        super(props)
        this.moveAnimation = new Animated.ValueXY({ x: 0, y: -200 })
    }

    _move = () => {
        Animated.spring(this.moveAnimation, {
            toValue: { x: 0, y: 100 },
        }).start()

        setTimeout(() => {
            Animated.spring(this.moveAnimation, {
                toValue: { x: 0, y: -100 },
            }).start()
        }, 4000);
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.tennisBall, this.moveAnimation.getLayout()]}>
                    <Text style={styles.text}>{this.props.errorMessage || 'Ops... Houve um erro 💩, verifique sua conexão e tente novamente! 🕺'}</Text>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: -100
    },
    tennisBall: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dangerNotificationColor,
        width: '100%',
        minHeight: 80
    },
    text: {
        padding: 24,
        fontSize: 16,
        color: fontColor,
        overflow: 'visible'
    }
});