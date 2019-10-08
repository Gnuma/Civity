import { ActionsObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  COMMENTS_INIT,
  COMMENTS_RECEIVE_COMMENT,
  COMMENTS_RECEIVE_ANSWER,
  COMMENTS_READ,
  COMMENTS_CLEAR,
  ComentsInitType,
  TCommentsAction,
  CommentNotification,
  AnswerNotification,
  CommentsType
} from "./types";

export const commentsInit = (data: ComentsInitType[]): TCommentsAction => ({
  type: COMMENTS_INIT,
  payload: {
    data
  }
});

export const commentsReceiveComment = (
  comment: CommentNotification
): TCommentsAction => ({
  type: COMMENTS_RECEIVE_COMMENT,
  payload: {
    comment
  }
});

export const commentsReceiveAnswer = (
  answer: AnswerNotification
): TCommentsAction => ({
  type: COMMENTS_RECEIVE_ANSWER,
  payload: {
    answer
  }
});

export const commentsClear = (): TCommentsAction => ({
  type: COMMENTS_CLEAR
});

export const commentsRead = (itemID: number): TCommentsAction => ({
  type: COMMENTS_READ,
  payload: {
    itemID
  }
});
