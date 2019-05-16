import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Text,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  ImageBackground,
  StatusBar
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import API from "../config/API";
import RNRestart from 'react-native-restart';
import FontAwesome from "react-native-vector-icons/FontAwesome";

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      address: false
    };
  }
  componentDidMount(){
    this.setState({url:API.getURL()});
  }
  _onAnddres(){
    this.setState({address: true})
    }
  render() {
    return (
      <ImageBackground style={{ flex: 1, paddingTop: StatusBar.currentHeight}} source={require('../image/background/KyooPal.jpg')}>
        <StatusBar
              translucent
              backgroundColor="rgba(0, 0, 0, 0)"
              animated
            />
        <View style={myStyle.header}>
          <TouchableOpacity style={myStyle.header} onPress={() => this.props.navigation.openDrawer()}>
            <Feather style={[myStyle.icon,{marginLeft: 12, marginRight:0, color: "#fff"}]} name="chevron-left" size={28} />
            <Feather style={[myStyle.icon,{color: "#fff"}]} name="settings" size={24} />
          </TouchableOpacity>
          <Text style={{color: "#fff", fontWeight: "bold", fontSize: 20}}>Cài đặt</Text>
        </View>
      {
        this.state.address == true && (
          <Modal
            transparent={true}
            animationType={"fade"}
            visible={this.state.address}
            onRequestClose={() => null}
          >
          <TouchableWithoutFeedback onPress={() => this.setState({ address: false })}>
            <View style={myStyle.modalBackground}>
              <View style={myStyle.contentModal}>
              <View style={{justifyContent: "flex-start", alignItems: "flex-start"}}>
                <Text style={myStyle.title}>Thay đổi địa chỉ</Text>
              </View>
              <TextInput
                underlineColorAndroid="#0ABFBC"
                autoFocus={true}
                style={myStyle.input}
                onChangeText={p => {
                  this.setState({ url: p });
                }}
                value={this.state.url}
                placeholder="Địa chỉ trang web"
              />
              <Text style={{marginBottom: 10}}> VD: http://abc.com, https://xyz.org...</Text>
              <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                <TouchableOpacity onPress={() =>  { this.setState({address: false})}}><Text style={[myStyle.txt,{color: "gray"}]} >Hủy</Text></TouchableOpacity>
                <TouchableOpacity onPress={() =>  { this._addURL()}}><Text style={myStyle.txt} >Chỉnh sửa</Text></TouchableOpacity>
              </View>
              </View>
              
            </View>
          </TouchableWithoutFeedback>
          </Modal>
        )
      }
      <ScrollView style={{flex: 1, padding: 20, paddingTop: 0}}>
      
        <TouchableOpacity onPress = {() => this._onAnddres()} style={myStyle.btn}>
          <FontAwesome name="globe" size={24} style={myStyle.icon} />
          <Text style={myStyle.text}>Thay đổi địa chỉ</Text>
        </TouchableOpacity>
      </ScrollView>
      </ImageBackground>
    );
  }

  _addURL = () => {
    if(this.state.url == "http://" || this.state.url == "" || this.state.url == "https://" || this.state.url.indexOf(".") == -1)
      ToastAndroid.show("Trang web không hợp lệ!", ToastAndroid.LONG);
    else if(this.state.url.indexOf("http://") != -1 || this.state.url.indexOf("https://") != -1 )
            {
              this.setState({address: false})
              AsyncStorage.setItem("URL", this.state.url).then(()=>{
                  RNRestart.Restart();
              })
            }
            else{
              this.setState({address: false})
              AsyncStorage.setItem("URL", "http://" + this.state.url).then(()=>{
                  RNRestart.Restart();
              })
            }

  };
}

const myStyle = StyleSheet.create({
  header:{
    alignItems: "center",
    justifyContent: "flex-start",
    //marginTop: StatusBar.currentHeight,
    height: 50,
    flexDirection: "row",
  },
  btn:{
    backgroundColor: "rgba(255,255,255,0.3)",
    flex: 1,
    //height: 40,
    justifyContent: "flex-start",
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    marginBottom: 7
  },
  text:{
    fontWeight: "bold",
    fontSize: 18,
    color: "#f9f9f9"
  },
  icon:{
    color: "#f9f9f9",
    marginRight: 10
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000010"
  },
  contentModal: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    //display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    width: 300,
    height: 170
  },
  title:{
    color: "#0ABFBC",
    fontSize: 20,
    marginBottom: 12
  }, 
  txt:{
    paddingHorizontal: 10,
    //paddingTop: 3,
    textAlign: "right",
    color: "#0ABFBC",
    fontSize: 17,
  },
  input:{
    //marginVertical: 10
    fontSize: 16
  }
})
export default Setting;
