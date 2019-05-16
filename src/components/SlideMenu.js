import React, { Component } from "react";
import {
  View,
  StatusBar,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage,
  ToastAndroid,
  Modal
} from "react-native";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import RNRestart from "react-native-restart";

class SlideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setmodal: false
    };
  }
  setModal(i) {
    this.setState({ setmodal: i });
  }
  render() {
    var accountView =
      this.props.dataUser.length != 0 ? (
        <ImageBackground
          source={require("../image/Material-Background.png")}
          style={myStyle.imageBackground}
        >
          <Image
            style={myStyle.avatar}
            source={{ uri: this.props.dataUser.avatar_urls[96] }}
          />
          <Text style={myStyle.name}>{this.props.dataUser.name}</Text>
        </ImageBackground>
      ) : (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Login")}
          style={[myStyle.button, { marginTop: 2 * StatusBar.currentHeight }]}
        >
          <Feather style={myStyle.icon} name="log-in" size={18} />
          <Text style={myStyle.txt}>Đăng nhập</Text>
        </TouchableOpacity>
      );
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../image/background/Miaka.jpg")}
      >
        <Modal
          transparent={true}
          visible={this.state.setmodal}
          onRequestClose={() => null}
        >
          <View style={myStyle.modalBackground}>
            <View style={myStyle.activityIndicatorWrapper}>
              <Text
                style={{
                  flex: 0.1,
                  color: "#0ABFBC",
                  padding: 8,
                  fontSize: 18
                }}
              >
                Giới thiệu
              </Text>
              <ScrollView
                style={{
                  flex: 0.8,
                  paddingHorizontal: 10,
                  borderBottomWidth: 1,
                  borderColor: "#efefef"
                }}
              >
                <Text>
                  GSOFT là công ty phần mềm hướng công nghệ, được sáng lập bởi
                  những người có tâm huyết, có năng lực và kinh nghiệm chuyên
                  môn cao với mong muốn hình thành và phát triển một công ty
                  phần mềm hàng đầu tại Việt Nam và vươn tầm ra thế giới. GSOFT
                  cung cấp các giải pháp phần mềm quản lý cho các doanh nghiệp
                  tập đoàn, tổng công ty, ngân hàng, trường đại học, bệnh viện,
                  các giải pháp kết nối cộng đồng trên nền tảng internet, các hệ
                  thống website và các dịch vụ liên quan đến website, các hệ
                  thống trong lĩnh vực thương mại điện tử và chính phủ điện tử.
                  GSOFT luôn tập trung nghiên cứu và ứng dụng tinh hoa công nghệ
                  vào thực tiễn đời sống nhằm mục đích nâng cao chất lượng cuộc
                  sống vì cộng đồng.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={{ flex: 0.1, padding: 7, alignItems: "center" }}
                onPress={() => {
                  this.setModal(false);
                }}
              >
                <Text style={{ fontSize: 18, color: "#0ABFBC" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView>
          {/* <View style={{ zIndex: 1, position: "absolute", left: 0, flex: 1, width: Dimensions.get('window').width, height:StatusBar.currentHeight, backgroundColor: "rgba(0,0,0,0.1)"}}></View> */}
          <View style={myStyle.container}>
            {accountView}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
              style={myStyle.button}
            >
              <Feather style={myStyle.icon} name="home" size={18} />
              <Text style={myStyle.txt}>Trang chủ</Text>
            </TouchableOpacity>
            {this.props.dataUser.length != 0 && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Account")}
                style={myStyle.button}
              >
                <Feather style={myStyle.icon} name="user" size={18} />
                <Text style={myStyle.txt}>Tài khoản</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Setting")} style={myStyle.button}>
              <Feather style={myStyle.icon} name="settings" size={18} />
              <Text style={myStyle.txt}>Cài đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={myStyle.button}
              onPress={() => {
                this.setModal(true);
              }}
            >
              <Feather style={myStyle.icon} name="info" size={18} />
              <Text style={myStyle.txt}>Giới thiệu</Text>
            </TouchableOpacity>
            {this.props.dataUser.length != 0 && (
              <TouchableOpacity onPress={this._onLogout} style={myStyle.button}>
                <Feather style={myStyle.icon} name="log-out" size={18} />
                <Text style={myStyle.txt}>Đăng xuất</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
  _onLogout = () => {
    AsyncStorage.removeItem("Base64").then(() => {
      this.props.dispatch({
        type: "DeleteDataUser"
      });
      //this.props.navigation.setParams({userName: ""});
      RNRestart.Restart();
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      //BackHandler.exitApp();
    });
  };
}

const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    //backgroundColor: 'blue',
  },
  imageBackground: {
    height: 150,
    flexDirection: "column",
    //alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    margin: 10
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    margin: 10,
    fontSize: 20
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10
  },
  icon: {
    textAlign: "center",
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginRight: 10,
    marginLeft: 3,
    color: "#fff"
  },
  txt: {
    color: "#fff",
    fontSize: 18
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040"
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    width: 300,
    height: 350,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  }
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(SlideMenu);
