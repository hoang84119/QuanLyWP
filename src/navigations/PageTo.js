import { createStackNavigator, Header } from "react-navigation";
import Page from "../components/Page/Page";
import EditPage from "../components/Page/EditPage";
import AddPage from "../components/Page/AddPage";
import PageDetail from "../components/Page/PageDetail";
import React from "react";
import { View, StatusBar } from "react-native";
import Media from "../components/Media/Media";
import MediaDetail from "../components/Media/MediaDetail";

const PageTo = createStackNavigator(
  {
    Page: {
      screen: Page,
      navigationOptions:{
        headerTransparent: true
      }
    },
    EditPage: {
      screen: EditPage,
      navigationOptions: {
        headerTitle: "Chỉnh sửa trang"
      }
    },
    AddPage: {
      screen: AddPage,
      navigationOptions: {
        headerTitle: "Thêm trang mới"
      }
    },
    PageDetail: {
      screen: PageDetail,
      navigationOptions: {
        headerTitle: "Chi tiết trang"
      }
    },
    scmedia: {
      screen: Media,
      navigationOptions: {
        headerTitle: "Chọn hình ảnh"
        // headerStyle: {
        //   height: 50
        // }
      }
    },
    scchitiet: {
      screen: MediaDetail,
      navigationOptions: {
        headerTitle: "Chi tiết hình ảnh"
        // headerStyle: {
        //   height: 50
        // }
      }
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#0ABFBC",
        elevation: 0
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
PageTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default PageTo;
