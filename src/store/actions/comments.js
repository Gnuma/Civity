import * as actionTypes from "./actionTypes";
import ws from "../../utils/WebSocket";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";

export const init = data => ({
  type: actionTypes.COMMENTS_INIT,
  payload: {
    data
  }
});

export const commentsReceiveComment = comment => ({
  type: actionTypes.COMMENTS_RECEIVE_COMMENT,
  payload: {
    comment
  }
});

export const commentsReceiveAnswer = answer => ({
  type: actionTypes.COMMENTS_RECEIVE_ANSWER,
  payload: {
    answer
  }
});

export const commentsClear = () => ({
  type: actionTypes.COMMENTS_CLEAR
});

export const commentsInit = data => {
  return dispatch => {
    dispatch(init(data));
  };
};

export const commentsRead = itemID => {
  return dispatch => {
    //API

    dispatch({
      type: actionTypes.COMMENTS_READ,
      payload: { itemID }
    });
  };
};
