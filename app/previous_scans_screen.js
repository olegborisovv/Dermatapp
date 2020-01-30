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
  SafeAreaView,
  ScrollView,
} from 'react-native';

import * as FileSystem from 'expo-file-system';


import styles from './style'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

export default class PreviousScansSreen extends React.Component{
  static navigationOptions = {
      title: 'Previous Scans',
    };

  state = {
    image_ready : false,
    images_list : [], // of format [{id:1, uri: '...'} ] possibly we can predictions there as well
  }

  // async componentWillUnmount() { // Didnt help
  //   this.state.image_ready = false
  //   this.state.images_list = [] // of format [{id:1, uri: '...'} ] possibly we can predictions there as well
  // }

  async updateView(){
    this.setState({images_list: []})
    this.setState({image_ready:false})


    let main_dir = FileSystem.documentDirectory + "Predictions/"

    // Check if Predictions dir exists, if not create it
    var main_dir_info = await FileSystem.getInfoAsync(main_dir)
    if (main_dir_info.exists){
      var directory_content = await FileSystem.readDirectoryAsync(main_dir)
      
      // make sure that Predictions dir is not empty!
      if (directory_content.length > 0){

        directory_content = directory_content.sort().reverse()
      
        // here run the loop and extract all images 
        // follow this idea to loop over the views 
        // https://stackoverflow.com/questions/42519800/how-to-loop-and-render-elements-in-react-native

        for (var i = 0; i < directory_content.length; i++) {
          var dict = {id : directory_content[i],
                  img: main_dir+directory_content[i]+'/Image.jpg',
                  diag: await FileSystem.readAsStringAsync(main_dir+directory_content[i]+'/Diagnosis.txt')
                }
          this.state.images_list.push(dict)

          this.setState({image_ready: true})
        }

      }
    }

  }

  async componentDidMount(){
    this.updateView()
    // // read directory
    // let main_dir = FileSystem.documentDirectory + "Predictions/"

    // // Check if Predictions dir exists, if not create it
    // var main_dir_info = await FileSystem.getInfoAsync(main_dir)
    // if (main_dir_info.exists){
    //   var directory_content = await FileSystem.readDirectoryAsync(main_dir)
      
    //   // make sure that Predictions dir is not empty!
    //   if (directory_content.length > 0){
    //     directory_content = directory_content.sort().reverse()
      
    //     // here run the loop and extract all images 
    //     // follow this idea to loop over the views 
    //     // https://stackoverflow.com/questions/42519800/how-to-loop-and-render-elements-in-react-native

    //     for (var i = 0; i < directory_content.length; i++) {
    //       var dict = {id : directory_content[i],
    //               img: main_dir+directory_content[i]+'/Image.jpg',
    //               diag: await FileSystem.readAsStringAsync(main_dir+directory_content[i]+'/Diagnosis.txt')
    //             }
    //       this.state.images_list.push(dict)

    //       this.setState({image_ready: true})
    //     }
    //   }
    // }
  }

// // CREATE A MAP TO ITERATE
//  from here: https://stackoverflow.com/questions/42519800/how-to-loop-and-render-elements-in-react-native
//   buttonsListArr = this.state.images_list.map(unique_img => (
//     <TouchableOpacity key={unique_img.id} style={loc_styles.item}>
//           <Image
//           source={{uri: unique_img.img}}
//           style = {loc_styles.image}
//           />
//         </TouchableOpacity>
//   )
//   )

  render() {
    return (
      <SafeAreaView style={styles.scroll_container}>
        <ScrollView style={styles.scrollView} directionalLockEnabled={true} automaticallyAdjustContentInsets={false}

>
        {this.state.image_ready ? 
        this.state.images_list.map(unique_img => (
          <TouchableOpacity key={unique_img.id} 
              style={loc_styles.item}
              onPress = {() => {
                          AsyncStorage.setItem('history_id', unique_img.id)
                          // this.setState({ state: this.state })
                          this.props.navigation.navigate('PreviousScansZoom',
                          {
                            onGoBack: () => {
                              this.updateView()
                              // this.componentDidMount()
                            },
                          }
                          )
                          }}>
                <Image
                source={{uri: unique_img.img}}
                style = {loc_styles.image}
                />
                <Text style={{fontSize:20, 
                  marginLeft:screenWidth*0.2,
                  marginRight:screenWidth*0.4}}> 

                  {unique_img.diag}
                </Text>
              </TouchableOpacity>))

        : <Text style={{marginTop:100}}>No Diagnosis to show</Text>}
      
      </ScrollView>

    </SafeAreaView>
    
    );
  }
}

const loc_styles = StyleSheet.create({
  image: {
    width: screenWidth*0.3, 
    height: screenWidth*0.3,
    // flex: 0.4
  },

  item: {
    marginTop : 10,
    height: screenWidth*0.3,
    width: screenWidth,
    backgroundColor:'pink',
    flexDirection:"row",
    alignItems:'center'
    
  },

  
})