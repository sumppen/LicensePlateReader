import React, {useState, useEffect} from 'react';
import * as FileSystem from 'expo-file-system';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export const Analyzer = (image) => {
    const [result, setResult] = useState(null);

    if(result == null) {
        return (
            <View>
                <Text>Analyzing image... Please wait</Text>
            </View>
        );
    } else {
        return (
            <View>
                <Text>Found ${result.status} license plates in image</Text>
            </View>
        );
    }
}
