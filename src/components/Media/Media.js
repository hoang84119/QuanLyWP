import React, { Component } from "react";
import {
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Text,
  Modal,
  Animated
} from "react-native";
import API from "../../config/API";
import ItemImage from "./items/ItemImage";
import IonIcon from "react-native-vector-icons/Ionicons";
import Base64 from "../../config/Base64";
import Feather from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";
import ModalBox from "react-native-modalbox";

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      refreshing: true,
      loading: false,
      selected: new Set(),
      page: 1,
      over: false,
      uploading: false,
      isDelete: false,
      marginAnim: new Animated.Value(-5)
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this._refresh();
      this.state.selected.clear();
    });
    const anim = Animated.timing(
      this.state.marginAnim,{
        toValue: 0,
        duration: 800
      }
    )
    const anim2 = Animated.timing(
      this.state.marginAnim,{
        toValue: -5,
        duration: 800
      }
    )
    const animfinal = Animated.sequence([anim, anim2])
    Animated.loop(animfinal).start();
  }

  render() {
    const marginBottom = this.state.marginAnim
    let headerBar = (
      <View style={myStyle.headerTitleBar}>
        <View style={myStyle.headerTitle}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          >
            <Feather
              style={[myStyle.icon, { marginLeft: 15 }]}
              name="menu"
              size={25}
            />
          </TouchableOpacity>
          <Text style={myStyle.title}>Thư viện hình ảnh</Text>
        </View>
        {this.state.selected.size != 0 && (
          <TouchableOpacity
            style={myStyle.buttons}
            onPress={() => {
              this.state.selected.clear();
              console.log(this.state.selected);
              this.setState({
                selected: this.state.selected
              });
            }}
          >
            <Feather style={myStyle.icon} name="x-circle" size={25} />
            <Text style={{ fontSize: 16, color: "#fff" }}>Bỏ chọn</Text>
          </TouchableOpacity>
        )}
      </View>
    );
    let buttonUpload = null;
    if (this.state.selected.size == 0)
      if (this.props.navigation.getParam("check", 0) != 1)
        buttonUpload = (
            <TouchableOpacity
              onPress={() => {
                this.refs.myModal.open();
              }}
              style={[myStyle.select, { backgroundColor: "#0ABFBC" }]}
            >
              
                <IonIcon
                  style={{ color: "white" }}
                  name="ios-cloud-upload-outline"
                  size={32}
                />
            </TouchableOpacity>
        );
    let buttonInsertDelete = null;
    if (this.state.selected.size != 0)
      if (this.props.navigation.getParam("check", 0) != 1)
        buttonInsertDelete = (
          <TouchableOpacity
            onPress={this._before_Delete}
            style={[myStyle.select, { backgroundColor: "#FF3333" }]}
          >
            <IonIcon
              style={{ color: "white", marginLeft: 6 }}
              name="md-trash"
              size={32}
            />
            <Text style={myStyle.textDotButton}>
              {this.state.selected.size}
            </Text>
          </TouchableOpacity>
        );
      else
        buttonInsertDelete = (
          <TouchableOpacity
            onPress={this._insertImage}
            style={[myStyle.select, { backgroundColor: "#0ABFBC" }]}
          >
            <IonIcon
              style={{ color: "white", marginLeft: 6 }}
              name="md-send"
              size={32}
            />
            <Text style={myStyle.textDotButton}>
              {this.state.selected.size}
            </Text>
          </TouchableOpacity>
        );
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
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
              <Text size={16}>Đang tải lên</Text>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.isDelete}
          onRequestClose={() => null}
        >
          <View style={myStyle.modalBackground}>
            <View style={myStyle.activityIndicatorWrapper}>
              <ActivityIndicator
                color={"#0ABFBC"}
                size={30}
                animating={this.state.isDelete}
              />
              <Text size={16}>Đang xóa</Text>
            </View>
          </View>
        </Modal>
        <ModalBox ref={"myModal"} style={myStyle.modal} position="bottom">
          <View>
            <TouchableOpacity onPress={this._openCamera} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="camera" size={20} />
              <Text style={myStyle.textImage}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._openPicker} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="image" size={20} />
              <Text style={myStyle.textImage}>Chọn hình từ thư viện</Text>
            </TouchableOpacity>
          </View>
        </ModalBox>

        {this.props.navigation.getParam("check", 0) != 1 && (
          <View style={{ backgroundColor: "#0ABFBC" }}>
            <StatusBar
              translucent
              backgroundColor="rgba(0, 0, 0, 0)"
              animated
            />
            <View style={{ height: StatusBar.currentHeight }} />
            {/* Thanh bar */}
            {headerBar}
          </View>
        )}
        <View
          style={{ paddingHorizontal: 2, flexDirection: "column", flex: 1 }}
        >
          <FlatList
            numColumns={3}
            refreshing={this.state.refreshing}
            onRefresh={() => this._refresh()}
            data={this.state.noidung}
            ListEmptyComponent={this._renderEmpty}
            keyExtractor={(x, i) => x.id}
            extraData={this.state.selected}
            renderItem={this._renderItem}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              this._loadMore();
            }}
            ListFooterComponent={this._renderFooter}
          />
        </View>
        {buttonInsertDelete}
        <Animated.View style={{ marginBottom}}>
        {buttonUpload}
        </Animated.View>
      </View>
    );
  }

  _refresh() {
    this.setState({ refreshing: true }, () => {
      this.loadData();
    });
    //console.log(this.state);
    //this.loadData();
  }

  _loadMore() {
    if (!this.state.over)
      if (!this.state.loading)
        this.setState({ page: this.state.page + 1, loading: true }, () => {
          this.loadData();
        });
    //this.loadData();
  }

  async loadData() {
    if (this.state.refreshing) {
      let dataTemp = [];
      for (let i = 1; i <= this.state.page; i++) {
        let response = await fetch(
          `${API.getURL()}/wp-json/wp/v2/media?page=${i}`
        );
        if (response.status === 200) {
          let responseJson = await response.json();
          if (responseJson.length != 0) {
            dataTemp = dataTemp.concat(responseJson);
          }
        }
      }
      this.setState({
        noidung: dataTemp,
        refreshing: false,
        loading: false,
        over: false
      });
    } else {
      let response = await fetch(
        `${API.getURL()}/wp-json/wp/v2/media?page=${this.state.page}`
      );
      if (response.status === 200) {
        let responseJson = await response.json();
        this.setState({
          noidung: [...this.state.noidung, ...responseJson],
          refreshing: false,
          loading: false,
          over: false
        });
      } else if (response.status === 400) {
        this.setState({
          refreshing: false,
          loading: false,
          over: true,
          page: this.state.page - 1
        });
      } else {
        Alert.alert("Lỗi", "Không có nội dung");
        this.setState({ refreshing: false, loading: false });
      }
    }
  }

  _renderEmpty = () => {
    if (this.state.refreshing) return null;
    return (
      <View style={myStyle.empty}>
        <Feather name="alert-circle" size={60} />
        <Text style={{ margin: 10, fontSize: 16 }}>Không có nội dung</Text>
      </View>
    );
  };

  _renderFooter = () => {
    if (this.state.loading)
      return (
        <View style={{ paddingVertical: 10 }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    else if (this.state.over)
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingVertical: 10,
            alignItems: "center"
          }}
        >
          <Feather name="alert-circle" size={14} />
          <Text style={myStyle.textOver}> Hết nội dung</Text>
        </View>
      );
    else return null;
  };

  //xử lý khi nhấn lâu vào một item
  _onLongPressItem = id => {
    this.setState(state => {
      const selected = new Set(state.selected);
      this.state.selected.has(id) ? selected.delete(id) : selected.add(id);
      //selected.set(id, !selected.get(id));
      return { selected };
    });
  };

  _renderItem = ({ item }) => (
    <ItemImage
      id={item.id}
      guid={item.media_details.sizes.medium.source_url.replace(
        "http://localhost/thuctap",
        API.getURL()
      )}
      //guid={API.checkDomain(item.media_details.sizes.medium.source_url)}
      title={item.title.rendered}
      onLongPressItem={this._onLongPressItem}
      selected={this.state.selected.has(item.id)}
      hasSelected={this.state.selected.size === 0 ? false : true}
      navigation={this.props.navigation}
    />
  );

  _insertImage = () => {
    API.Image.GetSrcImage(this.state.selected).then(response => {
      this.props.navigation.navigate(
        `${this.props.navigation.getParam("src")}`,
        {
          Images: response
        }
      );
    });
  };

  _delete = async () => {
    this.setState({ isDelete: true });
    for (let item of this.state.selected) {
      await API.Image.DeleteImage(item);
    }
    this.state.selected.clear();
    this.setState({ isDelete: false });
    ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
    this._refresh();
  };

  _before_Delete = () => {
    Alert.alert(
      "Thông báo",
      "Bạn sẽ xóa vĩnh viễn những hình này trong trang web của bạn",
      [
        {
          text: "Xóa",
          onPress: this._delete
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  };

  _openCamera = async () => {
    try {
      let image = await ImagePicker.openCamera({
        width: 300,
        height: 400
      });
      console.log(image);
      this.refs.myModal.close();
      this.setState({ uploading: true });
      await this._uploadImage(image);
      console.log("Xong");
      this.setState({ uploading: false });
      this._refresh();
      ToastAndroid.show("Hoàn thành!", ToastAndroid.TOP, ToastAndroid.SHORT);
    } catch (error) {}
  };

  _openPicker = async () => {
    try {
      let images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: "photo"
      });
      this.setState({ uploading: true });
      this.refs.myModal.close();
      console.log("Bat dau up");
      console.log(images);
      for (let item of images) {
        await this._uploadImage(item);
      }
      console.log("Xong");
      //this.refs.myModal.close();
      this.setState({ uploading: false });
      this._refresh();
      ToastAndroid.show("Hoàn thành!", ToastAndroid.TOP, ToastAndroid.SHORT);
    } catch (error) {}
  };

  _uploadImage = async item => {
    var file = {
      uri: item.path,
      name: item.path.replace(/^.*[\\\/]/, ""),
      type: item.mime
    };
    console.log(file);
    await API.Image.UploadImage(file);
  };
}

const myStyle = StyleSheet.create({
  select: {
    flexDirection: "row",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    zIndex: 1,
    margin: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    paddingRight: 10
  },
  headerTitleBar: {
    backgroundColor: "#0ABFBC",
    flexDirection: "row",
    zIndex: 0
  },
  headerTitle: {
    //paddingLeft: 20,
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    flex: 3
  },
  title: { fontSize: 20, color: "#fff", fontWeight: "500", marginLeft: 5 },
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
  },
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
  textOver: {
    fontSize: 10
  },
  textDotButton: {
    // borderWidth: 1,
    // borderColor: "#FF3030",
    marginLeft: -12,
    marginBottom: -20,
    width: 17,
    height: 17,
    textAlign: "center",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 10,
    padding: 1,
    fontSize: 11
  },
  empty: {
    flexDirection: "column",
    //flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});
