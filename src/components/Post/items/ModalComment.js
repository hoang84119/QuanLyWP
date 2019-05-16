import React, { Component } from "react";
import {
  Alert,
  ToastAndroid,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modalbox";

var screen = Dimensions.get("window");
export default class ModalComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      content: "",
      idparent: "",
      repname: ""
    };
  }
  showModal = (x, y) => {
    this.setState({ idparent: x, repname: y });
    this.refs.myModal.open();
  };
  render() {
    let height = this.props.dataUser.length != 0 ? 230:330
    return (
      <Modal
        ref={"myModal"}
        style={{
          justifyContent: "center",
          borderRadius: 15,
          shadowRadius: 10,
          width: screen.width - 80,
          height: height
        }}
        position="center"
        backdrop={true}
        onClosed={() => {
          //this.props.parent.setState({isComment:false})
        }}
      >
        <View style={{ padding: 15 }}>
          {this.state.idparent == "0" && (
            <Text
              style={{
                marginBottom: 12,
                marginTop: 8,
                fontSize: 23,
                color: "#0ABFBC"
              }}
            >
              Bình luận
            </Text>
          )}
          {this.state.idparent != "0" && (
            <Text
              style={{
                marginBottom: 12,
                marginTop: 8,
                fontSize: 23,
                color: "#0ABFBC"
              }}
            >
              Trả lời "{this.state.repname}"
            </Text>
          )}
          {this.props.dataUser.length ===0 && (
              <View>
                <TextInput
                  placeholderTextColor="#cfcfcf"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  style={myStyle.ctmInput}
                  onChangeText={n => {
                    this.setState({ name: n });
                  }}
                  placeholder="(*)Tên của bạn"
                />
                <TextInput
                  placeholderTextColor="#cfcfcf"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  style={myStyle.ctmInput}
                  onChangeText={e => {
                    this.setState({ email: e });
                  }}
                  placeholder="(*)Email của bạn"
                />
              </View>
            )}
          <TextInput
            placeholderTextColor="#cfcfcf"
            underlineColorAndroid="rgba(0,0,0,0)"
            multiline={true}
            style={myStyle.ctmInputContent}
            onChangeText={c => {
              this.setState({ content: c });
            }}
            placeholder="(*)Nội dung bình luận"
          />
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ marginBottom: -35, color: "red", fontStyle: "italic" }}
            >
              Chú ý: (*) Bắt buộc
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              {this.state.idparent == "0" && (
                <TouchableOpacity
                  style={myStyle.ctmBottom}
                  onPress={this._comment}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {" "}
                    Bình luận{" "}
                  </Text>
                </TouchableOpacity>
              )}
              {this.state.idparent != "0" && (
                <TouchableOpacity
                  style={myStyle.ctmBottom}
                  onPress={this._repcomment}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {" "}
                    Trả lời{" "}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  _comment = () => {
    let { name, email, content } = this.state;
    if(this.props.dataUser.length != 0) {
      email = this.props.dataUser.email;
      name = this.props.dataUser.name;
    }
    this.props.upLoadComment(name, content, email);
    this.refs.myModal.close();
  };
  _repcomment = () => {
    let { idparent, name, email, content } = this.state;
    if(this.props.dataUser.length != 0) {
      email = this.props.dataUser.email;
      name = this.props.dataUser.name;
    }
    this.props.repComment(idparent, name, content, email);
    this.refs.myModal.close();
  };
}
const myStyle = StyleSheet.create({
  ctmBottom: {
    marginBottom: 10,
    marginTop: 3,
    borderRadius: 10,
    //fontSize: 20,
    padding: 10,
    backgroundColor: "#0ABFBC"
    //textAlign: "center"
  },
  ctmInputContent: {
    height: 100,
    backgroundColor: "#fafafa",
    fontSize: 18,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 5
  },
  ctmInput: {
    backgroundColor: "#fafafa",
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 5
  }
});
