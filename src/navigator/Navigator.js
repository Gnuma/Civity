import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";

import store from "../store/store";

import HomeScreen from "../views/Home";
import ItemScreen from "../views/Item";
import VendiScreen from "../views/Vendi";
import AppLoaderScreen from "../views/AppLoader";
import Auth from "../views/Auth/Auth";
import CameraScreen from "../views/Camera";
import SelectBookScreen from "../views/SelectBook";
import VendiInfosScreen from "../views/VendiInfos";
import InitProfileScreen from "../views/InitProfile";
import CreateBookScreen from "../views/CreateBook";
import SalesListScreen from "../views/SalesList";
import ChatScreen from "../views/Chat";
import BookOffertScreen from "../views/BookOffert";
import ShoppingListScreen from "../views/ShoppingList";
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
import { saveNavState } from "../store/actions/settings";

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

ShoppingNavigator.navigationOptions = ({ navigation }) => {
  const focus = navigation.state.routes[navigation.state.index];

  let navigationOptions = {};
  if (focus.routeName === "ShoppingChat") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

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

AuthNavigator.navigationOptions = ({ navigation }) => {
  console.log(navigation.state);
  return {};
};

const AppStack = createBottomTabNavigator(
  {
    SEARCH: SearchNavigator,
    SALES: SalesStack,
    SHOPPING: ShoppingNavigator
  },
  {
    tabBarComponent: TabBar
  }
);

const MainStack = createStackNavigator(
  {
    App: AppStack,
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

export const persistNavigationState = async newState => {
  try {
    navState = newState;
  } catch (err) {
    console.log("Error Setting", err);
  }
};
export const loadNavigationState = () => {
  return navState;
};

let navState = null;
