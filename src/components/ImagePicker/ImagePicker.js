import React, { Component } from "react";
import {
  View,
  Text,
  CameraRoll,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import ItemImage from "./items/ItemImage";
import Ionicons from "react-native-vector-icons/Ionicons";

const width = (Dimensions.get("window").width - 18 ) / 3;

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      refreshing: true,
      selectedPhotos: new Set()
    };
  }
  componentDidMount() {
    this._loadImages();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 3,
          paddingTop: 10
        }}
      >
        <FlatList
          numColumns={3}
          refreshing={this.state.refreshing}
          onRefresh={this._refresh}
          data={this.state.photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
        {this.state.selectedPhotos.size != 0 && (
          <TouchableOpacity
            onPress={this._selectedPhotos}
            style={myStyle.selectButton}
          >
            <Text style={myStyle.textIcon}>
              {this.state.selectedPhotos.size}
            </Text>
            <Ionicons style={{ color: "#fff" }} name="md-send" size={30} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  _refresh = () => {
    this._loadImages();
  };

  _loadImages = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: "Photos"
    })
      .then(r => {
        this.setState({ photos: r.edges, refreshing: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  _renderItem = ({ item, index }) => (
    <ItemImage
      item={item}
      key={index}
      width={width}
      addPhoto={this._addPhoto}
      removePhoto={this._removePhoto}
    />
  );

  _addPhoto = photo => {
    //this.setState({ selectedPhotos: this.state.selectedPhotos.add(photo) });
    this.setState(state => {
      const selectedPhotos = new Set(state.selectedPhotos);
      selectedPhotos.add(photo);
      return { selectedPhotos };
    });
  };

  _removePhoto = photo => {
    //this.setState({ selectedPhotos: this.state.selectedPhotos.delete(photo) });
    this.setState(state => {
      const selectedPhotos = new Set(state.selectedPhotos);
      selectedPhotos.delete(photo);
      return { selectedPhotos };
    });
  };

  _selectedPhotos = () => {
    let src = new Set();
    this.state.selected.forEach(value=>{
      let file = {
        uri: va,
        name: response.fileName,
        fileName: response.path,
        type: response.type
      };
      API.UploadImage(file).then(pathImage => {
        if (pathImage != "") {
          pathImage = pathImage.replace(
            "http://localhost",
            API.getURL()
          );
          this.richtext.insertImage({ src: pathImage });
        }
      });
    })
    this.props.navigation.navigate("thembaiviet");
  };
}

const myStyle = StyleSheet.create({
  selectButton: {
    flexDirection: "column",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    backgroundColor: "#0ABFBC",
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
  textIcon: {
    //marginLeft: -12,
    position: "absolute",
    marginTop: -10,
    bottom: 30,
    right: 0,
    width: 20,
    height: 20,
    textAlign: "center",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 50,
    padding: 1,
    fontSize: 12
  }
});
