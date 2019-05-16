import React, { Component } from "react";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  Image,
  ImageBackground
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { connect } from "react-redux";

class Account extends Component {
  render() {
    return (
      <ImageBackground
        style={{
          flex: 1,
          padding: 10,
          paddingTop: StatusBar.currentHeight
        }}
        source={require("../../image/background/KyooPal.jpg")}
      >
        <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
        <View
          style={{
            borderRadius: 5,
            overflow: "hidden",
            flex: 0.4,
            marginBottom: 15
          }}
        >
          {this.props.dataUser.length != 0 && (
            <ImageBackground
              style={{ flex: 1 }}
              source={require("../../image/Material-Background.png")}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Feather style={myStyle.btnBack} size={25} name={"menu"} />
              </TouchableOpacity>
              <View style={myStyle.header}>
                <Image
                  style={myStyle.avatar}
                  source={{ uri: this.props.dataUser.avatar_urls[96] }}
                />
                <Text style={myStyle.name}>{this.props.dataUser.name}</Text>
                <Text style={myStyle.email}>{this.props.dataUser.email}</Text>
              </View>
            </ImageBackground>
          )}
        </View>
        <View style={myStyle.control}>
          <TouchableOpacity style={myStyle.options}>
            <Text style={{ fontSize: 18 }}>Empty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={myStyle.options}>
            <Text style={{ fontSize: 18 }}>Empty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={myStyle.options}>
            <Text style={{ fontSize: 18 }}>Empty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={myStyle.options}>
            <Text style={{ fontSize: 18 }}>Empty</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

//export default Account;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Account);

const myStyle = StyleSheet.create({
  btnBack: {
    paddingLeft: 10,
    paddingTop: 6,
    color: "#fff"
  },
  header: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1
    //backgroundColor: "rgba(255,255,255,0.3)",
  },
  avatar: {
    borderRadius: 50,
    width: 70,
    height: 70
  },
  control: {
    flex: 1
    //alignItems: "center",
    //justifyContent: "center"
  },
  name: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18
  },
  email: {
    color: "#fff",
    marginBottom: 5
  },
  options: {
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 3,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    height: 50,
    //flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)"
  }
});
