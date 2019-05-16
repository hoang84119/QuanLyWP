// Hiển thị hình ảnh trong media
import React, { Component } from "react";
import { View, Text, Image, TouchableWithoutFeedback, Dimensions } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

class ItemImage extends Component {
  _onLongPress = () => {
    this.props.onLongPressItem(this.props.id);
  };
  _onPress = () => {
    if (this.props.hasSelected) this.props.onLongPressItem(this.props.id);
    else {
      let src = this.props.navigation.getParam("src", "rong");
      let check = this.props.navigation.getParam("check", 0)
      this.props.navigation.navigate("scchitiet", { id: this.props.id, src: src, check:check });
    }
  };
  render() {

    return (
      <View style={{
        overflow: "hidden",
        borderRadius: 5,
        shadowColor: "#0f0f0f",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        margin: 4,
        flex: 1
      }}>
        <TouchableWithoutFeedback
          onLongPress={this._onLongPress}
          onPress={this._onPress}
        >
          <View>
            <Image
              source={{
                uri: this.props.guid
              }}
              style={{
              height: Dimensions.get("window").width/3 - 8, resizeMode: "cover" }}
            />
            {this.props.selected && (
              <View
                style={{
                  height: 200,
                  marginTop: -200,
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <IonIcon
                  style={{ marginTop: 55, color: "#36BC63" }}
                  name="md-checkmark-circle-outline"
                  size={30}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default ItemImage;
