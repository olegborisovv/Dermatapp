import * as React from 'react';

// import * as Permissions from 'expo-permissions';
// import { Camera } from 'expo-camera';
// import * as tf from '@tensorflow/tfjs';
// import { fetch } from '@tensorflow/tfjs-react-native';
// import * as mobilenet from '@tensorflow-models/mobilenet'; // for now use this classifier
// import * as jpeg from 'jpeg-js'
// import { assert } from '@tensorflow/tfjs-core/dist/util';



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

import CameraScreen from './app/camera_screen'
import PredictionScreen from './app/prediction_screen'

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896
const login_password = {"email":"password", '':''}; // we can remove last element for demo

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
          <Text style={styles.button_text}> Previous scans </Text>
        </TouchableOpacity>


        <TouchableOpacity 
        style = {{width: screenWidth*0.125, 
          height: screenWidth*0.125,
          position: 'absolute',
          top: screenWidth*0.02,
          right: screenWidth*0.02
                    }} onPress={onPress => {Alert.alert('Disclaimer','The company is not responsible for\
                     the wrong diagnosis. \n Please consult a doctor in case of a doubt')}} >

        <Image source={require("./assets/info_icon.png")} 
           style = {{width: screenWidth*0.125, 
            height: screenWidth*0.125}} />

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



const AppStack = createStackNavigator({ Home: HomeScreen, 
  Camera: CameraScreen, 
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