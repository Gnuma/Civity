import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  data: null,
  orderedData: null,
  error: null
};

const notificationsUpdate = (state, action) => {
  return updateObject(state, {
    data: action.payload.notifications
  });
};

const notificationsUnsubscribe = (state, action) => {
  clearInterval(state.idSubscription);
  return updateObject(state, {
    idSubscription: null,
    notifications: {}
  });
};

const notificationViewItem = (state, action) => {
  return update(state, {
    notifications: { $unset: [action.payload.itemPK] }
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    
    case actionTypes.NOTIFICATIONS_UPDATE:
      return notificationsUpdate(state, action);

    case actionTypes.NOTIFICATIONS_UNSUBSCRIBE:
      return notificationsUnsubscribe(state, action);

    case actionTypes.NOTIFICATIONS_VIEW_ITEM:
      return notificationViewItem(state, action);

    default:
      return state;
  }
};

export default reducer;
