import React, { Component } from "react";
import {
  View, ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import API from '../../../config/API'

var randomImages = [
  require('../../../image/tag/img0.jpg'),
  require('../../../image/tag/img1.jpg'),
  require('../../../image/tag/img2.jpg'),
  //require('../../../image/tag/img3.jpg'),
  require('../../../image/tag/img4.jpg'),
  require('../../../image/tag/img5.jpg'),
  require('../../../image/tag/img6.jpg'),
  require('../../../image/tag/img7.jpg'),
  require('../../../image/tag/img8.jpg'),
  //require('../../../image/tag/img9.jpg'),
];

class ItemCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured_media: "",
      loaded: false,
      hasChild: false,
      dataChild: [],
      soBaiViet: 0,
    };
  }
  img = 0;
  componentDidMount() { 
    this._checkPost();
    this.img = Math.floor(Math.random() * randomImages.length)
  }

  componentWillReceiveProps(nextProps) { 
    if (nextProps != this.props) {
      this._checkPost();
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this._xem}>
        <ImageBackground source={randomImages[this.img]} style={myStyle.cardItem}>

          <View style={myStyle.btnNoiDung}>
            <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
            <Text style={myStyle.moTa}>{this._formatExcerpt(this.props.data.description)}</Text>
            {this.state.soBaiViet != 0 && (
              <Text style={myStyle.soBaiViet}>
                ({this.state.soBaiViet === 10 ? `${this.state.soBaiViet}+`:this.state.soBaiViet}) bài viết
              </Text>
            )}
            {this.state.soBaiViet == 0 && (
              <Text style={myStyle.soBaiViet}>
                (0) bài viết
              </Text>
            )}
          </View>

          {this.props.userName === "admin" && (
            <View style={myStyle.buttons}>
              <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                <Feather style={myStyle.icon} name="edit" size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                <Feather style={myStyle.icon} name="trash" size={15} />
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  _xem = () => {
    this.props.navigation.navigate("Posts", {
      idTag: this.props.data.id,
      nameTag: this.props.data.name
    });
  };

  _xoa = () => {
    this.props.delete(this.props.data.id, this.props.data.name);
  };

  _chinhsua = () => {
    this.props.navigation.navigate("EditTag", { id: this.props.data.id });
  };

  _checkPost(){
    // API.Post.GetAllPost("", this.props.data.id,1).then(response => {
    //   if (response.length != 0) this.setState({ soBaiViet: response.length });
    // });
    fetch(`${API.getURL()}/wp-json/wp/v2/posts?tags=${this.props.data.id}`).then(response=>{
      this.setState({ soBaiViet: response.headers.get("X-WP-Total") });
    })
  }
  
  _formatExcerpt(content) {
    //Mỗi trích đoạn chỉ lấy tối đa 100 ký tự
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  }
}

const myStyle = StyleSheet.create({
  cardItem: {
    overflow: "hidden",
    flexDirection: "row",
    marginVertical:6,
    marginHorizontal: 8,
    padding: 10,
    paddingVertical: 25,
    borderRadius:5,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 3
  },
  btnNoiDung: {
    flex: 5,
    paddingLeft: 20
  },
  noiDung: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 10
  },
  moTa: {
    fontStyle: "italic",
    color: "#fafafa"
  },
  soBaiViet:{
    marginTop: 5,
    color: "#fafafa"
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  icon: { marginLeft: 5, marginRight: 5, color: "#fafafa" }
});

export default ItemCategory;
