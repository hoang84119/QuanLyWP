import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert,
  ImageBackground
} from "react-native";
import HTML from "react-native-render-html";
import Feather from "react-native-vector-icons/Feather";
const featured_media_default =
  "https://www.elegantthemes.com/blog/wp-content/uploads/2013/09/background-thumb1.jpg";
class ItemPost extends Component {
  constructor(props) {
    super(props);
    this.state = { featured_media: featured_media_default, loaded: false };
  }

  componentDidMount() {
    this._getFeaturedMedia();
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({ loaded: false }, () => {
    //   this._getFeaturedMedia();
    // });
    if (nextProps.data != this.props.data) {
      this.setState({ loaded: false }, () => {
        this._getFeaturedMedia();
      });
    }
  }
  renderers = {
    p: (htmlAttribs, children) => (
      <Text key={this.props.data.id} style={myStyle.noidung}>
        {children}
      </Text>
    )
  };

  render() {
    return (
      <ImageBackground
        source={{ uri: this.state.featured_media }}
        style={myStyle.cardItem}
      >
        <TouchableOpacity
          onPress={this._xem}
          style={{ flex: 1, backgroundColor: "#00000060" }}
        >
          <View style={myStyle.btnNoiDung}>
            <View style={myStyle.title}>
              <HTML
                html={"<span>" + this.props.data.title.rendered + "</span>"}
                tagsStyles={htmlStyle}
              />
            </View>
            {this.props.data.excerpt.rendered != "" && (
              <View style={myStyle.excerpt}>
                <HTML
                  html={this.formatExcerpt(this.props.data.excerpt.rendered)}
                  //tagsStyles={htmlStyle}
                  renderers={this.renderers}
                />
              </View>
            )}
          </View>
          <View style={myStyle.footer}>
            <View style={myStyle.date}>
              <Feather style={myStyle.iconClock} name="clock" size={16} />
              <Text style={myStyle.dateContent}>{this._getDate()}</Text>
            </View>

            {this.props.userName === "admin" && (
              <View style={myStyle.buttons}>
                <TouchableOpacity onPress={this._chinhsua}>
                  <Feather
                    style={[myStyle.icon, { marginLeft: 10 }]}
                    name="edit"
                    size={15}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._xoa}>
                  <Feather
                    style={[myStyle.icon, { marginRight: 10 }]}
                    name="trash"
                    size={15}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  _xem = () => {
    this.props.navigation.navigate("chitiet", {
      id: this.props.data.id,
      userName: this.props.userName,
      featured_media: this.state.featured_media
    });
  };
  _xoa = () => {
    this.props.delete(this.props.data.id, this.props.data.title.rendered);
  };
  _chinhsua = () => {
    this.props.navigation.navigate("chinhsua", { id: this.props.data.id });
  };
  async _getFeaturedMedia() {
    if (this.props.data.featured_media != 0) {
      let idImage = this.props.data.featured_media;
      let response = await fetch(
        `${API.getURL()}/wp-json/wp/v2/media/${idImage}`
      );
      if (response.status === 200) {
        let json = await response.json();
        // let src = json.media_details.sizes.medium.source_url;
        let src = API.checkDomain(json.media_details.sizes.medium.source_url);
        this.setState({
          // featured_media: src.replace(/http:\/\/localhost\/thuctap/g, API.getURL()),
          featured_media: src,
          loaded: true
        });
      } else {
        this.setState({
          featured_media: featured_media_default,
          loaded: true
        });
      }
    } else {
      let content = this.props.data.content.rendered;
      //tìm thẻ img đầu tiên
      let indexImg = content.toString().indexOf("<img");
      //không tìm thấy trả về đường dẫn mặc định
      var src = featured_media_default;
      if (indexImg != -1) {
        // tìm vị trí mở src
        let indexSrcStart = content.toString().indexOf("src", indexImg) + 5;
        //tìm vị trí đóng src
        let indexSrcEnd = content.toString().indexOf('"', indexSrcStart);
        //lấy đường dẫn
        src = content
          .substring(indexSrcStart, indexSrcEnd)
          .replace(/http:\/\/localhost\/thuctap/g, API.getURL());
        let response = await fetch(src);
        if (response.status != 200) src = featured_media_default;
      }
      this.setState({ featured_media: src, loaded: true });
    }
  }

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
    else {
      let month = parseInt(days / 30);
      return `${month} tháng trước`;
    }
  };

  formatExcerpt(content) {
    //Mỗi trích đoạn chỉ lấy tối đa 100 ký tự
    return content.length > 120
      ? content.substring(0, 120) + "...</p>"
      : content;
  }
}

// const renderers = {
//   p: (htmlAttribs, children) => <Text key={this.props.data.id} style={myStyle.noidung}>{children}</Text>
// };

const htmlStyle = {
  span: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF"
  },
  p: {
    fontSize: 14,
    color: "#9F9F9F"
  }
};
const myStyle = StyleSheet.create({
  cardItem: {
    flexDirection: "column",
    marginHorizontal: 10,
    marginVertical: 7,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden", //không cho item tràn ra ngoài
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 4,
    height: 180
  },
  btnNoiDung: { paddingLeft: 0, flex: 1 },
  hinh: {
    flex: 1,
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  title: {
    //color: "#fff",
    //flex: 1,
    //backgroundColor: "rgba(100,100,100,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  noidung: {
    padding: 10,
    paddingBottom: 0,
    fontSize: 14,
    color: "#fff"
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
    //backgroundColor:"#f3f3f3"
  },
  date: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dateContent: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center"
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  iconClock: { marginRight: 5, color: "#fff" },
  icon: { margin: 7, color: "#fff" },
  excerpt: {
    flex: 1,
    justifyContent: "flex-end"
  }
});

export default ItemPost;
