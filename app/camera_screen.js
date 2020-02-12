import * as React from 'react';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import { AsyncStorage } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import * as FileSystem from 'expo-file-system';


const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

var IMAGE_URI = null;


export default class CameraScreen extends React.Component {
  // Modified from: https://stackoverflow.com/questions/56879188/take-a-picture-with-expo-camera
    state = {
      hasCameraPermission: null,
      hasLoadImgPermission: null,
      type: Camera.Constants.Type.back,
      flash: Camera.Constants.FlashMode.off,
      saved_img: null,
      opacity: 0.7
    };
  
    async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });

      const { status_2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      this.setState({ hasLoadImgPermission: status_2 === 'granted' });
    }
  
    takePicture = async () => {
      if (this.camera) {
          const options = {quality: 1, base64: true};
          const data = await this.camera.takePictureAsync(options);
          // console.log(data);
          this.setState({saved_img: data}) // save the img
          IMAGE_URI = this.state.saved_img.uri

          // Try to save image path
          // image_json = JSON.stringify({uri: IMAGE_URI})
          // console.log("img json:", IMAGE_URI)
          AsyncStorage.setItem('image_key', IMAGE_URI)

          // console.log(data.base64)
          // AsyncStorage.setItem('image_saved_base64', data.base64)

          // let fileUri = FileSystem.documentDirectory + "Images/";
          // try{
          //   await FileSystem.copyAsync({from:IMAGE_URI, to: fileUri+'copy1.jpg'})
            
          // }
          // catch(err){
          //   await FileSystem.makeDirectoryAsync(fileUri, { intermediates: true })
          //   await FileSystem.copyAsync({from:IMAGE_URI, to: fileUri+'copy1.jpg'})
          // }
      }
  
      // Then go to the prediction screen
      this.props.navigation.navigate('Prediction')
    }

      selectImage = async() =>{
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3]
          })
    
          if (!response.cancelled) {
            // const source = { uri: response.uri }
            // this.setState({ image: source })
            IMAGE_URI = response.uri
            AsyncStorage.setItem('image_key', IMAGE_URI)

            this.props.navigation.navigate('Prediction')


          }
        } catch (error) {
          console.log(error)
        }
      }
  
    render() {
      const { hasCameraPermission } = this.state;
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} 
                    type={this.state.type} 
                    ref={(ref) => { this.camera = ref }}
                    autoFocus={Camera.Constants.AutoFocus.on}
                    flashMode={this.state.flash}
                    >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  // flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    // flex: 0.1,
                    width: screenWidth*0.2,
                    height: screenHeight*0.2/3,
                    // alignSelf: 'flex-end',
                    justifyContent: 'center',                  
                    alignItems: 'center',
                    position: 'absolute',
                    top: 35,
                    // backgroundColor: 'black',
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    });
                  }}>
                  {/* <Text style={{ fontSize: 18, color: 'white' }}> Flip </Text> */}
                  <Image source={require("../assets/flip_blue.png")} 
                  style = {{width: screenWidth*0.14, 
                            height: screenWidth*0.14,
                            // alignSelf: 'center',
                            opacity: 0.8}}/>
                </TouchableOpacity>

                
  
                <View style = {{alignItems: 'center',justifyContent: 'center', 
                                width: screenWidth, backgroundColor: 'white', 
                                opacity: this.state.opacity, position: 'absolute', top:0}}>
                  <Text style = {{fontSize: 20, opacity: this.state.opacity}}>
                    Please center complaint area at the aim 
                  </Text>
                </View>
  
                <Image source={require("../assets/aim_green.png")} 
                  style = {{width: screenWidth*0.25, 
                            height: screenWidth*0.25,
                            alignSelf: 'center',
                            opacity: 0.5}}/>

                
                <TouchableOpacity style={{position:'absolute', top:35, right:10}}
                  onPress={() => {
                    this.setState({
                      flash:
                        this.state.flash === Camera.Constants.FlashMode.off
                          ? Camera.Constants.FlashMode.torch
                          : Camera.Constants.FlashMode.off,
                    });}}
                    >
                  <Image source={require("../assets/light_blue.png")} 
                  style = {{width: screenWidth*0.14, 
                            height: screenWidth*0.14,
                            // alignSelf: 'center',
                            opacity: 0.8}}/>
                </TouchableOpacity>

                <TouchableOpacity style={{position:'absolute', bottom:38, right:10}}
                  onPress={() => { this.selectImage()}}>
                  <Image source={require("../assets/upload_img.png")} 
                  style = {{width: screenWidth*0.14, 
                            height: screenWidth*0.14,
                            opacity: 0.8,
                            tintColor:'#859AC2'}}/>
                </TouchableOpacity>
                
                
              
                <TouchableOpacity 
                  style = {{
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: 35,
                }}
                  onPress={() => this.takePicture()}> 
                <Image source={require("../assets/camera_blue.png")} // TODO: search for icon or make one
                style={{width: screenWidth*0.25,
                height: screenWidth*0.25}} /> 
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        );
      }
    }
  }