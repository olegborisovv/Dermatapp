import * as React from 'react';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet'; // for now use this classifier


import * as jpeg from 'jpeg-js'


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
  Image
} from 'react-native';



import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { assert } from '@tensorflow/tfjs-core/dist/util';

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896
const login_password = {"email":"password", '':''}; // we can remove last element for demo
var IMAGE_URI = null;

// ================== SIGN IN SCREEN

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };
  state = {email : '',
          password : '',
        }


  render() {
    return (
      <View style={styles.container}>
          
        <TextInput
          style={styles.text_input_style}
          placeholder="Type your email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCapitalize = {"none"}
        />
        <TextInput
          style={[styles.text_input_style, {marginTop : 10}]}
          placeholder="Type your Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          secureTextEntry = {true}
        />
        


        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', "abc");
    if (this.state.email in login_password){
      if (login_password[this.state.email] == this.state.password){
        this.props.navigation.navigate('App');
      }
      else{
        alert("Entered email or password are incorrect")
      }
    }
    else{
      alert("Entered email is not registered")
    }
    // this.props.navigation.navigate('App');
  };
}
// ====================================================== 
// ================== HOME SCREEN i.e. the main screen
// ====================================================== 

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the Dermatapp!',
  };

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity 
        style = {styles.button}
        onPress={this._cameraNav}>
          <Text style={styles.button_text}> Scan my skin  🔍</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style = {[styles.button, {marginTop : 15}]}
        onPress={this._cameraNav} > 
          <Text style={styles.button_text}> Previous results </Text>
        </TouchableOpacity>


        <Button title="Sign out" onPress={this._signOutAsync} />
      </View>
    );
  }

  _cameraNav = () => {
    this.props.navigation.navigate('Camera');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

// ======================================================
// ================== Camera screen
// ======================================================
class CameraScreen extends React.Component {
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
    }
    // console.log(this.state.saved_img.uri) // <------- allows us to get uri of image
    // console.log(IMAGE_URI)
    console.log(screenHeight, screenWidth)

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

              <Image source={require("./assets/aim_green.png")} 
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
              <Image source={require("./assets/camera_green.png")} // TODO: search for icon or make one
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

// ======================================================
// ================== Prediction screen (show taken image and do prediction)
// ======================================================

class PredictionScreen extends React.Component{
  static navigationOptions = {
    title: 'Analysis',
  };

  state = {
    isTfReady: false,
    isModelReady: false,
    predictions: null,
    image: IMAGE_URI,
    start_predict: false
  }

  // async componentDidMount() {
  //   await tf.ready()
  //   this.setState({
  //     isTfReady: true
  //   })
  //   //// TODO: adjust for our model
  //   this.model = await mobilenet.load()
  //   this.setState({ isModelReady: true })
  //   this.classifyImage()
  // }

  async componentWillUnmount() {
    this.state.isTfReady = false
    this.state.isModelReady = false
    this.state.start_predict = false
  }


  ////=============== ML part
  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  classifyImage = async () => {
    try {
      // const imageAssetPath = Image.resolveAssetSource(this.state.image)
      // console.log(this.state.image)
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const response = await fetch(this.state.image, {}, { isBinary: true })

      const rawImageData = await response.arrayBuffer() // problem somewhere here
      
      const reader = new FileReader();
      await reader.readAsDataURL(response)

      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
    } catch (error) {
      console.log(error)

    }
  }

  renderPrediction = prediction => {
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  async loadMLmodel(){
    this.setState({start_predict : true})
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    //// TODO: adjust for our model
    this.model = await mobilenet.load()
    this.setState({ isModelReady: true })
    this.classifyImage()

  }

  renderConfirmPic(){
    return(
      <View style={{alignSelf: 'center',
                  position: 'absolute',
                  bottom: screenHeight*0.17,}}>
      <TouchableOpacity style= {styles.button} onPress= {() => this.loadMLmodel()}>
        <Text style = {styles.button_text}>
            Process Picture
          </Text> 

      </TouchableOpacity>

      <TouchableOpacity style= {[styles.button, {marginTop: 15}]} onPress= {() => this.props.navigation.navigate('Camera')}>
        <Text style = {styles.button_text}>
            Retake Picture
          </Text> 

      </TouchableOpacity>
      </View>
    )
  }
  
  render() {
    return (
    <View style={styles.container}>
      
      {this.state.start_predict ? 
        <View style={styles.loadingContainer}>
            <Text style={styles.text}>
              Tensorflow ready? {this.state.isTfReady ? <Text>✅</Text> : ''}
            </Text>
            {/* TODO: check if our predictor is also loaded */}

            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>Model ready? </Text>
              {this.state.isModelReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size='small' />
              )}
            </View>
            
        </View> :  <Text> </Text>}
      
      <View style={styles.imageWrapper}>
      <Image source={{uri: this.state.image}} style={styles.imageContainer} />
      </View>

      {this.state.start_predict ? <Text></Text>: this.renderConfirmPic()}

      {/* Make sure to ask user if they want picture to be processed or not */}
      {this.state.start_predict ? 
      <View style={styles.predictionWrapper}>
          {this.state.image && (
            <Text style={{fontSize : screenHeight*0.02}}>
              Results: {this.state.predictions ? '' : (<ActivityIndicator size='small' />)}
            </Text>
          )}
          {this.state.isModelReady &&
            this.state.predictions &&
            this.state.predictions.map(p => this.renderPrediction(p))}
        </View> :  <Text> </Text>}

      <View style={{alignSelf: 'center',
                  position: 'absolute',
                  bottom: "4%",}}>
      <Button title="Home" onPress= {() => this.props.navigation.navigate('Home')}/>
      </View>


    </View> 
    );

  }

}

// ======================================================
// ================== AuthLoadingScreen (idk what is it needed tbh)
// ======================================================

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}



const AppStack = createStackNavigator({ Home: HomeScreen, Camera: CameraScreen, 
    Prediction: PredictionScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A0FF93'
  },

  text_input_style: {
    height: screenHeight*0.08, 
    textAlign: 'center', 
    width: screenWidth*0.9, 
    borderColor: 'black', 
    borderWidth: 1,
    fontSize: screenHeight*0.02
  },
  button: {
    height: 0.07*screenHeight,
    width: 0.9*screenWidth,
    // fontSize: screenHeight*0.02,
    backgroundColor: "white",
    // textAlign: 'center', 
    justifyContent: 'center',
    fontSize: screenHeight*0.02,
    alignItems: 'center'
  },
  button_text: {
    fontSize: screenHeight*0.03,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 10,
    // marginTop: 10,
    justifyContent: 'center'
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: screenWidth*1,
    height: screenWidth*1,
    padding: 10,
    borderColor: '#cf667f',
    borderWidth: 5,
    borderStyle: 'dashed',
    // marginTop: screenHeight*0.05,
    marginBottom: 10,
    position: 'absolute',
    top: screenHeight*0.1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: screenWidth*0.95,
    height: screenWidth*0.95,
    padding: 10
    // position: 'absolute',
    // top: 10,
    // left: 10,
    // bottom: 10,
    // right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
    top: screenHeight*0.2,
    // backgroundColor: 'white',
    alignItems: 'center',
  },
});