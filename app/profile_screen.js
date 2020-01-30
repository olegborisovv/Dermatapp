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
  Alert,
  SafeAreaView, 
  ScrollView,
} from 'react-native';

import * as FileSystem from 'expo-file-system';

// import DialogInput from 'react-native-dialog-input';
import Dialog from "react-native-dialog";


import styles from './style'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896



// possible questions:
// - age
// - alergies
// - ancestors genetic illnesses
// - etc.
export default class ProfileScreen extends React.Component{
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    dialogVisible_age: false,
    age : null,
    temp_age : null,

    dialogVisible_allergies : false,
    allergies : null,
    temp_allergies : null

  };

  async componentDidMount() {
    console.log("Inside componentDidMount")

    //// Experiments with WORKING WITH FILESYS
    // let fileUri = FileSystem.documentDirectory + "text.txt";
    // await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });

    // // Attempt to open the file and read contnents
    // var textt = await FileSystem.readAsStringAsync(fileUri);
    // console.log(textt)

    let fileUri = FileSystem.documentDirectory
    // AGE
    try{
      var age_db = await FileSystem.readAsStringAsync(fileUri+'age.txt');
      this.setState({age:age_db})
    }
    catch(err){
    }

    // Allergies
    try{
      var allergies_db = await FileSystem.readAsStringAsync(fileUri+'allergies.txt');
      this.setState({allergies:allergies_db})
    }
    catch(err){
    }

    // Genetic
    try{
      var genetic_db = await FileSystem.readAsStringAsync(fileUri+'genetic.txt');
      this.setState({genetic:genetic_db})
    }
    catch(err){
      // console.log(err)
    }
  }


// INFO ABOUT AGE
  showDialog_age() {
    this.setState({ dialogVisible_age: true });
  };
 
  handleCancel_age = () => {
    this.setState({ dialogVisible_age: false });
  };

  handleOk_age = async () => {
    this.setState({ dialogVisible_age: false });
    this.setState({age : this.state.temp_age})

    this.state.age = this.state.temp_age

    let fileUri = FileSystem.documentDirectory + "age.txt";
    await FileSystem.writeAsStringAsync(fileUri, this.state.age.toString(), { encoding: FileSystem.EncodingType.UTF8 });
  };


// INFO ABOUT ALLERGIES
  showDialog_allergies() {
    this.setState({ dialogVisible_allergies: true });
  };
 
  handleCancel_allergies = () => {
    this.setState({ dialogVisible_allergies: false });
  };

  handleOk_allergies = async () => {
    this.setState({ dialogVisible_allergies: false });
    this.setState({allergies : this.state.temp_allergies})

    this.state.allergies = this.state.temp_allergies

    let fileUri = FileSystem.documentDirectory + "allergies.txt";
    await FileSystem.writeAsStringAsync(fileUri, this.state.allergies.toString(), { encoding: FileSystem.EncodingType.UTF8 });
  };

// INFO ABOUT Genetic disorders 
showDialog_genetic() {
  this.setState({ dialogVisible_genetic: true });
};

handleCancel_genetic = () => {
  this.setState({ dialogVisible_genetic: false });
};

