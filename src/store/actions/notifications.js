import * as actionTypes from "./actionTypes";
import axios from "axios";
import { newCommentsSingle, newCommentsMulti } from "../../mockData/comments";
import { localNotification } from "../../service/pushNotification";
import { ___CREATE_COMMENT___ } from "../constants";

export const notificationsUpdate = data => {
  return {
    type: actionTypes.NOTIFICATIONS_UPDATE,
    payload: {
      data
    }
  };
};

export const notificationsUnsubscribe = () => {
  return {
    type: actionTypes.NOTIFICATIONS_UNSUBSCRIBE
  };
};

export const notificationsViewItem = itemPK => {
  return {
    type: actionTypes.NOTIFICATIONS_VIEW_ITEM,
    payload: {
      itemPK
    }
  };
};

export const update = data => {
  return dispatch => {
    dispatch(notificationsUpdate(formatComments(data)));
  };
};

formatComments = data => {
  let formattedData = {};
  let orderedData = [];
  for (let i = 0; i < data.length; i++) {
    const itemPK = data[i].itemPK;
    const fatherPK =
      data[i].fatherPK !== undefined ? data[i].fatherPK : data[i].pk;
    if (!formattedData[itemPK])
      formattedData[itemPK] = {
        itemPK,
        fatherPK,
        commentPK: data[i].pk,
        book: data[i].book
      };
    else if (
      !formattedData[itemPK].commentPK ||
      formattedData[itemPK].fatherPK !== fatherPK
    )
      formattedData[itemPK].commentPK = null;
  }
  return formattedData;
};
