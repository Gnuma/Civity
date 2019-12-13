import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";

import store from "../store/store";

import HomeScreen from "../views/Home";
//import ItemScreen from "../views/Item_Deprecated";
import ItemScreen from "../views/ItemDetail";
import AppLoaderScreen from "../views/AppLoader";
import Auth from "../views/Auth/Auth";
import CameraScreen from "../views/Camera";
import SelectBookScreen from "../views/SelectBook";
import VendiInfosScreen from "../views/VendiInfos";
import InitProfileScreen from "../views/InitProfile";
import CreateBookScreen from "../views/CreateBook";

//import SalesListScreen from "../views/SalesList_Deprecated";
//import ChatScreen from "../views/Chat_Deprecated.js";
//import BookOffertScreen from "../views/BookOffert_Deprecated";
//import ShoppingListScreen from "../views/ShoppingList_Deprecated";

import ChatListScreen from "../views/ChatList";
import ChatDetailScreen from "../views/ChatDetail";

import SelectBooksScreen from "../views/Sell/SelectBooks";
import GeneralInfosScreen from "../views/Sell/GeneralInfos";
import SellPicturesSelectorScreen from "../views/Sell/PicturesSelector";
import PhotosListScreen from "../views/Sell/PhotosList";
import PreviewScreen from "../views/Sell/Preview";

import ImagePickerScreen from "../views/ImagePicker";
import UserSettingsScreen from "../views/UserSettings";
import UserInfoScreen from "../views/UserChanges/UserInfo";
import OfficeChangeScreen from "../views/UserChanges/OfficeChange";
import PhoneChangeScreen from "../views/UserChanges/PhoneChange";
import PreviewItemScreen from "../views/PreviewItem";
import PhoneValidationScreen from "../views/Auth/PhoneValidation";
import BetaInfosView from "../views/BetaInfosView";
import CivityProInfoScreen from "../views/CivityProInfoScreen";

import Header from "../Header/Header";
import TabBar from "../TabBar/TabBar";
import { saveNavState } from "../store/settings";
import { View } from "react-native";

const UserSettingsNavigator = createStackNavigator(
  {
    UserSettings: UserSettingsScreen,
    UserInfo: UserInfoScreen,
    OfficeChange: OfficeChangeScreen,
    PhoneChange: PhoneChangeScreen,
    BetaInfos: BetaInfosView,
    CivityProInfo: CivityProInfoScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const SearchNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    path: "/home",
    navigationOptions: () => ({
      header: <Header />
    })
  },
  Item: {
    screen: ItemScreen,
    path: "/item/:itemid",
    navigationOptions: { header: null, gesturesEnabled: false }
  },
  UserSettings: {
    screen: UserSettingsNavigator,
    path: "/usersettings",
    navigationOptions: { header: null, gesturesEnabled: false }
  }
});

SearchNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  let navigationOptions = {
    gesturesEnabled: false
  };
  if (routeName === "UserSettings") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const InitProfileNavigator = {
  screen: createStackNavigator(
    {
      IPHome: {
        screen: InitProfileScreen,
        path: "/iphome"
      }
    },
    {
      defaultNavigationOptions: {
        header: null
      }
    }
  )
};
/*
const VendiNavigator = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
      path: "/vendi/camera",
      navigationOptions: { gesturesEnabled: false }
    },
    ImagePicker: {
      screen: ImagePickerScreen,
      path: "/vendi/imagepicker"
    },
    SelectBook: {
      screen: SelectBookScreen,
      path: "/vendi/selectbook"
    },
    VendiInfos: {
      screen: VendiInfosScreen,
      path: "/vendi/vendiinfos"
    },
    CreateBook: {
      screen: CreateBookScreen,
      path: "/vendi/createbook"
    },
    PreviewItem: {
      screen: PreviewItemScreen,
      path: "/vendi/previewitem"
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
*/
/*
const ChatNavigator = createStackNavigator(
  {
    Chat: ChatScreen,
    BookOffert: BookOffertScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
*/

/*
const SalesNavigator = createStackNavigator(
  {
    SalesList: SalesListScreen,
    SaleChat: {
      screen: ChatNavigator,
      path: "/sales/:chatID"
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
*/

/*
const SalesStack = createStackNavigator(
  {
    SalesNavigator: SalesNavigator,
    Vendi: {
      screen: VendiNavigator,
      navigationOptions: { gesturesEnabled: false }
    }
  },
  {
    backBehavior: "order",
    resetOnBlur: false,
    defaultNavigationOptions: {
      header: null
    }
  }
);


SalesStack.navigationOptions = ({ navigation }) => {
  const { routeName, routes, index } = navigation.state.routes[
    navigation.state.index
  ];
  console.log(navigation.state.routes[navigation.state.index]);
  //console.log(key, navigation.state.routes[navigation.state.index]);
  let navigationOptions = {};
  if (routeName === "Vendi" || routes[index].routeName === "SaleChat") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const ShoppingNavigator = createStackNavigator(
  {
    ShoppingList: ShoppingListScreen,
    ShoppingChat: {
      screen: ChatNavigator,
      path: "/shopping/:chatID"
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

ShoppingNavigator.navigationOptions = ({
  navigation
}: {
  navigation: Object;
}) => {
  const focus = navigation.state.routes[navigation.state.index];

  let navigationOptions = {};
  if (focus.routeName === "ShoppingChat") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};
*/

const SellNavigator = createStackNavigator(
  {
    SelectBooks: { screen: SelectBooksScreen },
    SellGeneralInfos: { screen: GeneralInfosScreen },
    SellPicturesSelector: { screen: SellPicturesSelectorScreen },
    SellCamera: { screen: CameraScreen },
    SellPhotosList: { screen: PhotosListScreen },
    SellPreview: { screen: PreviewScreen }
  },
  {
    initialRouteName: "SelectBooks",
    defaultNavigationOptions: {
      gesturesEnabled: false,
      header: null
    },
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      const navigationOptions = {
        tabBarVisible: true
      };
      if (routeName === "SellCamera") navigationOptions.tabBarVisible = false;
      return navigationOptions;
    }
  }
);

const ChatNavigator = createStackNavigator(
  {
    ChatList: ChatListScreen,
    ChatDetail: ChatDetailScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    },
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      const navigationOptions = {
        tabBarVisible: true
      };
      if (routeName === "ChatDetail") navigationOptions.tabBarVisible = false;
      return navigationOptions;
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    AUTH: {
      screen: Auth,
      navigationOptions: { gesturesEnabled: false }
    },
    PhoneValidation: {
      screen: PhoneValidationScreen,
      navigationOptions: { gesturesEnabled: false }
    },
    OfficeChangeAuth: OfficeChangeScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const AppStack = createBottomTabNavigator(
  {
    SEARCH: SearchNavigator,
    CHAT: ChatNavigator
  },
  {
    initialRouteName: "SEARCH",
    tabBarComponent: TabBar
  }
);

const MainStack = createStackNavigator(
  {
    App: AppStack,
    SELL: SellNavigator,
    AuthStack: AuthNavigator
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const RootStack = createSwitchNavigator({
  AppLoader: AppLoaderScreen,
  Main: MainStack,
  InitProfile: InitProfileNavigator
});

export default createAppContainer(RootStack);

//export const persistenceKey = "PERSISTANCE_KEY_0.0.0";

export const persistNavigationState = async (newState: unknown) => {
  try {
    navState = newState;
  } catch (err) {
    console.log("Error Setting", err);
  }
};

export const loadNavigationState = () => {
  return navState;
};

let navState: unknown = null;
