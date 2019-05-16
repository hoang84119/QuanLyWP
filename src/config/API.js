//export const url = "http://192.168.1.71/thuctap";
//export const url = "https://gp1700000000029.gsoft.com.vn"
var url = "";

import { AsyncStorage, ToastAndroid } from "react-native";
import Base64 from "./Base64";

Category = {
  GetAllCategory: async function(page,search) {
    let address = `${url}/wp-json/wp/v2/categories?parent=0&page=${page}`;
    if (search != "") address = `${address}&search=${search}`;
    let response = await fetch(address);
    if(response.status === 200) {
      let responseJson = await response.json();
      return responseJson;
    }
    return null;
  },
  Remove: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(
        `${url}/wp-json/wp/v2/categories/${id}?force=true`,
        {
          headers: {
            Authorization: "Basic " + base64
          },
          method: "DELETE"
        }
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description, parent) {
    var urlTemp = `${url}/wp-json/wp/v2/categories`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("parent", parent);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

Tag = {
  GetAllTag: async function(page,search) {
    let address = `${url}/wp-json/wp/v2/tags?page=${page}`;
    if (search != "") address = `${address}&search=${search}`;
    let response = await fetch(address);
    if(response.status === 200) {
      let responseJson = await response.json();
      return responseJson;
    }
    return null;
  },
  Remove: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(`${url}/wp-json/wp/v2/tags/${id}?force=true`, {
        headers: {
          Authorization: "Basic " + base64
        },
        method: "DELETE"
      });
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description) {
    var urlTemp = `${url}/wp-json/wp/v2/tags`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

Image = {
  UploadImage: async function(file) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let formData = new FormData();
      formData.append("file", file);
      let response = await fetch(url + "/wp-json/wp/v2/media/", {
        headers: {
          Authorization: "Basic " + base64,
          "Content-Type": "multipart/form-data"
        },
        body: formData,
        method: "POST"
      });
      if (response.status === 201) {
        let json = await response.json();
        //return json.guid.rendered;
        let image;
        try {
          image = json.media_details.sizes.large.source_url;
        } catch (e) {
          image = json.media_details.sizes.full.source_url;
        }
        return image;
      }
      console.log("Lỗi");
      return "";
    } catch (e) {
      console.log(e);
    }
  },
  DeleteImage: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    let response = await fetch(`${url}/wp-json/wp/v2/media/${id}?force=true`, {
      headers: {
        Authorization: "Basic " + base64 //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
      },
      method: "DELETE"
    });
    if(response.status === 200) return true;
    return false;
  },
  GetSrcImage: async function(ids){
    let srcImage =[];
    let src ="";
    for(let id of ids)
    {
      let response = await fetch(`${url}/wp-json/wp/v2/media/${id}`);
      if(response.status===200){
        let json = await response.json();
        try {
          src = json.media_details.sizes.large.source_url;
        } catch (e) {
          src = json.media_details.sizes.full.source_url;
        }
        srcImage.push(src.replace(/http:\/\/localhost\/thuctap/g, url));
      }
    }
    return srcImage;
  }
};

Page = {
  GetAllPage: async function(page,search) {
    let address = `${url}/wp-json/wp/v2/pages?page=${page}`;
    if (search != "") address = `${address}&search=${search}`;
    let response = await fetch(address);
    if(response.status === 200) {
      let responseJson = await response.json();
      return responseJson;
    }
    return null;
  },
  GetPageDetail: async function(id) {
    let response = await fetch(API.getURL() + "/wp-json/wp/v2/pages/" + id);
    if(response.status === 200) return response.json();
  },
  Delete: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(
        `${url}/wp-json/wp/v2/pages/${id}`,
        {
          headers: {
            Authorization: "Basic " + base64
          },
          method: "DELETE"
        }
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description) {
    var urlTemp = `${url}/wp-json/wp/v2/pages`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

Post = {
  GetAllPost: async function(idCategory, idTag, page,search) {
    let address = `${url}/wp-json/wp/v2/posts?page=${page}`;
    if (idCategory != "") address = `${address}&categories=${idCategory}`;
    else if (idTag != "") address = `${address}&tags=${idTag}`;
    else if (search != "") address = `${address}&search=${search}`;
    let response = await fetch(address);
    if(response.status === 200) {
      let responseJson = await response.json();
      return responseJson;
    }
    return null;
  },
  GetPostDetail: async function(id) {
    let response = await fetch(API.getURL() + "/wp-json/wp/v2/posts/" + id);
    if(response.status === 200) return response.json();
  },
  Delete: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(`${url}/wp-json/wp/v2/posts/${id}`, {
        headers: {
          Authorization: "Basic " + base64
        },
        method: "DELETE"
      });
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, title, content) {
    var urlTemp = `${url}/wp-json/wp/v2/posts`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    else formData.append("status", "publish");
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

User = {
  getUser: async function(id) {
    let response = await fetch(API.getURL() + "/wp-json/wp/v2/users/" + id);
    if (response.status === 200) return response.json();
  }
};

Account = {
  Login: async function(username, password) {
    let base64 = Base64.btoa(`${username}:${password}`);
    let response = await fetch(`${url}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: "Basic " + base64
      },
      method: "GET"
    });
    if (response.status === 200) {
      //let json = await response.json();
      await AsyncStorage.setItem("Base64", base64);
      response = await fetch(
        `${url}/api/auth/generate_auth_cookie/?username=${username}&password=${password}&insecure=cool`
      );
      let json = await response.json();
      await AsyncStorage.setItem("Cookie", json.cookie.toString());
      //return json;
      return true;
    } else {
      let json = await response.json();
      if (json.code === "incorrect_password") {
        ToastAndroid.show("Sai mật khẩu", ToastAndroid.LONG);
        //return null;
        return false;
      } else if (json.code === "invalid_username") {
        ToastAndroid.show("Tên người dùng không hợp lệ", ToastAndroid.LONG);
        //return null;
        return false;
      }
    }
  },
  validate_account: async function() {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    if (base64 == "") return null;
    let response = await fetch(`${url}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: "Basic " + base64
      },
      method: "GET"
    });
    if (response.status === 200) {
      let json = await response.json();
      try {
        var cookie = await AsyncStorage.getItem("Cookie", "");
      } catch (e) {
        console.log(e);
      }
      let responseUser = await fetch(
        `${url}/api/auth/get_currentuserinfo/?cookie=${cookie}&insecure=cool`
      );
      if (responseUser.status === 404) return null;
      let user = await responseUser.json();
      json["email"] = user.user.email;
      json["capabilities"] = user.user.capabilities;
      return json;
    } else {
      return null;
    }
  }
};

module.exports = API = {
  getURL() {
    return url;
  },
  setURL(urlTemp) {
    url = urlTemp;
  },
  checkDomain (urlCheck) {
    if(urlCheck.search(url) == -1)
    {
      console.log(url + urlCheck);
    }
    else return urlCheck;
  },
  User:User,
  Post: Post,
  Page:Page,
  Account: Account,
  Category: Category,
  Tag: Tag,
  Image: Image
};
