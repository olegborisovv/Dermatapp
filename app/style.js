import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896

var global_backgroundColor = '#A0FF93'

export default StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: global_backgroundColor
    },
    scroll_container: {
      flex: 1,
      backgroundColor: global_backgroundColor,
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
      minHeight: 0.07*screenHeight,
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
    scrollView: {
      // backgroundColor: '',
      marginHorizontal: 20,
    },

  });