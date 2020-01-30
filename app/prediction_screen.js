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
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet'; // for now use this classifier
import * as jpeg from 'jpeg-js';

import styles from './style'

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
    //// TODO: adjust for our model #########################################
    // OLD MODEL: comment when trying with classifier
    this.model = await mobilenet.load() 

    // // SOME EXPERIMENTS
    // console.log("before model")          
    // // const path = './tfjs_custom_model/model.json'
    // const path = require('../tfjs_custom_model/model.json')

    // const path_weights = '../tfjs_custom_model/group1-shard1of4.bin'

    // // this.model = await tf.loadLayersModel(path);
    // // this.model = await tf.loadModel(path);
    // this.model = await tf.loadLayersModel(bundleResourceIO(path, path_weights))

    // console.log("all good")
    //// TODO: adjust for our model #########################################


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

