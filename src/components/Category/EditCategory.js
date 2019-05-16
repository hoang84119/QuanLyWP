import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Picker
} from "react-native";

import Feather from "react-native-vector-icons/Feather";

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      categories: [],
      loaded: false,
      selectedIdItem: "",
      ten: "",
      duongDan: "",
      moTa: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = "Thêm chuyên mục";
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
        <Feather
          style={{ marginLeft: 5, marginRight: 10, color: "#fff" }}
          name="save"
          size={24}
        />
      </TouchableOpacity>
    );
    const { params = {} } = navigation.state;
    return { headerRight };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onSave: this._onSave.bind(this),
      isSaving: false
    });
    this._loadData();
  }

  render() {
    return (
      <ScrollView style={myStyle.container}>
        {this.state.loaded && (
          <View
            style={{
              paddingBottom: 50
            }}
          >
            <View style={myStyle.card}>
              <Text style={myStyle.title}>Tên</Text>
              <TextInput
                style={myStyle.inputText}
                placeholder="Mời bạn nhập"
                underlineColorAndroid="#0ABFBC"
                value={this.state.ten}
                onChangeText={text => this.setState({ ten: text })}
              />
              <Text style={myStyle.note}>
                Tên riêng sẽ hiển thị trên trang mạng của bạn.
              </Text>
            </View>

            <View style={myStyle.card}>
              <Text style={myStyle.title}>Chuỗi cho đường dẫn tĩnh</Text>
              <TextInput
                style={myStyle.inputText}
                placeholder="Mời bạn nhập"
                underlineColorAndroid="#0ABFBC"
                value={this.state.duongDan}
                onChangeText={text => this.setState({ duongDan: text })}
              />
              <Text style={myStyle.note}>
                Chuỗi cho đường dẫn tĩnh là phiên bản của tên hợp chuẩn với
                Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu
                gạch ngang (-).
              </Text>
            </View>

            <View style={myStyle.card}>
              <Text style={myStyle.title}>Chuyên mục hiện tại</Text>
              <Picker
                style={myStyle.picker}
                itemStyle={myStyle.itemStyle}
                selectedValue={this.state.selectedIdItem}
                onValueChange={value => {
                  this.setState({ selectedIdItem: value });
                }}
              >
                <Picker.Item label="Trống" key={0} value={0} />
                {this.state.categories.map(item => {
                  return (
                    <Picker.Item
                      label={item.name}
                      key={item.id}
                      value={item.id}
                    />
                  );
                })}
              </Picker>
              <Text style={myStyle.note}>
                Chuyên mục khác với thẻ, bạn có thể sử dụng nhiều cấp chuyên
                mục. Ví dụ: Trong chuyên mục nhạc, bạn có chuyên mục con là nhạc
                Pop, nhạc Jazz. Việc này hoàn toàn là tùy theo ý bạn.
              </Text>
            </View>

            <View style={myStyle.card}>
              <Text style={myStyle.title}>Mô tả</Text>
              <TextInput
                style={[myStyle.inputText, { height: 100 }]}
                multiline={true}
                placeholder="Mời bạn nhập"
                underlineColorAndroid="#0ABFBC"
                textAlignVertical = {"top"}
                value={this.state.moTa}
                onChangeText={text => this.setState({ moTa: text })}
              />
              <Text style={myStyle.note}>
                Thông thường mô tả này không được sử dụng trong các giao diện,
                tuy nhiên có vài giao diện có thể hiển thị mô tả này.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  _onSave() {
    if (this.props.navigation.state.params.isSaving == true) return;
    this.props.navigation.setParams({ isSaving: true });
    let { ten, duongDan, moTa, selectedIdItem } = this.state;
    let id = this.props.navigation.getParam("id", "");
    API.Category.Save(id, ten, duongDan, moTa, selectedIdItem).then(response => {
      if (response == true) {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        this.props.navigation.navigate("Categories");
      } else {
        ToastAndroid.show(response.message, ToastAndroid.LONG);
        this.props.navigation.setParams({ isSaving: false });
      }
    });
  }

  async _loadData() {
    let id = this.props.navigation.getParam("id", "");
    let response = await fetch(
      `${API.getURL()}/wp-json/wp/v2/categories/${id}`
    );
    let json = await response.json();
    if (json == null) {
      Alert.alert("Lỗi", "Không có nội dung");
    } else {
      this.setState({
        data: json,
        ten: json.name,
        duongDan: json.slug,
        moTa: json.description
      });
      let categories = await fetch(
        `${API.getURL()}/wp-json/wp/v2/categories?exclude=${id}`
      );
      let categoriesJson = await categories.json();
      if (categoriesJson != null) {
        this.setState({
          categories: categoriesJson,
          selectedIdItem: json.parent,
          loaded: true
        });
      }
    }
  }
}

const myStyle = StyleSheet.create({
  container: {
    flexDirection: "column",
    //alignItems: "center",
    //padding: 10,
    backgroundColor: "white"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0ABFBC"
  },
  inputText: {
    fontSize: 15,
    marginBottom: 5
  },
  picker: {},
  itemStyle: {},
  note: {
    fontStyle: "italic"
  },
  card: {
    //borderStyle: 'solid',
    //borderWidth: 1,
    //borderColor: "#d3d3d3",
    margin: 10,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 0,
    elevation: 4
  }
});

export default EditCategory;
