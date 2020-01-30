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
  SafeAreaView,
  ScrollView,
} from 'react-native';

import * as FileSystem from 'expo-file-system';


import styles from './style'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

export default class PreviousScansZoomScreen extends React.Component{
  static navigationOptions = {
    title: 'Zoom In',
    // headerLeft: () => {this.props.navigation.navigate('Home')},
  };

  state ={
    id : null,
    img_uri : null,
    diag: null,
    file_dir : null,

    img_ready: false,
    
  }
  async componentDidMount() {
    // this.setState({id: await AsyncStorage.getItem('history_id')})
    id = await AsyncStorage.getItem('history_id')

    let file_dir = FileSystem.documentDirectory + "Predictions/" + id.toString()
    this.setState({file_dir:file_dir})

    // read img and diagnosis
    this.setState({img_uri: file_dir+'/Image.jpg'})
    this.setState({diag: await FileSystem.readAsStringAsync(file_dir+'/Diagnosis.txt')})

    // say that we are ready to render
    this.setState({img_ready:true})


  }

  render(){
    return(
      <View style={styles.container}>
        {this.state.img_ready ?
        <View style={{position:'absolute', top:10, alignItems:'center'}}>
        <Image source={{uri: this.state.img_uri}} style={[styles.imageContainer]} />
        <Text style={{fontSize:20, marginTop:10}}> Diagnosis: {"\n"} {this.state.diag}</Text>

        <TouchableOpacity style={[styles.button, {marginTop:screenHeight*0.16}]} onPress={() => {this.props.navigation.goBack()}}>
          <Text style={styles.button_text}>Go back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {marginTop:10}]} onPress={async () => {
                                          await FileSystem.deleteAsync(this.state.file_dir)  
                                          await this.props.navigation.state.params.onGoBack() 
                                          this.props.navigation.goBack()
                                          }}>
          <Text style={[styles.button_text, {color:'red'}]}>Delete</Text>
        </TouchableOpacity>

        </View>
        :<Text></Text>}


      </View>
    )
  }
}