handleOk_genetic = async () => {
  this.setState({ dialogVisible_genetic: false });
  this.setState({genetic : this.state.temp_genetic})

  this.state.genetic = this.state.temp_genetic

  let fileUri = FileSystem.documentDirectory + "genetic.txt";
  await FileSystem.writeAsStringAsync(fileUri, this.state.genetic.toString(), { encoding: FileSystem.EncodingType.UTF8 });
};



  render() {
    return (
      // <View style={styles.container}>
      // </View>
      <SafeAreaView style={styles.scroll_container}>
        <ScrollView style={styles.scrollView}>

                    {/* IMPLEMENTATION OF AGE SCREEN */}
          <View style={[styles.button, {marginTop:5}]}>
            <Text style = {loc_styles.category_name}> Birth Day </Text>
            
            <TouchableOpacity style={{ backgroundColor:'pink', alignItems: 'flex-end' , justifyContent: 'center', 
                              position: 'absolute', right:0, height:'100%', width: '50%'}} 
                              onPress= {() => {this.showDialog_age()}}>  
            <Text style = {loc_styles.category_answer}> {this.state.age ? this.state.age : 'Enter'} </Text>
            </TouchableOpacity>


            <Dialog.Container visible={this.state.dialogVisible_age}>
              <Dialog.Title>Birth day</Dialog.Title>
              <Dialog.Description>
              Please enter in format DD/MM/YYYY
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={this.handleOk_age} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel_age} />
              {/* <Dialog.Input onSubmitEditing={(value) => this.setState(value)}/> */}
              <Dialog.Input style={{color:'black'}}
                            autoCapitalize = {"none"} 
                            autoCorrect = {false}  
                            onChangeText={age => this.setState({temp_age: age})} ></Dialog.Input>
            </Dialog.Container>

          </View>

        {/* ================================ */}
        {/* ================================ */}
        {/* ================================ */}
        {/* IMPLEMENTATION OF ALLERGIES SCREEN */}
        {/* ================================ */}
        {/* ================================ */}
        {/* ================================ */}

          <View style={[styles.button, {marginTop:15}]}>
            <Text style = {loc_styles.category_name}> Allergies </Text>
            
            <TouchableOpacity style={{ backgroundColor:'pink', alignItems: 'flex-end' , justifyContent: 'center', 
                              position: 'absolute', right:0, height:'100%', width: '50%'}} 
                              onPress= {() => {this.showDialog_allergies()}}>  
            <Text style = {loc_styles.category_answer}> {this.state.allergies ? this.state.allergies : 'None'} </Text>
            </TouchableOpacity>


            <Dialog.Container visible={this.state.dialogVisible_allergies}>
              <Dialog.Title>Allergies</Dialog.Title>
              <Dialog.Description>
              Please enter alergies separated by comma
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={this.handleOk_allergies} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel_allergies} />
              {/* <Dialog.Input onSubmitEditing={(value) => this.setState(value)}/> */}
              <Dialog.Input style={{color:'black'}}
                            autoCapitalize = {"none"} 
                            autoCorrect = {false}  
              onChangeText={allerg => this.setState({temp_allergies: allerg})} ></Dialog.Input>
            </Dialog.Container>

          </View>



        {/* ================================ */}
        {/* ================================ */}
        {/* ================================ */}
        {/* IMPLEMENTATION OF Genetic SCREEN */}
        {/* ================================ */}
        {/* ================================ */}
        {/* ================================ */}

        <View style={[styles.button, {marginTop:15}]}>
            <Text style = {loc_styles.category_name}> Genetic disorders </Text>
            
            <TouchableOpacity style={{ backgroundColor:'pink', alignItems: 'flex-end' , justifyContent: 'center', 
                              position: 'absolute', right:0, height:'100%', width: '50%'}} 
                              onPress= {() => {this.showDialog_genetic()}}>  
            <Text style = {loc_styles.category_answer}> {this.state.genetic ? this.state.genetic : 'None'} </Text>
            </TouchableOpacity>


            <Dialog.Container visible={this.state.dialogVisible_genetic}>
              <Dialog.Title>Genetic disorders</Dialog.Title>
              <Dialog.Description>
              Please enter genetic disorders separated by comma
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={this.handleOk_genetic} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel_genetic} />
              <Dialog.Input style={{color:'black'}}
                            autoCapitalize = {"none"} 
                            autoCorrect = {false}  
              onChangeText={foo => this.setState({temp_genetic: foo})} ></Dialog.Input>
            </Dialog.Container>

          </View>




          


        </ScrollView>

      </SafeAreaView>
    );
  }
}

const loc_styles = StyleSheet.create({
  category_name: {
    fontSize: screenHeight*0.025,
    position: 'absolute',
    left: 10
  },

  category_answer: {
    fontSize: screenHeight*0.025,
    position: 'absolute',
    right: 10
  },
  
})