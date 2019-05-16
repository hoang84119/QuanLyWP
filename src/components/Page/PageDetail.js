import React, { Component } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Dimensions
} from "react-native";
import HTML from "react-native-render-html";
import API from "../../config/API";
import Base64 from "../../config/Base64";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

class PageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      tacgia: [],
      binhluan: [],
      loaded: false,
      refreshing: true,
      isComment: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    if (navigation.getParam("userName", "") === "admin") {
      const { params = {} } = navigation.state;
      let headerRight = (
        <TouchableOpacity
          onPress={() => {
            params.onEdit();
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <FontAwesome
            style={{ marginLeft: 5, marginRight: 5, color: "#fff" }}
            name="edit"
            size={24}
          />
        </TouchableOpacity>
      );
      return { headerRight };
    }
  };
  componentDidMount() {
    //this.setState({data: this.props.navigation.getParam("data",[])})
    this._loadData();
    this.props.navigation.setParams({
      onEdit: this._onEdit.bind(this)
    });
  }

  renderers = {
    span: (htmlAttribs, children) => (
      <Text style={myStyle.title}>
        {children}
      </Text>
    )
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == false && (
          <View style={myStyle.loadingContainer}>
            <ActivityIndicator size="large" color="#088A4B" />
            <Text style={{ color: "#088A4B" }}>Đang tải</Text>
          </View>
        )}
        {this.state.loaded && (
          <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ImageBackground
              source={{
                uri: this.props.navigation.getParam("featured_media", "")
              }}
              style={myStyle.imageCover}
            >
              <View style={myStyle.header}>
                {/* <Text style={myStyle.title}>
                  {this.state.noidung.title.rendered}
                </Text> */}
                <HTML
                  html={`<span style="fontSize:20">${this.state.noidung.title.rendered}</span>`}
                  //tagsStyles={htmlStyle}
                  renderers={this.renderers}
                />
                <Text style={myStyle.textCapNhat}>
                  Cập nhật: {this._getDate()}
                </Text>
              </View>
            </ImageBackground>

            <View style={myStyle.container}>
              <HTML
                html={this.state.noidung.content.rendered.replace(
                  "http://localhost",
                  API.getURL()
                )}
                imagesMaxWidth={Dimensions.get("window").width - 10}
                tagsStyles={htmlContentStyle}
              />
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  _getDate = () => {
    let date = new Date(this.state.noidung.date_gmt);
    let localDate = new Date();
    let msPerSecond = 1000;
    let msPerMinute = 60 * 1000;
    let msPerHour = 60 * 60 * 1000;
    let msPerDay = 24 * 60 * 60 * 1000;
    let time = localDate.getTime() - date.getTime();

    let seconds = parseInt(time / msPerSecond);
    if (seconds < 60) return `${seconds} giây trước`;

    let minutes = parseInt(time / msPerMinute);
    if (minutes < 60) return `${minutes} phút trước`;

    let hours = parseInt(time / msPerHour);
    if (hours < 24) return `${hours} giờ trước`;

    let days = parseInt(time / msPerDay);
    if (days < 30) return `${days} ngày trước`;
  };

  _onEdit() {
    this.props.navigation.navigate("EditPage", {
      id: this.props.navigation.getParam("id", "")
    });
  }
  _loadData() {
    API.Page.GetPageDetail(this.props.navigation.getParam("id", "")).then(
      responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ noidung: responseJson, loaded: true });
        }
      }
    );
  }
}
const htmlContentStyle = {
  span: {
    padding: 5,
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  },
  p: {
    fontSize: 16,
    fontWeight: "100",
    margin: 5,
    color: "#000"
  }
  // img: {
  //   // width: 800,
  //   // height: 400
  //   // borderColor: "black",
  //   // borderWidth: 1
  // }
};
const height_cmt = 49;
const pw = Dimensions.get("window").width;
//const ph = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get("window").height);
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff"
  },
  textCapNhat: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 10
  },
  imageCover: {
    flex: 1,
    height: 150
  },
  header: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "flex-end",
    backgroundColor: "#00000099"
  }
});
export default PageDetail;
