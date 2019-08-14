import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  isConnected: null,
  navState: null,
  fcmToken: null,
  toast:{
    text: "",
    snapshot: 0
  }
};

const settingsChangeConnection = (state, { payload: { isConnected } }) =>
  update(state, {
    isConnected: { $set: isConnected }
  });

const settingsSaveNavState = (state, { payload: { navState } }) =>
  update(state, {
    navState: { $set: navState }
  });

const settingsUpdateFCM = (state, { payload: { token } }) =>
  update(state, {
    fcmToken: { $set: token }
  });

const settingsCreateToast = (state, {payload: {toast}}) => update(state, {
  toast: {
    text: {$set: toast},
    snapshot: {$apply: (snapshot) => snapshot + 1}
  }
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SETTINGS_START:
      return state;

    case actionTypes.SETTINGS_CHANGE_CONNECTION:
      return settingsChangeConnection(state, action);

    case actionTypes.SETTINGS_SAVE_NAV_STATE:
      return settingsSaveNavState(state, action);

    case actionTypes.SETTINGS_UPDATE_FCM_TOKEN:
      return settingsUpdateFCM(state, action);

      case actionTypes.CREATE_TOAST:
        return settingsCreateToast(state, action);

    default:
      return state;
  }
};

export default reducer;
