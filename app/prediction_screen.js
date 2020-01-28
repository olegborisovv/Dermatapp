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
  Image
} from 'react-native';

import { assert } from '@tensorflow/tfjs-core/dist/util';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet'; // for now use this classifier
import * as jpeg from 'jpeg-js'

const screenWidth = Math.round(Dimensions.get('window').width); // for XR:  414
const screenHeight = Math.round(Dimensions.get('window').height); // for XR: 896


export default class PredictionScreen extends React.Component{
  static navigationOptions = {
    title: 'Analysis',
  };

  state = {
    isTfReady: false,
    isModelReady: false,
    predictions: null,
    image: null,
    image_ready: false,
    start_predict: false
  }

 async componentDidMount() {
  this.setState({image: await AsyncStorage.getItem('image_key')})
  this.setState({image_ready:true})
  // this.state.image = await AsyncStorage.getItem('image_key')
  // this.state.image_ready = true
}

  async componentWillUnmount() {
    this.state.isTfReady = false
    this.state.isModelReady = false
    this.state.start_predict = false
    this.state.image = null
    this.state.image_ready = false
  }


  ////=============== ML part
  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  classifyImage = async () => {
    try {
      // const imageAssetPath = Image.resolveAssetSource(this.state.image)
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const response = await fetch(this.state.image, {}, { isBinary: true })

      const rawImageData = await response.arrayBuffer() // problem somewhere here
      
      const reader = new FileReader();
      await reader.readAsDataURL(response)

      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
    } catch (error) {
      console.log(error)

    }
  }

  renderPrediction = prediction => {
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  async loadMLmodel(){
    this.setState({start_predict : true})
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    //// TODO: adjust for our model
    this.model = await mobilenet.load()
    this.setState({ isModelReady: true })
    this.classifyImage()

  }

  renderConfirmPic(){
    return(
      <View style={{alignSelf: 'center',
                  position: 'absolute',
                  bottom: screenHeight*0.17,}}>
      <TouchableOpacity style= {styles.button} onPress= {() => this.loadMLmodel()}>
        <Text style = {styles.button_text}>
            Process Picture
          </Text> 

      </TouchableOpacity>

      <TouchableOpacity style= {[styles.button, {marginTop: 15}]} onPress= {() => this.props.navigation.navigate('Camera')}>
        <Text style = {styles.button_text}>
            Retake Picture
          </Text> 

      </TouchableOpacity>
      </View>
    )
  }
  
  render() {
    return (
    <View style={styles.container}>
      
      {this.state.start_predict ? 
        <View style={styles.loadingContainer}>
            <Text style={styles.text}>
              Tensorflow ready? {this.state.isTfReady ? <Text>✅</Text> : ''}
            </Text>
            {/* TODO: check if our predictor is also loaded */}

            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>Model ready? </Text>
              {this.state.isModelReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size='small' />
              )}
            </View>
            
        </View> :  <Text> </Text>}
      
      {this.state.image_ready ? 
      <View style={styles.imageWrapper}>
      <Image source={{uri: this.state.image}} style={styles.imageContainer} />
      </View>: <Text> </Text>}

      {this.state.start_predict ? <Text></Text>: this.renderConfirmPic()}

      {/* Make sure to ask user if they want picture to be processed or not */}
      {this.state.start_predict ? 
      <View style={styles.predictionWrapper}>
          {this.state.image && (
            <Text style={{fontSize : screenHeight*0.02}}>
              Results: {this.state.predictions ? '' : (<ActivityIndicator size='small' />)}
            </Text>
          )}
          {this.state.isModelReady &&
            this.state.predictions &&
            this.state.predictions.map(p => this.renderPrediction(p))}
        </View> :  <Text> </Text>}

      <View style={{alignSelf: 'center',
                  position: 'absolute',
                  bottom: "4%",}}>
      <Button title="Home" onPress= {() => this.props.navigation.navigate('Home')}/>
      </View>


    </View> 
    );

  }

}

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