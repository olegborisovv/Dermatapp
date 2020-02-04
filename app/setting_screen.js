import * as React from 'react';

import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView, 
  ScrollView,
  Switch,
  AsyncStorage,
  Slider,
} from 'react-native';



import styles from './style'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

export default class SettingsScreen extends React.Component{
  static navigationOptions = {
      title: 'Settings',
    };
  
  state = {
    allow_send_data : null,
    offline_proc : null,
  }

  async componentDidMount(){
    var send_data_get = await AsyncStorage.getItem('allow_send_data')
    send_data_get = (send_data_get == 'true')
    this.setState({allow_send_data: send_data_get})

    var offline_proc_get = await AsyncStorage.getItem('offline_proc')
    offline_proc_get = (offline_proc_get == 'true')
    this.setState({offline_proc: offline_proc_get})

  }
  
  render(){
    return(
      <View style={styles.container}>
        <View style={{position:'absolute', top:10}}>
          <View style={loc_styles.button}>
            <Text style={loc_styles.category_name}>
              Allow Dermatapp Store Processed Data
            </Text>
            <Switch style = {{position:'absolute', right:10}}
          value={this.state.allow_send_data} 
          onValueChange={async (v)  => {
            this.setState({allow_send_data:v})
            // console.log(v.toString())
            await AsyncStorage.setItem('allow_send_data', v.toString())
            }} />

            <TouchableOpacity style = {{position:'absolute', right:70}}
                              onPress={() => {
                                Alert.alert("Allow Dermatapp Store Processed Data",
                                  "By allowing Dermatapp to store your app related data on our servers,\
you help the company to improve its Analysis System, which will increase the accuracy and the quality of the\
predictions and the services provided. \n\n We value your privacy and guarantee that access to your data will \
not be given to a third party organisations, and will be securely stored on our servers")}}>

              <Image source={require("../assets/info_icon.png")} 
                      style = {{width: screenWidth*0.06,
                        marginTop: 5, 
                        height: screenWidth*0.06,
                        // alignSelf: 'center',
                        opacity: 0.8}}/>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[loc_styles.button, {marginTop:10, minHeight: 100}]} 
            onPress={()=>{alert("This feature is not available yet")}}>
            <Text>Click To Load Predictor</Text>
            <Image source={require("../assets/download_icon.png")} 
                  style = {{width: screenWidth*0.1,
                            marginTop: 5, 
                            height: screenWidth*0.1,
                            // alignSelf: 'center',
                            opacity: 0.8}}/>


          </TouchableOpacity>


          <View style={[loc_styles.button, {marginTop:10}]}>
            <Text style={loc_styles.category_name}>
              Use Offline Processing
            </Text>

            <Switch style = {{position:'absolute', right:10}}
          value={this.state.offline_proc} 
          onValueChange={async (v)  => {
            this.setState({offline_proc:v})
            // console.log(v.toString())
            await AsyncStorage.setItem('offline_proc', v.toString())
            }} />

            <TouchableOpacity style = {{position:'absolute', right:70}}
                              onPress={() => {
                                Alert.alert("Use Offline Processing",
                                  "This option allows you to run the analys offline on your device, without sending data\
 to the server. \n\n Please note that the image processing speed might be affected and that the quality of the prediction\
 depends on the version of the predictor used \n\n\
 When connected to the internet, we highly suggest to use online processing mode")}}>
              <Image source={require("../assets/info_icon.png")} 
                      style = {{width: screenWidth*0.06,
                        marginTop: 5, 
                        height: screenWidth*0.06,
                        // alignSelf: 'center',
                        opacity: 0.8}}/>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    )
  }
}

const loc_styles = StyleSheet.create({
  category_name: {
    fontSize: screenHeight*0.015,
    position: 'absolute',
    left: 10
  },  
  button: {
    minHeight: 0.07*screenHeight,
    width: 0.9*screenWidth,
    // fontSize: screenHeight*0.02,
    backgroundColor: "#F9F4FF",//"#B2FFE7",
    // textAlign: 'center', 
    justifyContent: 'center',
    fontSize: screenHeight*0.02,
    alignItems: 'center',
    borderRadius: 15
  },
})