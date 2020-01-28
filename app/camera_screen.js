import * as React from 'react';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import { AsyncStorage } from 'react-native';

import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

var IMAGE_URI = null;


export default class CameraScreen extends React.Component {
  // Modified from: https://stackoverflow.com/questions/56879188/take-a-picture-with-expo-camera
    state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      saved_img: null,
      opacity: 0.7
    };
  
    async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
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


          
          

      }
  
      // Then go to the prediction screen
      this.props.navigation.navigate('Prediction')
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
            <Camera style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref }}>
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
                    bottom: 35,
                    backgroundColor: 'black',
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text style={{ fontSize: 18, color: 'white' }}> Flip </Text>
                </TouchableOpacity>
  
                <View style = {{alignItems: 'center',justifyContent: 'center', width: screenWidth, backgroundColor: 'white', 
                    opacity: this.state.opacity, position: 'absolute', top:0}}>
                  <Text style = {{fontSize: 20, opacity: this.state.opacity}}>Please center complaint area at the aim </Text>
                </View>
  
                <Image source={require("../assets/aim_green.png")} 
                  style = {{width: screenWidth*0.25, 
                            height: screenWidth*0.25,
                            alignSelf: 'center',
                            opacity: 0.5}}/>
                
                
              
                <TouchableOpacity 
                  style = {{
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: 35,
                }}
                  onPress={() => this.takePicture()}> 
                <Image source={require("../assets/camera_green.png")} // TODO: search for icon or make one
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