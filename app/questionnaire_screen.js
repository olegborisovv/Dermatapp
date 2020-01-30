import * as React from 'react';

import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView, 
  ScrollView,
  Switch,
} from 'react-native';

import Dialog from "react-native-dialog";



import styles from './style'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896


export default class QuestionScreen extends React.Component{
  static navigationOptions = {
      title: 'Symptoms',
    };

  state = {
    use_questionnaire: false,
    itchy : null,
    burns : null,
    pain : null,

    dialogVisible_med : false,
    temp_med : null,
    med : null
  };

  // INFO ABOUT MED
  showDialog_med() {
    this.setState({ dialogVisible_med: true });
  };
 
  handleCancel_med = () => {
    this.setState({ dialogVisible_med: false });
  };

  handleOk_med = async () => {
    this.setState({ dialogVisible_med: false });
    this.setState({med : this.state.temp_med})

    this.state.med = this.state.temp_med

    // let fileUri = FileSystem.documentDirectory + "age.txt";
    // await FileSystem.writeAsStringAsync(fileUri, this.state.age.toString(), { encoding: FileSystem.EncodingType.UTF8 });
  };
    
  render() {
    return (
      <SafeAreaView style={styles.scroll_container}>
        <ScrollView style={styles.scrollView}>

        {/* INTRO TEXT AND SKIP BUTTON */}
        <View style={{alignItems: 'center'}}>
          <Text style={{marginTop:10, fontSize:screenWidth*0.04}}> Please provide some symptoms </Text>
          <Text style={{marginTop:10, fontSize:screenWidth*0.04, fontStyle:'italic'}}> 
          You can skip this step if you wish
          </Text>
          <Button title="Skip questionnaire" onPress={() => {this.props.navigation.navigate('Camera')}}/>
        </View>

        {/* SWITCHES */}
        <View style={[loc_styles.button, {marginTop:10, fontSize:10, backgroundColor:"#ff4d00"}]}>
          <Text style={[loc_styles.category_name,{fontSize:screenHeight*0.015}]}>USE SYMPTOMS FOR ANALYSIS</Text>
          <Switch style = {{position:'absolute', right:10}}
          value={this.state.use_questionnaire} 
          onValueChange={v => {this.setState({use_questionnaire:v})}} />
        </View>

        <View style={[loc_styles.button, {marginTop:10}]}>
          <Text style={loc_styles.category_name}>Itchy</Text>
          <Switch style = {{position:'absolute', right:10}}
          value={this.state.itchy} 
          onValueChange={v => {this.setState({itchy:v})}} />
        </View>

        <View style={[loc_styles.button, {marginTop:10}]}>
          <Text style={loc_styles.category_name}>Burns</Text>
          <Switch style = {{position:'absolute', right:10}}
          value={this.state.burns} 
          onValueChange={v => {this.setState({burns:v})}} />
        </View>

        <View style={[loc_styles.button, {marginTop:10}]}>
          <Text style={loc_styles.category_name}>Painful</Text>
          <Switch style = {{position:'absolute', right:10}}
          value={this.state.pain} 
          onValueChange={v => {this.setState({pain:v})}} />
        </View>


        {/* MEDICINE QUESTIONS */}
        <View style={[loc_styles.button, {marginTop:10, height:100}]}>
          <Text style={{fontSize:screenHeight*0.02, position:'absolute', top:15}}> Are you taking any Medicine?</Text>

          <TouchableOpacity style={{ backgroundColor:'pink', alignItems: 'center', justifyContent: 'center',
                              position: 'absolute', bottom:0, height:'50%', width: '100%'}} 
                              onPress= {() => {this.showDialog_med()}}>  
            <Text style = {loc_styles.category_answer}> {this.state.med ? this.state.med : 'Click to enter'} </Text>
            </TouchableOpacity>
          

            <Dialog.Container visible={this.state.dialogVisible_med}>
              <Dialog.Title>Enter Medicine</Dialog.Title>
              <Dialog.Description>
              Please separate by comma or space
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={this.handleOk_med} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel_med} />
              {/* <Dialog.Input onSubmitEditing={(value) => this.setState(value)}/> */}
              <Dialog.Input 
                style={{color:'black'}}
                autoCapitalize = {"none"} 
                autoCorrect = {false}  
                onChangeText={med => this.setState({temp_med: med})} ></Dialog.Input>
            </Dialog.Container>
        </View>
        {/* GO TO THE CAMERA SCREEN BUTTON */}       
        {/* <Button title="Scan my skin" onPress={() => {this.props.navigation.navigate('Camera')}}/> */}
        

        </ScrollView>
        <TouchableOpacity style={[styles.button, {width:'100%'}]}
            onPress={() => {this.props.navigation.navigate('Camera')}}>
          <Text style={styles.button_text}> Scan my skin </Text>

        </TouchableOpacity>
      </SafeAreaView>
    
    );
  }
}

const loc_styles = StyleSheet.create({
  category_name: {
    fontSize: screenHeight*0.025,
    position: 'absolute',
    left: 20
  },  
  button: {
    minHeight: 0.07*screenHeight,
    width: 0.9*screenWidth,
    // fontSize: screenHeight*0.02,
    backgroundColor: "#B2FFE7",
    // textAlign: 'center', 
    justifyContent: 'center',
    fontSize: screenHeight*0.02,
    alignItems: 'center'
  },

  category_answer: {
    fontSize: screenHeight*0.02,

  },
})