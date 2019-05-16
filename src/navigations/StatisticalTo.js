import { createStackNavigator, Header } from "react-navigation";
import React from "react";
import { View, StatusBar } from "react-native";
import Statistical from "../components/Statistical";
import PostDetail from "../components/Post/PostDetail";
import EditPost from "../components/Post/EditPost";
import Media from "../components/Media/Media";
import MediaDetail from "../components/Media/MediaDetail";

const StatisticalTo = createStackNavigator(
  {
    main: {
      screen: Statistical,
      navigationOptions: {
        header: null
      }
    },
    chitiet: {
      screen: PostDetail,
      navigationOptions: {
        headerTitle: "Chi tiết bài viết",
      }
    },
    chinhsua: {
      screen: EditPost,
      navigationOptions: {
        headerTitle: "Chỉnh sửa",
      }
    },
    scmedia: {
      screen: Media,
      navigationOptions: {
        headerTitle: "Chọn hình ảnh",
        // headerStyle: {
        //   height: 50
        // }
      }
    },
    scchitiet: {
      screen: MediaDetail,
      navigationOptions: {
        headerTitle: "Chi tiết hình ảnh",
        // headerStyle: {
        //   height: 50
        // }
      }
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0ABFBC',
        elevation:0,
      },
      headerTintColor:"white",
      header: props => (
        <View style={{backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight}} />
          <Header {...props}/>
        </View>
      ),
      
    }
  }
);

//cài đặt để ẩn thanh tab khi vào màn hình con
StatisticalTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default StatisticalTo;