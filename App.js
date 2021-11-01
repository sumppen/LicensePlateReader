import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {Camera} from 'expo-camera';
import * as FileSystem from "expo-file-system";

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [result, setResult] = useState(null);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (result == null) {
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                >
                </Camera>
                <View style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        title="Find car"
                        onPress={ async () => {
                            console.log("Find car pressed")
                            if (this.camera) {
                                console.log("Waiting for picture")
                                await this.camera.takePictureAsync()
                                    .then(pic => {
                                        console.log("pic received:" + pic.uri)
                                        return FileSystem.uploadAsync("https://lindberg.solutions/api/v1/licensePlate/", pic.uri)
                                    })
                                    .then(res => {
                                        console.log(res.body);
                                        setResult(JSON.parse(res.body));
                                    });
                            } else {
                                console.log("Camera not found");
                            };
                        }}>
                    </Button>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>Found {result.length} license plates in image</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
