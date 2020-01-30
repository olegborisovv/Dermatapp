import * as React from 'react';

import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Alert
} from 'react-native';


import styles from './style'

export default class PreviousScansSreen extends React.Component{
  static navigationOptions = {
      title: 'Previous Scans',
    };
    
  render() {
    return (
      <View style={styles.container}>
      
      </View>
    
    );
  }
}