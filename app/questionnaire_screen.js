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
  AsyncStorage,
} from 'react-native';

import Dialog from "react-native-dialog";
import ActionSheet from 'react-native-actionsheet';



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
    med : null,

    tag: null,
    tag_dict: null,
    dialogVisible_tag : false,
    temp_tag : null,
    tag : null,
  };

  async componentDidMount(){
    try{
      var getTagDict = await AsyncStorage.getItem('tag_dict')
      this.setState({tag_dict: JSON.parse(getTagDict)})
    }
    catch(err){
      console.log(err)
    }
  }

  // =======================================
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
  };

  // =======================================
  // TAG PART
  // Showing Action Sheet for tags
  showActionSheet = () => {
    //To show the Bottom ActionSheet
    this.ActionSheet.show();
  };

  showDialog_tag() {
    this.setState({ dialogVisible_tag: true });
  };
 
  handleCancel_tag = () => {
    this.setState({ dialogVisible_tag: false });
  };

  handleOk_tag = async () => {
    this.setState({ dialogVisible_tag: false });
    this.setState({tag : this.state.temp_tag})

    this.state.tag = this.state.temp_tag
  };
    

  // =======================================
  render() {
    var tag_dict = this.state.tag_dict;
    var optionArray = []
    if (tag_dict){
      var optionArray = Object.keys(tag_dict)

      if (optionArray.includes('None')){
        optionArray.splice(optionArray.indexOf('None'),1) // remove None from list
      }
      var cancelButtonIdx = optionArray.length + 2
      var addTagIdx = optionArray.length
      var removeTagIdx = optionArray.length + 1

    }
    else{
      var addTagIdx = 0
      var cancelButtonIdx = 2
      var removeTagIdx = 1
    }

    optionArray.push("Add tag")
    optionArray.push("Cancel tag")
    optionArray.push("Cancel")
    
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
        <View style={[loc_styles.button, {marginTop:10, height:100},]}>
          <Text style={{fontSize:screenHeight*0.02, position:'absolute', top:15}}> Are you taking any Medicine?</Text>

          <TouchableOpacity style={{ backgroundColor:'pink', alignItems: 'center', justifyContent: 'center',
                              position: 'absolute', bottom:0, height:'50%', width: '100%',borderBottomEndRadius: 15}} 
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

        <TouchableOpacity style={[loc_styles.button, {marginTop:10, alignItems: 'flex-end'}]}
          onPress={this.showActionSheet}>
          <Text style={loc_styles.category_name}>Tag</Text>
          <Text style={[loc_styles.category_answer, {position: 'absolute',
                      right: 10}]}>
          {this.state.tag ? this.state.tag : 'None'}
          </Text>

        </TouchableOpacity>

        {/* SHOW ACTION SHEET */}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          //Title of the Bottom Sheet
          title={'Which one do you like ?'}
          //Options Array to show in bottom sheet
          options={optionArray}
          //Define cancel button index in the option array
          //this will take the cancel option in bottom and will highlight it
          cancelButtonIndex={cancelButtonIdx}
          //If you want to highlight any specific option you can use below prop
          destructiveButtonIndex={removeTagIdx}
          onPress={index => {
            //Clicking on the option will give you the index of the option clicked
            if (index == cancelButtonIdx){}
            else if (index == addTagIdx){
              // get dialog menu there
              this.showDialog_tag()
            }
            else if (index == removeTagIdx){
              // get dialog menu there
              this.setState({tag:"None"});
            }
            else{
              this.setState({tag:optionArray[index]});
            }
          }}
        />

              <Dialog.Container visible={this.state.dialogVisible_tag}>
              <Dialog.Title>Enter Tag</Dialog.Title>
              <Dialog.Description>
              Please Enter tag for temporal analysis
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={this.handleOk_tag} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel_tag} />
              {/* <Dialog.Input onSubmitEditing={(value) => this.setState(value)}/> */}
              <Dialog.Input 
                style={{color:'black'}}
                autoCapitalize = {"none"} 
                autoCorrect = {false}  
                onChangeText={tag => this.setState({temp_tag: tag})} ></Dialog.Input>
            </Dialog.Container>
        

        </ScrollView>
        <TouchableOpacity style={[styles.button, {position:'absolute', width:'100%', height:screenHeight*0.1, bottom:0}]}
            onPress={() => {
              this.props.navigation.navigate('Camera')

              // also save the current tag state in AsyncStorage
              if (this.state.tag){
                AsyncStorage.setItem('current_tag', this.state.tag)
              }
              else{
                AsyncStorage.setItem('current_tag', "None")
              }
              }}>
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
    alignItems: 'center',
    borderRadius: 15
  },

  category_answer: {
    fontSize: screenHeight*0.02,

  },
})