import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  TextInput,
  Dimensions
} from 'react-native';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const login_password = {"email":"password", '':''}; // we can remove last element for demo

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

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp}/>
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

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



const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
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
  },
  text_input_style: {height: screenHeight*0.08, textAlign: 'center', width: screenWidth*0.9, 
  borderColor: 'grey', borderWidth: 1,fontSize: screenHeight*0.02}
});