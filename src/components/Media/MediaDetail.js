import React, { Component } from "react";
import {
  ToastAndroid,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import API from "../../config/API";
import Base64 from "../../config/Base64";

const screenWidth = Dimensions.get("window").width;
const screenHeight =
  Dimensions.get("window").height - StatusBar.currentHeight - 50;

export default class MediaDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => params.onDelete()}>
          <Text style={{color:"#fff", fontSize: 18, fontWeight: "bold", marginRight: 15 }}>
            Xóa
          </Text>
        </TouchableOpacity>
        {navigation.getParam("check", 0) === 1 && (
          <TouchableOpacity onPress={() => params.comeBack()}>
            <Text style={{color:"#fff", fontSize: 18, fontWeight: "bold", marginRight: 10 }}>
              Chọn
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
    return { headerRight };
  };
  _onDelete() {
    Alert.alert(
      "Thông báo",
      "Hình này sẽ được xóa vĩnh viễn trong trang web của bạn",
      [
        {
          text: "Xóa",
          onPress: () => {
            API.Image.DeleteImage(this.props.navigation.getParam("id", "")).then(response => {
              if (response) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.props.navigation.navigate("scmedia");
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  }
  _comeBack() {
    //Alert.alert("T", this.state.hinhanh.replace("http://localhost", API.getURL()));
    this.props.navigation.navigate(`${this.props.navigation.getParam("src")}`, {
      srcImage: this.state.hinhanh.replace(/http:\/\/localhost\/thuctap/g, API.getURL())
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      ten: "",
      hinhanh: "",
      width: 0,
      height: 0,
      loaded: false
      //check: this.props.navigation.getParam("checkMedia", 0),
      //refreshing: true
    };
  }
  async loadData() {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/media/" +
        this.props.navigation.getParam("id", "")
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          image = "";
          let width = screenWidth;
          let height =
            (screenWidth * responseJson.media_details.height) /
            responseJson.media_details.width;
          if (height > screenHeight) {
            height = screenHeight;
            width =
              (screenHeight * responseJson.media_details.width) /
              responseJson.media_details.height;
          }
          try {
            image = responseJson.media_details.sizes.large.source_url;
          } catch (e) {
            image = responseJson.media_details.sizes.full.source_url;
          }
          this.setState({
            ten: responseJson.title.rendered,
            hinhanh: image,
            height: height,
            width: width,
            loaded: true
          });
        }
      });
  }
  componentDidMount() {
    this.loadData();
    this.props.navigation.setParams({
      comeBack: this._comeBack.bind(this),
      onDelete: this._onDelete.bind(this)
    });
  }
  render() {
    return (
      <View style={{ backgroundColor: "#000" }}>
        {this.state.loaded && (
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={
              Dimensions.get("window").height - StatusBar.currentHeight - 50
            }
            imageWidth={this.state.width}
            imageHeight={this.state.height}
          >
            <Image
              style={{
                width: this.state.width,
                height: this.state.height
              }}
              source={{
                uri: `${this.state.hinhanh.replace(
                  "http://localhost/thuctap",
                  API.getURL()
                )}`
              }}
            />
          </ImageZoom>
        )}
      </View>
    );
  }
}
