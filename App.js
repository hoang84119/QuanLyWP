import React, { Component } from "react";
import {
  StatusBar,
  ImageBackground,
  Image,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ToastAndroid,
  AsyncStorage,
  TextInput,
  TouchableOpacity
} from "react-native";
import API from "./src/config/API";
import { createStore } from "redux";
import { Provider } from "react-redux";
import DrawerNavigatorUser from "./src/navigations/DrawerNavigatorUser";
import DrawerNavigator from "./src/navigations/DrawerNavigator";
import FontAwesome from "react-native-vector-icons/FontAwesome";

//Tạo store trong redux
const defaultState = { dataUser: [] };
const reducer = (state = defaultState, action) => {
  if (action.type === "SetDataUser") {
    return { dataUser: action.data };
    //{...,dataUser:action.data}
  }
  if (action.type === "DeleteDataUser") return { dataUser: [] };
  return state;
};
const store = createStore(reducer);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logged: false,
      haveUrl: false,
      showModal: false,
      url: "",
      user:[],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("URL").then(url => {
      if (url === null) {
        this.setState({ loading: false, haveUrl: false });
      } else {
        API.setURL(url);
        this._validateAccount();
        this.setState({ loading: true, haveUrl: true });
      }
    });
  }

  render() {
    let loadingView = (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("./src/image/background/Miaka.jpg")}
      >
        <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
        <View style={{ flex: 1, padding: 5 }}>
          <View style={myStyle.khung}>
            <Image
              style={{ width: 100, height: 100, marginBottom: 25 }}
              source={require("./src/image/logo.png")}
            />
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      </ImageBackground>
    );
    if (!this.state.haveUrl)
      var AddUrl = (
        <ImageBackground
          style={{ flex: 1 }}
          source={require("./src/image/background/Miaka.jpg")}
        >
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ flex: 1, padding: 5 }}>
            <View style={myStyle.khung}>
              <Image
                style={{ width: 100, height: 100, marginBottom: 25 }}
                source={require("./src/image/logo.png")}
              />
              <View style={myStyle.vText}>
                <View style={{ width: 30, alignItems: "center" }}>
                  <FontAwesome
                    name="globe"
                    size={30}
                    style={{ color: "white" }}
                  />
                </View>
                <TextInput
                  placeholderTextColor="white"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  style={myStyle.ctmInput}
                  onChangeText={p => {
                    this.setState({ url: p });
                  }}
                  placeholder="Địa chỉ trang web"
                  value={this.state.url}
                />
              </View>
              <View style={{ height: 50, alignItems: "center" }}>
                <TouchableOpacity onPress={this._addURL}>
                  <Text style={myStyle.ctmBottom}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      );
    let mainView = this.state.loading ? (
      loadingView
    ) : !this.state.haveUrl ? (
      AddUrl
    ) : this.state.user.name === 'admin' ? (
      <DrawerNavigatorUser />
    ) : (
      <DrawerNavigator />
    );
    return (
      <Provider store={store}>
        {/* {mainView} */}
        {mainView}
      </Provider>
    );
  }

  _addURL = () => {
    if(this.state.url == "http://" || this.state.url == "" || this.state.url == "https://" || this.state.url.indexOf(".") == -1)
      ToastAndroid.show("Trang web không hợp lệ!", ToastAndroid.LONG);
    else if(this.state.url.indexOf("http://") != -1 || this.state.url.indexOf("https://") != -1 ){
      //this.setState({url: this.state.url.replace("http://", "").replace("https://", "")})
      AsyncStorage.setItem("URL",this.state.url).then(() => {
        API.setURL(this.state.url);
        this._validateAccount();
        this.setState({ loading: false, haveUrl: true });
      });
    }else{
      AsyncStorage.setItem("URL", "http://" + this.state.url).then(() => {
        API.setURL("http://"+ this.state.url);
        this._validateAccount();
        this.setState({ loading: false, haveUrl: true });
      });
    }
  };

  _validateAccount() {
    API.Account.validate_account().then(response => {
      if (response != null) {
        store.dispatch({
          type: "SetDataUser",
          data: response
        });
        this.setState({
          loading: false,
          logged: true,
          user:response,
        });
      } else {
        this.setState({
          loading: false,
          logged: false
        });
      }
    });
  }
}

export default App;
const myStyle = StyleSheet.create({
  khung: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  vText: {
    borderRadius: 40,
    paddingLeft: 10,
    paddingRight: 10,
    width: 240,
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)"
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
    flex: 1
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
