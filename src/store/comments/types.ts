import { ReducedItem } from "../../types/ItemTypes";

export const COMMENTS_INIT = "COMMENTS_INIT";
export const COMMENTS_RECEIVE_COMMENT = "COMMENTS_RECEIVE_COMMENT";
export const COMMENTS_RECEIVE_ANSWER = "COMMENTS_RECEIVE_ANSWER";
export const COMMENTS_READ = "COMMENTS_READ";
export const COMMENTS_CLEAR = "COMMENTS_CLEAR";

export interface CommentsType {
  data: { [key: number]: ItemCommentData }; // Todo
  orderedData: number[]; // Todo
  error: unknown;
  loading: boolean;
}

export type CommentsDataType = { [key: number]: ItemCommentData };

export type CommentNotificationType = "newComment" | "newAnswer";

export enum CommentNotificationTypeEnum {
  NEW_COMMENT = "newComment",
  NEW_ANSWER = "newAnswer"
}

export interface ItemCommentData {
  commentsList: { [key: number]: boolean };
  item: ReducedItem;
  newComment: boolean;
  newAnswer: boolean;
}

export interface CommentNotification {
  pk: number;
  item: ReducedItem;
  createdAt: string;
}

export interface AnswerNotification {
  pk: number;
  parent: CommentNotification;
  createdAt: string;
}

interface CommentsInitComment {
  type: typeof CommentNotificationTypeEnum.NEW_COMMENT;
  comment: CommentNotification;
}

interface CommentsInitAnswer {
  type: typeof CommentNotificationTypeEnum.NEW_ANSWER;
  for: "sales" | "shopping";
  answer: AnswerNotification;
}

export type ComentsInitType = CommentsInitComment | CommentsInitAnswer;

//ACTIONS
export interface CommentsInitAction {
  type: typeof COMMENTS_INIT;
  payload: {
    data: ComentsInitType[];
  };
}

export interface CommentsReceiveCommentAction {
  type: typeof COMMENTS_RECEIVE_COMMENT;
  payload: {
    comment: CommentNotification;
  };
}

export interface CommentsReceiveAnswerAction {
  type: typeof COMMENTS_RECEIVE_ANSWER;
  payload: {
    answer: AnswerNotification;
  };
}

export interface CommentsClearAction {
  type: typeof COMMENTS_CLEAR;
}

export interface CommentsReadAction {
  type: typeof COMMENTS_READ;
  payload: {
    itemID: number;
  };
}

export type TCommentsAction =
  | CommentsInitAction
  | CommentsReceiveCommentAction
  | CommentsReceiveAnswerAction
  | CommentsClearAction
  | CommentsReadAction;
