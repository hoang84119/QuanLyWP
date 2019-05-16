import React, { Component } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import PostDetail from "../PostDetail";
import HTML from "react-native-render-html";
import API from "../../../config/API";

class ItemCommentChild extends Component {
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
        <View style={{ flexDirection: "row", marginLeft: 50, margin: 2 }}>
          {/* Avatar */}

          <View style={myStyle.khungAvatar}>
            <Image
              style={myStyle.avatar}
              source={{ uri: this.props.data.author_avatar_urls[48] }}
            />
          </View>
          <View
            style={{
              marginLeft: 5,
              borderWidth: 1,
              borderColor: "#fbfbfb",
              flex: 1,
              borderRadius: 5,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#f6f6f6"
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

            <View style={{ paddingHorizontal: 5, flex: 1, paddingBottom: 5 }}>
              {this.props.loaded && (
                <HTML
                  html={this.props.data.content.rendered}
                  tagsStyles={htmlTitleStyle}
                />
              )}
            </View>

            {/* Tùy chọn comment */}
            {this.props.dataUser.name === "admin" && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: "#f9f9f9",
                  flexDirection: "row",
                  alignContent: "center",
                  flex: 1
                }}
              >
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
                <TouchableOpacity
                  onPress={() =>
                    this.props.deleteCommentsChild(this.props.data.id)
                  }
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
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const htmlTitleStyle = {
  span: {
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: "bold",
    color: "white"
  },
  p: { fontSize: 14 }
};

const myStyle = StyleSheet.create({
  khungAvatar: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
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
    width: 32,
    height: 32,
    resizeMode: "cover"
  }
});

export default ItemCommentChild;
