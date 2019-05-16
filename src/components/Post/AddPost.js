import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Text,
  ActivityIndicator,
  Modal
} from "react-native";
import {
  RichTextEditor,
  RichTextToolbar
} from "react-native-zss-rich-text-editor";
import Feather from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";
import ModalB from "react-native-modalbox";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../../config/API";

class AddPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      isTitle: true
    };
    // this.getHTML = this.getHTML.bind(this);
    // this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = navigation.state.params.title;
    const { params = {} } = navigation.state;
    let headerRight = (
      <TouchableOpacity
        onPress={() => params.onAdd()}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Feather style={myStyle.icon} name="save" size={24} />
      </TouchableOpacity>
    );
    return { headerRight };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      isAdding: false
    });
    this.props.navigation.addListener("willFocus", () => {
      let srcImage = this.props.navigation.getParam("srcImage", "");
      if (srcImage != "") {
        this.refs.myModal.close();
        this.richtext.insertImage({ src: srcImage });
        this.props.navigation.setParams({ srcImage: "" });
      }
      let images = this.props.navigation.getParam("Images", []);
      if (images.length != 0) {
        this.refs.myModal.close();
        images.forEach(src => {
          this.richtext.insertImage({ src: src });
        });
        this.props.navigation.setParams({ Images: [] });
      }
    });
  }

  render() {
    return (
      <View style={myStyle.container}>
        {this.state.uploading && (
          <Modal
            transparent={true}
            animationType={"none"}
            visible={this.state.uploading}
            onRequestClose={() => null}
          >
            <View style={myStyle.modalBackground}>
              <View style={myStyle.activityIndicatorWrapper}>
                <ActivityIndicator
                  color={"#0ABFBC"}
                  size={30}
                  animating={this.state.uploading}
                />
                <Text size={16}>Đang xử lý</Text>
              </View>
            </View>
          </Modal>
        )}
        <ModalB ref={"myModal"} style={myStyle.modal} position="bottom">
          <View>
            <TouchableOpacity onPress={this._openCamera} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="camera" size={20} />
              <Text style={myStyle.textImage}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._openPicker} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="image" size={20} />
              <Text style={myStyle.textImage}>Chọn hình từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._openLibraryWP}
              style={myStyle.button}
            >
              <Ionicons
                style={myStyle.iconImage}
                name="logo-wordpress"
                size={25}
              />
              <Text style={myStyle.textImage}>
                Chọn hình từ thư viện WordPress
              </Text>
            </TouchableOpacity>
          </View>
        </ModalB>
        <RichTextEditor
          ref={r => (this.richtext = r)}
          style={myStyle.richText}
          titlePlaceholder={"Tiêu đề bài viết"}
          contentPlaceholder={"Nội dung bài viết"}
          editorInitializedCallback={() => {
            this.richtext.setTitleFocusHandler(() => {
              this.setState({ isTitle: true });
            });
            this.richtext.setContentFocusHandler(() => {
              this.setState({ isTitle: false });
            });
          }}
        />
        <RichTextToolbar
          onPressAddImage={() => {
            if (this.state.isTitle)
              ToastAndroid.show(
                "Không được chèn hình ở tiêu đề",
                ToastAndroid.SHORT
              );
            else this.refs.myModal.open();
          }}
          getEditor={() => this.richtext}
        />
      </View>
    );
  }

  // async getHTML() {
  //   const titleHtml = await this.richtext.getTitleHtml();
  //   const contentHtml = await this.richtext.getContentHtml();
  //   alert(titleHtml + " " + contentHtml);
  // }

  async _onAdd() {
    if (this.props.navigation.state.params.isAdding == true) return;
    this.props.navigation.setParams({ isAdding: true });
    let title = await this.richtext.getTitleHtml();
    let content = await this.richtext.getContentHtml();
    API.Post.Save("", title, content).then(response => {
      if (response) {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        this.props.navigation.navigate("main");
      } else {
        ToastAndroid.show(response.message, ToastAndroid.LONG);
        this.props.navigation.setParams({ isSaving: false });
      }
    });
  }

  _openCamera = async () => {
    let image = await ImagePicker.openCamera({
      width: 300,
      height: 400
      //cropping: true
    });
    this.refs.myModal.close();
    this.setState({ uploading: true });
    await this._uploadImage(image);
    this.setState({ uploading: false });
  };

  _openPicker = async () => {
    let images = await ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo"
    });
    this.refs.myModal.close();
    this.setState({ uploading: true });
    for (let item of images) {
      await this._uploadImage(item);
    }
    this.setState({ uploading: false });
  };

  _openLibraryWP = () => {
    this.props.navigation.navigate("scmedia", {
      src: "thembaiviet",
      check: 1
    });
  };

  _uploadImage = async item => {
    var file = {
      uri: item.path,
      name: item.path.replace(/^.*[\\\/]/, ""),
      type: item.mime
    };
    await API.Image.UploadImage(file).then(pathImage => {
      if (pathImage != "") {
        pathImage = pathImage.replace(
          /http:\/\/localhost\/thuctap/g,
          API.getURL()
        );
        this.richtext.insertImage({ src: pathImage });
      }
    });
  };
}

const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 15
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
  modal: {
    flexDirection: "column",
    alignItems: "flex-start",
    height: 150
  },
  iconImage: {
    color: "#808080",
    marginRight: 10
  },
  textImage: { fontSize: 16 },
  button: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center"
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040"
  },
  activityIndicatorWrapper: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    height: 100,
    //width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  }
});

export default AddPost;
