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

import CameraScreen from './app/camera_screen'
import PredictionScreen from './app/prediction_screen'
import ProfileScreen from './app/profile_screen'
import PreviousScansSreen from './app/previous_scans_screen'
import QuestionScreen from './app/questionnaire_screen'
import PreviousScansZoomScreen from './app/previous_scan_zoom_screen'

import styles from './app/style'

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
        <Text style={{fontStyle: 'italic'}}>DEMO VERSION NOTE: </Text>
        <Text>to login to app please type {'\n'}
         in email box: "email"{'\n'}
         in password box: "password"
         </Text>
         <Text style={{fontStyle: 'italic'}}>OR LEAVE TWO FIELDS EMPTY </Text>
       
        
          
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

  state = {
    uv : this.getUVIndex(),
    // uv: '',
    colorUV : 'green',
    to_alert: true,

  }

  async componentDidMount(){
    col = this.getUVcolor()
    this.setState({colorUV: col})
  }

  getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getUVcolor(){
    uv = this.state.uv
    if (uv<3){
      return 'green'
    }
    else if (uv>=3 && uv<6){
      return 'yellow'
    }
    else if (uv>=6 && uv<8){
      return 'orange'
    }
    else if (uv>=8 && uv<11){
      return 'red'
    }
    else{
      return 'violet'
    }
  }

  getUVIndex(){
    // Ideally connected to some API
    

    // For now just using random number
    var uv = this.getRandomInt(0,12)

    // console.log("uv",uv)
    return uv
  }

  triggerAlert(){
    // this.setState({to_alert: false}) 
    this.state.to_alert = false
    alert("UV index is high")    
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity 
        style = {styles.button}
        onPress={this._questNav}>
          <Text style={styles.button_text}> Scan my skin  🔍</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style = {[styles.button, {marginTop : 15}]}
        onPress={onPress => {this.props.navigation.navigate('PreviousScans')}} > 
          <Text style={styles.button_text}> Previous scans  📔</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style = {[styles.button, {marginTop : 15}]}
        onPress={onPress => {this.props.navigation.navigate('Profile')}} > 
          <Text style={styles.button_text}> My Profile  📋</Text>
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
        
        <View style={{position:'absolute', top:0, left:0, backgroundColor:'black', width: 90, height: 90,
                      alignItems:'center', justifyContent:'center', opacity:0.5}}>
        <Text style={{fontSize:30 , color:this.state.colorUV}}> 
        {this.state.uv} UV </Text>
        </View>
        {this.state.uv > 5 && this.state.to_alert  ? this.triggerAlert() : <Text></Text>}

        <Button title="Sign out" onPress={this._signOutAsync} />
      </View>
    );
  }

  _questNav = () => {
    this.props.navigation.navigate('Questionnaire');
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
  Prediction: PredictionScreen,
  Profile: ProfileScreen,
  PreviousScans: PreviousScansSreen,
  PreviousScansZoom: PreviousScansZoomScreen,
  Questionnaire: QuestionScreen,
});

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