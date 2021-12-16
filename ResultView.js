import React, { Component } from 'react';
import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Overlay} from "react-native-elements";


export class ResultView extends Component {

    displayDetails = (licensePlate) => {
        Alert.alert(
            licensePlate.licensePlateNumber,
            `Model: `+licensePlate.model+`\nPower: `+licensePlate.power+`\nRegistration date: `+licensePlate.registrationDate
        )
    }

    overlayStyle = (options) => {
        return {
            position: 'absolute',
            top: options.y-100,
            left: options.x,
        }
    }
    render() {
        return (
            <View style={this.styles.container}>
                <View style={this.styles.image}>
                    <ImageBackground source={{uri: this.props.result.originalUri}} style={this.styles.image}>
                    </ImageBackground>
                    {this.props.result.licensePlates.map((licensePlate) =>
                        <Overlay isVisible={true}
                                 key={licensePlate.licensePlateNumber}
                                 style={this.overlayStyle(licensePlate)}
                                 onBackdropPress={() => {
                                     this.props.onClearResult();
                                 }}>
                            <TouchableOpacity
                                onPress={() => {this.displayDetails(licensePlate)}}
                            >
                                <Text>
                                    {licensePlate.model}
                                </Text>
                            </TouchableOpacity>
                        </Overlay>
                    )}
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        buttonContainer: {
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 50
        },
        button: {
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center',
        },
        status: {
            alignSelf: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 18,
            color: 'white',
        },
        image: {
            flex: 3,
            justifyContent: "center",
        },
    });

}
