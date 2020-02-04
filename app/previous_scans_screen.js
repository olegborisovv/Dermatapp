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
                  diag: await FileSystem.readAsStringAsync(main_dir+directory_content[i]+'/Diagnosis.txt'),
                  tag: await FileSystem.readAsStringAsync(main_dir+directory_content[i]+'/Tag.txt')
                }
          this.state.images_list.push(dict)

          this.setState({image_ready: true})
        }

      }
    }

  }

  async componentDidMount(){
    // await AsyncStorage.removeItem("tag_dict")
    // await AsyncStorage.setItem('tag_dict',JSON.stringify({tag1:1, Tag2:1}))
    console.log("tag dict",await AsyncStorage.getItem("tag_dict"))
    // await FileSystem.deleteAsync(FileSystem.documentDirectory + "Predictions/1580729466288")
    this.updateView()
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

getTimeStamp(UNIX_timestamp){
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var a = new Date(UNIX_timestamp * 1);
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  // var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if (min.toString().length==1){
    min = '0'+min.toString()
  }
  var time = hour+':'+min+":"+sec+ ' '+date+'/'+month+'/'+year;
  return time;
}

showTag(tag){
  if (tag!='None'){
    return (
      <View style={{backgroundColor:'#B171FD', borderRadius:15, width:120, justifyContent:'center', alignItems:'center', 
      position:'absolute', bottom:5, right: 5,
      }}>
        <Text style={{fontSize:12}}> 
            Tag: {tag}

        </Text>
      </View>
    )
  }
}

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
                <View style={{height:"100%", width:'65%', justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:12, 
                    // marginLeft:screenWidth*0.2,
                    // marginRight:screenWidth*0.3,
                    position:'absolute',
                    top:10,
                    right:0,
                    fontStyle:"italic"
                    
                    }}>
                  {this.getTimeStamp(unique_img.id)}
                  </Text>

                  <Text style={{fontSize:20, 
                    // marginLeft:screenWidth*0.2,
                    // marginRight:screenWidth*0.4
                    }}> 
                    
                    {unique_img.diag.split('\n')[0]}
                  </Text>
                  <Text style={{fontSize:15, 
                    // marginLeft:screenWidth*0.2,
                    // marginRight:screenWidth*0.4,
                    fontStyle:'italic'}}> 
                    
                    Certainty: {unique_img.diag.split('\n')[1]}
                  </Text>
                  
                  {this.showTag(unique_img.tag)}

                </View>
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
    width: "100%",
    backgroundColor: '#F9F4FF' ,//'pink',
    flexDirection:"row",
    alignItems:'center',
    borderRadius: 15,
    
  },

  
})