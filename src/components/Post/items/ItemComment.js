import React, { Component } from "react";
import {
  Alert,
  ToastAndroid,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Base64 from "../../../config/Base64";
import HTML from "react-native-render-html";
import API from "../../../config/API";
import ItemCommentChild from "./ItemCommentChild";

class ItemComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmtchild: []
    };
  }
  componentDidMount() {
    this._loadCommentsChild();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this._loadCommentsChild();
    }
  }
  _loadCommentsChild() {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/comments?post=" +
        this.props.data.post +
        "&parent=" +
        this.props.data.id
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ cmtchild: responseJson, refreshing: false });
        }
      });
  }

  _deleteCommentsChild = i => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa bình luận này không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(API.getURL() + "/wp-json/wp/v2/comments/" + i, {
              headers: {
                Authorization:
                  "Basic " + Base64.btoa("admin:fQA8 1q75 WNdq oOue 113G VYVd")//yEgN NbO6 w6k3 vSuU xBjV E8Ok //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
              },
              method: "DELETE"
            }).then(response => {
              if (response.status == 200) {
                this._loadCommentsChild();
                ToastAndroid.show(
                  "Xóa thành công !",
                  ToastAndroid.CENTER,
                  ToastAndroid.LONG
                );
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };
  repCmt = (x, y) => {
    this.props.addModal.showModal(x, y);
  };

  _getDate = () => {
    let date = new Date(this.props.data.date_gmt);
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

  render() {
    return (
      <View>
        <View style={{ flexDirection: "row", margin: 5 }}>
          {/* Avatar */}

          <View style={myStyle.khungAvatar}>
            <Image
              style={myStyle.avatar}
              source={{ uri: this.props.data.author_avatar_urls[48] }}
            />
          </View>
          <View
            style={{
              marginLeft: 3,
              borderWidth: 1,
              borderColor: "#f6f6f6",
              flex: 1,
              borderRadius: 5,
              backgroundColor: "#fefefe"
            }}
          >
            {/* Thông tin user */}

            <View style={{ flex: 1, height: 35, paddingHorizontal: 5 }}>
              <Text
                style={{ color: "#0ABFBC", fontWeight: "bold", fontSize: 14 }}
              >
                {this.props.data.author_name}
              </Text>
              <Text style={{ fontSize: 11 }}>{this._getDate()}</Text>
            </View>

            {/* Comment */}

            <View style={{ padding: 5, flex: 1 }}>
              {this.props.loaded && (
                <HTML
                  html={this.props.data.content.rendered}
                  tagsStyles={htmlTitleStyle}
                />
              )}
            </View>

            {/* Tùy chọn comment */}
            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#f9f9f9",
                flexDirection: "row",
                alignContent: "center",
                flex: 1
              }}
            >
              {/* <TouchableOpacity
                style={{
                  paddingTop: 7,
                  paddingBottom: 7,
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center"
                }}
                onPress={() => {
                  this.repCmt(this.props.data.id, this.props.data.author_name);
                }}
              >
                <Feather
                  style={{ color: "#0ABFBC" }}
                  name="corner-down-right"
                  size={13}
                >
                  Trả lời
                </Feather>
              </TouchableOpacity> */}
              {this.props.dataUser.name === "admin" && (
                <TouchableOpacity
                  onPress={() => {
                    //alert("" + this.props.data.id)
                    this.props.navigation.navigate("editbinhluan", {
                      data: this.props.data
                    });
                  }}
                  style={{
                    paddingTop: 7,
                    paddingBottom: 7,
                    flexDirection: "row",
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center"
                  }}
                >
                  <Feather style={{ color: "#0ABFBC" }} name="edit" size={13}>
                    Chỉnh sửa
                  </Feather>
                </TouchableOpacity>
              )}
              {this.props.dataUser.name === "admin" && (
                <TouchableOpacity
                  onPress={() => this.props.deleteComments(this.props.data.id)}
                  style={{
                    paddingTop: 7,
                    paddingBottom: 7,
                    flexDirection: "row",
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center"
                  }}
                >
                  <Feather
                    style={{ color: "#0ABFBC" }}
                    name="trash-2"
                    size={13}
                  >
                    Xóa
                  </Feather>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          //refreshing={this.props.refreshing}
          onRefresh={() => this._loadCommentsChild()}
          data={this.state.cmtchild}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => (
            <ItemCommentChild
              deleteCommentsChild={this._deleteCommentsChild}
              data={item}
              loaded={this.props.loaded}
              navigation={this.props.navigation}
              dataUser ={this.props.dataUser}
            />
          )}
        />
      </View>
    );
  }
}

const htmlTitleStyle = {
  span: {
    padding: 5,
    fontWeight: "bold",
    color: "white"
  },
  p: {
    fontSize: 16
  }
};

const myStyle = StyleSheet.create({
  khungAvatar: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 30,
    //backgroundColor: "#afafaf",
    overflow: "hidden",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: "cover"
  }
});

export default ItemComment;
