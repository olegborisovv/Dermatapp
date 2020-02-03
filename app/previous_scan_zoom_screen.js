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

import Dialog from "react-native-dialog";
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
    tag: null,

    img_ready: false,

    dialogVisible : false,    
  }
  async componentDidMount() {
    // this.setState({id: await AsyncStorage.getItem('history_id')})
    id = await AsyncStorage.getItem('history_id')

    let file_dir = FileSystem.documentDirectory + "Predictions/" + id.toString()
    this.setState({file_dir:file_dir})

    // read img and diagnosis
    this.setState({img_uri: file_dir+'/Image.jpg'})
    this.setState({diag: await FileSystem.readAsStringAsync(file_dir+'/Diagnosis.txt')})

    // read img tag
    this.setState({tag: await FileSystem.readAsStringAsync(file_dir+'/Tag.txt')})

    // say that we are ready to render
    this.setState({img_ready:true})


  }

  showDialog() {
    this.setState({ dialogVisible: true });
    this.state.dialogVisible = true
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleDelete = async () => {
    this.setState({ dialogVisible: false });

    // DECREASE counter in AsyncStorage for tag_dict
    // first load and parse
    var getTagDict = await AsyncStorage.getItem('tag_dict')
    var tag_dict = JSON.parse(getTagDict)
    if (tag_dict[this.state.tag] == 1){
      delete tag_dict[this.state.tag]
    }
    else{
      tag_dict[this.state.tag] = tag_dict[this.state.tag] - 1
    }
    await AsyncStorage.setItem('tag_dict',JSON.stringify(tag_dict))

    // Delete local files
    await FileSystem.deleteAsync(this.state.file_dir)  
    await this.props.navigation.state.params.onGoBack() 
    this.props.navigation.goBack()

  };



  // deleteConfirmation(){
  //   // this.showDialog()
  //   // console.log(this.state.dialogVisible)
  //   return(
  //     <View>
  //       <Dialog.Container visible={this.state.dialogVisible}>
  //         <Dialog.Title>Delete file</Dialog.Title>
  //         <Dialog.Description>
  //         Are you sure that you want to delete
  //         </Dialog.Description>
  //         <Dialog.Button label="Delete" onPress={this.handleDelete} />
  //         <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        
  //       </Dialog.Container>
  //     </View>

  //   )
  // }

  render(){
    return(
      <View style={styles.container}>
        {this.state.img_ready ?
        <View style={{position:'absolute', top:10, alignItems:'center'}}>
        <Image source={{uri: this.state.img_uri}} style={[styles.imageContainer]} />

        <View style={styles.diagnosis}>
          <Text style={{fontSize:screenHeight*0.02, textDecorationLine:'underline'}}> Diagnosis:</Text>
          <Text style={{fontSize:screenHeight*0.02, marginTop:5, fontWeight:'bold'}}>{this.state.diag}</Text>
        </View>
        
        {/* GO BACK SCREEN */}
        <TouchableOpacity style={[styles.button, {marginTop:10}]} onPress={() => {this.props.navigation.goBack()}}>
          <Text style={styles.button_text}>Go back</Text>
        </TouchableOpacity>

        {/* DELETE BUTTON */}
        <TouchableOpacity style={[styles.button, {marginTop:10}]} onPress={async () => {this.showDialog()}}>
          <Text style={[styles.button_text, {color:'red'}]}>Delete</Text>
        </TouchableOpacity>


        {/* DELETION WARNING SCREEN */}
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Delete file</Dialog.Title>
          <Dialog.Description>
          Are you sure that you want to delete
          </Dialog.Description>
          <Dialog.Button label="Delete" style={{color:'red'}} onPress={this.handleDelete} />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        
        </Dialog.Container>

        </View>
        :<Text></Text>}

        <View style={{alignSelf: 'center',
                          position: 'absolute',
                          bottom: "4%",}}>
          <Button title="Home" onPress= {() => this.props.navigation.navigate('Home')}/>
        </View>


      </View>
    )
  }
}

const loc_styles = StyleSheet.create({
  
})