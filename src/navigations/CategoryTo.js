import { createStackNavigator, Header } from "react-navigation";
import Categories from "../components/Category/Categories";
import EditCategory from "../components/Category/EditCategory";
import AddCategory from "../components/Category/AddCategory";
import PostTo from "./PostTo";
import React from "react";
import { View, StatusBar } from "react-native";

const CategoryTo = createStackNavigator(
  {
    Categories: {
      screen: Categories
    },
    EditCategory: {
      screen: EditCategory,
      navigationOptions: {
        headerTitle: "Chỉnh sửa chuyên mục"
      }
    },
    AddCategory: {
      screen: AddCategory,
      navigationOptions: {
        headerTitle: "Thêm chuyên mục"
      }
    },
    Posts: {
      screen: PostTo,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#0ABFBC",
        elevation: 0,
      },
      headerTintColor: "white",
      header: props => (
        <View style={{ backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight }} />
          <Header {...props} />
        </View>
      )
    }
  }
);

//cài đặt để ẩn thanh tab khi vào màn hình con
CategoryTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default CategoryTo;
