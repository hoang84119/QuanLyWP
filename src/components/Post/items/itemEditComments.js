import React, { Component } from "react";
import { Alert, ToastAndroid, StyleSheet, View, Text, Image, Dimensions, TextInput, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Base64 from '../../../config/Base64';
import HTML from "react-native-render-html";

export default class itemEditComments extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  noidung: ""
            }
      }
      static navigationOptions = ({ navigation }) => {
            //let headerTitle = navigation.state.params.title;
            const { params = {} } = navigation.state;
            let headerRight = (
                  <TouchableOpacity
                        onPress={() => {
                              params.onSave();
                        }}
                        style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                        }}
                  >
                        <Feather style={myStyle.icon} name="save" size={28} />
                  </TouchableOpacity>
            );
            return { headerRight };
      };
      async _onSave() {
            var formData = new FormData();
            formData.append("content", this.state.noidung);
            fetch(
                  API.getURL() +
                  "/wp-json/wp/v2/comments/" +
                  this.data.id,
                  {
                        headers: {
                              Authorization:
                                    "Basic " + Base64.btoa("admin:fQA8 1q75 WNdq oOue 113G VYVd")//MK135: yEgN NbO6 w6k3 vSuU xBjV E8Ok
                        },
                        body: formData,
                        method: "POST"
                  }
            ).then(response => {
                  var t = response.status;
                  if (response.status == "200") {
                        this.props.navigation.navigate("chitiet");
                        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
                  } else Alert.alert("Lỗi", "Thất bại");
            });
      }
      data = this.props.navigation.getParam("data", "");
      componentDidMount() {
            this.props.navigation.setParams({
                  onSave: this._onSave.bind(this)
                });
                var cmt = (<HTML html={this.data.content.rendered}/>).toString()
            this.setState({ noidung:  ((this.data.content.rendered.replace("<p>","")).replace("</p>","")) })
      }
      render() {
            return (
                  <View style={myStyle.bg}>
                        <TextInput
                              multiline={true}
                              underlineColorAndroid="rgba(0,0,0,0)"
                              style={myStyle.ctmInput}
                              onChangeText={u => {
                                    this.setState({ noidung: u });
                              }}
                              placeholder="Chỉnh sửa bình luận"
                              value={this.state.noidung}
                        />
                  </View>
            );
      }
}
const myStyle = StyleSheet.create({
      ctmInput: {
            backgroundColor: "rgba(255,255,255,0)",
            fontSize: 18,
            margin: 5,
            borderRadius: 5,
            paddingVertical: 0,
            color: "#5f5f5f",
            borderWidth: 1,
            borderColor: "#f0f0f0",
            height: 150,
            textAlignVertical: "top"
      },
      bg: {
            backgroundColor: "#fff",
            justifyContent: "flex-start",
            flex: 1,
      },
      icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
});