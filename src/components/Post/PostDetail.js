import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Dimensions
} from "react-native";
import API from "../../config/API";
import Base64 from "../../config/Base64";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ItemComment from "./items/ItemComment";
import ItemContentPost from "./items/ItemContentPost";
import ModalComment from "./items/ModalComment";
import { connect } from "react-redux";

class PostDetail extends Component {
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
    this._onOpenModal = this._onOpenModal.bind(this);
    //const { navigation } = this.props;
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
    this.props.navigation.addListener("didFocus", () => {
      this._loadComments();
    });
    this._loadData();
    this.props.navigation.setParams({
      onEdit: this._onEdit.bind(this)
    });
  }
  //Cập nhật lại comments
  refresh() {
    this._loadComments();
  }

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
          <View style={{ flex: 1 }}>
            <ScrollView style={myStyle.container}>
              <ItemContentPost
                noidung={this.state.noidung}
                tacgia={this.state.tacgia}
                loaded={this.state.loaded}
                featured_media={this.props.navigation.getParam(
                  "featured_media",
                  ""
                )}
              />
              {/* Bình luận bài viết */}
              <View style={{ padding: 5 }}>
                <Text
                  style={{
                    margin: 5,
                    paddingLeft: 5,
                    marginBottom: 10,
                    fontSize: 20,
                    color: "#0ABFBC",
                    borderBottomWidth: 3,
                    borderBottomColor: "#0ABFBC"
                  }}
                >
                  Bình luận
                </Text>
                <FlatList
                  refreshing={this.state.refreshing}
                  //refreshing={this.props.refreshing}
                  onRefresh={() => this._loadComments()}
                  data={this.state.binhluan}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item }) => (
                    <ItemComment
                      addModal={this.refs.addModal}
                      loadComments={this._loadComments}
                      navigation={this.props.navigation}
                      data={item}
                      deleteComments={this._deleteComments}
                      loaded={this.state.loaded}
                      dataUser={this.props.dataUser}
                    />
                  )}
                />
              </View>
            </ScrollView>
            <ModalComment
              ref={"addModal"}
              style={{ zIndex: 1 }}
              //noidung={this.state.noidung}
              //parent={this}
              dataUser={this.props.dataUser}
              repComment={this._repComment}
              upLoadComment={this._upLoadComment}
            />
            {!this.state.isComment && (
              <TouchableOpacity
                style={myStyle.canLe}
                onPress={() => this._onOpenModal()}
              >
                <Feather
                  style={{ color: "#fff" }}
                  name="message-circle"
                  size={28}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }

  // Hàm xóa comments

  _deleteComments = i => {
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
                  "Basic " + Base64.btoa("admin:fQA8 1q75 WNdq oOue 113G VYVd") //yEgN NbO6 w6k3 vSuU xBjV E8Ok//MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
              },
              method: "DELETE"
            }).then(response => {
              if (response.status == 200) {
                this.refresh();
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

  _onOpenModal() {
    this.refs.addModal.showModal(0, 0);
    //this.setState({isComment:true});
  }

  _onEdit() {
    this.props.navigation.navigate("chinhsua", {
      id: this.props.navigation.getParam("id", "")
    });
  }
  _loadData() {
    API.Post.GetPostDetail(this.props.navigation.getParam("id", "")).then(
      responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ noidung: responseJson });
          this._loadAuthor();
        }
      }
    );
  }
  _loadAuthor() {
    API.User.getUser(this.state.noidung.author).then(responseJson => {
      if (responseJson.length == 0) {
        Alert.alert("Lỗi", "Không có nội dung");
      } else {
        this.setState({ tacgia: responseJson, loaded: true });
      }
    });
  }

  _loadComments() {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/comments?post=" +
        this.props.navigation.getParam("id", "") +
        "&parent=0"
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ binhluan: responseJson, refreshing: false });
        }
      });
  }

  _upLoadComment = (name, content, email) => {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/comments?post=" +
        this.state.noidung.id +
        "&author_name=" +
        name +
        "&content=" +
        content +
        "&author_email=" +
        email,
      {
        headers: {
          Authorization:
            "Basic " + Base64.btoa("admin:fQA8 1q75 WNdq oOue 113G VYVd")//yEgN NbO6 w6k3 vSuU xBjV E8Ok
        },
        method: "POST"
      }
    )
      .then(response => {
        var t = response.status;
        if (response.status == 201) {
          this._loadComments();
          ToastAndroid.show(
            "Bình luận đang được xét duyệt!",
            ToastAndroid.CENTER,
            ToastAndroid.LONG
          );
        }
      })
      .then(function(object) {
        Alert.alert("Cảnh báo", object.message);
      });
  };
  _repComment = (idparent, name, content, email) => {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/comments?post=" +
        this.state.noidung.id +
        "&parent=" +
        idparent +
        "&author_name=" +
        name +
        "&content=" +
        content +
        "&author_email=" +
        email,
      {
        headers: {
          Authorization:
            "Basic " + Base64.btoa("admin:fQA8 1q75 WNdq oOue 113G VYVd")//yEgN NbO6 w6k3 vSuU xBjV E8OkyEgN NbO6 w6k3 vSuU xBjV E8Ok
        },
        method: "POST"
      }
    )
      .then(response => {
        var t = response.status;
        if (response.status == 201) {
          this._loadComments();
          ToastAndroid.show(
            "Bình luận đang được xét duyệt!",
            ToastAndroid.CENTER,
            ToastAndroid.LONG
          );
        }
      })
      .then(function(object) {
        Alert.alert("Cảnh báo", object.message);
      });
  };
}
const height_cmt = 49;
const pw = Dimensions.get("window").width;
//const ph = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get("window").height);
const myStyle = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff"
  },
  header: {
    padding: 5
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  ctmInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    fontSize: 18,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  canLe: {
    flexDirection: "row",
    position: "absolute",
    width: 45,
    height: 45,
    bottom: 0,
    right: 0,
    backgroundColor: "#0ABFBC",
    zIndex: 0,
    margin: 10,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  }
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(PostDetail);
//export default PostDetail;
