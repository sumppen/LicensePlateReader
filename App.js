import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity, Pressable, Alert} from 'react-native';
import {Camera} from 'expo-camera';
import * as FileSystem from "expo-file-system";
import {FileSystemUploadType} from "expo-file-system";
import {ResultView} from './ResultView'

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const clearResults = () => {
        setStatus('');
        setResult(null);
    }

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if(result != null) {
        console.log(result);
       return (
           <ResultView result={result} onClearResult={clearResults} styles={styles} />
       )
    } else {
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                >
                    <View style={styles.buttonContainer}>
                        <Text style={styles.status}>{status}</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                console.log("Find car pressed")
                                setStatus('Looking up car');
                                if (this.camera) {
                                    console.log("Waiting for picture")
                                    await this.camera.takePictureAsync()
                                        .then(pic => {
                                            console.log("pic received:" + pic.uri)
                                            return FileSystem.uploadAsync("https://lindberg.solutions/api/v1/licensePlate/", pic.uri, {
                                                uploadType: FileSystemUploadType.MULTIPART,
                                                fieldName: 'image',
                                                parameters: {'originalUri': pic.uri}
                                            })
                                        })
                                        .then(res => {
                                            console.log(res.body);
                                            let json = JSON.parse(res.body);
                                            console.log(json[0]);
                                            setResult(json);
                                        })
                                        .catch(error => {
                                            console.log(error.message())
                                        })
                                } else {
                                    console.log("Camera not found");
                                }
                                ;
                            }}
                            style={{
                                width: 130,
                                borderRadius: 4,
                                backgroundColor: '#14274e',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                Find car details
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 3,
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
