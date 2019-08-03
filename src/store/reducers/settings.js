import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  isConnected: null,
  navState: null,
  fcmToken: null
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

    default:
      return state;
  }
};

export default reducer;
