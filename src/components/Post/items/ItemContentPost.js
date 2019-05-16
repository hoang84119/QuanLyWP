import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground
} from "react-native";
import HTML from "react-native-render-html";
import API from "../../../config/API";

class ItemContentPost extends Component {

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
        <ImageBackground
          source={{ uri: this.props.featured_media }}
          style={myStyle.imageCover}
        >
          <View style={myStyle.viewUser}>
            <View style={myStyle.user}>
              <Image
                style={myStyle.avatar}
                source={{ uri: this.props.tacgia.avatar_urls[96] }}
              />
              <Text style={myStyle.tenTacGia}>{this.props.tacgia.name}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={myStyle.container}>
          {/* <Text style={myStyle.title}>{this.props.noidung.title.rendered}</Text> */}
                <HTML
                  html={`<span style="fontSize:20">${this.props.noidung.title.rendered}</span>`}
                  //tagsStyles={htmlStyle}
                  renderers={this.renderers}
                />
          <Text style={myStyle.textCapNhat}>
            Cập nhật lúc: {this._getDate()}
          </Text>

          <View style={{ alignItems: "center", flex: 1, margin: 10 }}>
            <Image
              style={{ width: 150, height: 11 }}
              source={require("../../../image/line.png")}
            />
          </View>

          <HTML
            html={this.props.noidung.content.rendered.replace(
              "http://localhost/thuctap",
              API.getURL()
            )}
            imagesMaxWidth={Dimensions.get("window").width - 10}
            tagsStyles={htmlContentStyle}
          />
        </View>
      </View>
    );
  }

  _getDate() {
    let date = new Date(this.props.noidung.modified);
    let day = String(date.getDate());
    if (day.length < 2) day = "0" + day;
    let month = String(date.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    let year = String(date.getFullYear());
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
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
};
const myStyle = StyleSheet.create({
  imageCover: {
    flex: 1,
    height: 150
  },
  viewUser: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    height: 150,
    padding: 10
  },
  user: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  tenTacGia: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
    color: "#fff"
  },
  container: {
    margin: 10
  },
  content: {
    padding: 5,
    flex: 1,
    flexDirection: "column"
  },
  title: {
    fontWeight: "500",
    color: "#282828"
  },
  textCapNhat: {
    fontSize: 14,
    marginBottom: 10
  }
});

export default ItemContentPost;
