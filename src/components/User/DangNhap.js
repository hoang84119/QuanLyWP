import React, { Component } from "react";
import {
  StatusBar, Text, View, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, AsyncStorage, Image,
  ImageBackground, ToastAndroid
} from "react-native";
import API from "../../config/API";
import IonIcons from "react-native-vector-icons/Ionicons"
//import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';

class DangNhap extends Component {
  state = {
    user: "",
    pass: "",
    isLoading: false
  };
  async loginNow() {
    this.setState({
      isLoading: true
    });
    if (this.state.user == "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Lỗi", "Tên đăng nhập không được rỗng");
    } else if (this.state.pass == "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Lỗi", "Mật khẩu không được rỗng");
    } else {
      try {
        API.Account.Login(this.state.user, this.state.pass).then(response => {
          this.setState({ isLoading: false });
          if (response) {
            RNRestart.Restart();
          }
          else {
            //ToastAndroid.show(response.admin,ToastAndroid.LONG);
          }
        })
      } catch (e) {
        Alert.alert("Lỗi");
      }
    }
  }
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={require('../../image/background/Miaka.jpg')}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0)"
          animated
        />
        <View style={myStyle.nen}>
          <View style={myStyle.khungDangNhap} />
          <View style={{ alignItems: "center" }}>
            <Image
              style={{ width: 120, height: 120, marginBottom: 50 }}
              source={require("../../image/logo.png")}
            />
            <View style={myStyle.vText}>
              <View style={{ width: 30, alignItems: 'center' }}>
                <IonIcons name="ios-contact-outline" size={32} style={{ color: "white" }} />
              </View>

              <TextInput
                placeholderTextColor="white"
                underlineColorAndroid="rgba(0,0,0,0)"
                style={myStyle.ctmInput}
                onChangeText={u => {
                  this.setState({ user: u });
                }}
                placeholder="Tên tài khoản"
              />
            </View>
            <View style={myStyle.vText}>
              <View style={{ width: 30, alignItems: 'center' }}>
                <IonIcons name="ios-lock-outline" size={31} style={{ color: "white" }} />
              </View>
              <TextInput
                placeholderTextColor="white"
                underlineColorAndroid="rgba(0,0,0,0)"
                style={myStyle.ctmInput}
                onChangeText={p => {
                  this.setState({ pass: p });
                }}
                placeholder="Mật khẩu"
                secureTextEntry={true}
              />
            </View>
            {this.state.isLoading ===
              false && (
                <View style={{ height: 50, alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.loginNow();
                    }}
                  >
                    <Text style={myStyle.ctmBottom}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.state.isLoading && (
              <ActivityIndicator size="large" color="white" />
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default DangNhap;

const myStyle = StyleSheet.create({
  vText: {
    borderRadius: 40,
    paddingLeft: 10,
    paddingRight: 10,
    width: 240,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  ctmBottom: {
    borderRadius: 40,
    fontSize: 20,
    color: "#fff",
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
    backgroundColor: "#EB3E53",
    textAlign: "center",
    width: 240
  },
  ctmInput: {
    backgroundColor: "rgba(255,255,255,0)",
    fontSize: 20,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white"
  },
  nen: {
    flex: 1,
    //backgroundColor: "#36BC63"
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    color: "white",
    marginBottom: 30
  },

  khungDangNhap: {
    flex: 0.4,
    height: 100,
    flexDirection: "row",
    justifyContent: "center"
  }
});
