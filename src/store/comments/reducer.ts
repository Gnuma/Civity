import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  COMMENTS_INIT,
  COMMENTS_RECEIVE_COMMENT,
  COMMENTS_RECEIVE_ANSWER,
  COMMENTS_READ,
  COMMENTS_CLEAR,
  CommentsType,
  TCommentsAction,
  ItemCommentData,
  CommentNotification,
  CommentsInitAction,
  CommentsReceiveCommentAction,
  CommentsReceiveAnswerAction,
  CommentsReadAction,
  CommentsClearAction,
  CommentsDataType,
  CommentNotificationTypeEnum
} from "./types";

const initialState: CommentsType = {
  data: {},
  orderedData: [],
  error: undefined,
  loading: false
};

const commentsInit = (
  state: CommentsType,
  action: CommentsInitAction
): CommentsType => {
  const { data } = action.payload;

  let orderedData: number[] = [];
  let formattedData: CommentsDataType = {};

  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.type === CommentNotificationTypeEnum.NEW_COMMENT) {
      let itemID = node.comment.item.pk;
      if (!formattedData[itemID]) orderedData.push(itemID);
      formattedData = update(formattedData, {
        [itemID]: item =>
          update(item || getEmptyItem(node.comment), {
            commentsList: { [node.comment.pk]: { $set: true } },
            newComment: { $set: true }
          })
      });
    } else {
      let itemID = node.answer.parent.item.pk;
      if (!formattedData[itemID]) orderedData.push(itemID);
      formattedData = update(formattedData, {
        [itemID]: item =>
          update(item || getEmptyItem(node.answer.parent), {
            commentsList: { [node.answer.parent.pk]: { $set: true } },
            newAnswer: { $set: true }
          })
      });
    }
  }

  return update(state, {
    data: { $set: formattedData },
    orderedData: { $set: orderedData }
  });
};

const commentsReceiveComment = (
  state: CommentsType,
  action: CommentsReceiveCommentAction
): CommentsType => {
  const comment = action.payload.comment;
  const itemID = comment.item.pk;
  const newItems = !state.data[itemID] ? [itemID] : [];

  return update(state, {
    data: {
      [itemID]: item => {
        console.log(item);
        return update(item || getEmptyItem(comment), {
          commentsList: { [comment.pk]: { $set: true } },
          newComment: { $set: true }
        });
      }
    },
    orderedData: { $unshift: newItems }
  });
};

const commentsReceiveAnswer = (
  state: CommentsType,
  action: CommentsReceiveAnswerAction
): CommentsType => {
  const comment = action.payload.answer.parent;
  const itemID = comment.item.pk;
  const newItems = !state.data[itemID] ? [itemID] : [];

  return update(state, {
    data: {
      [itemID]: item => {
        console.log(item);
        return update(item || getEmptyItem(comment), {
          commentsList: { [comment.pk]: { $set: true } },
          newAnswer: { $set: true }
        });
      }
    },
    orderedData: { $unshift: newItems }
  });
};

const commentsRead = (
  state: CommentsType,
  action: CommentsReadAction
): CommentsType => {
  const { itemID } = action.payload;

  for (var i = 0; i < state.orderedData.length; i++) {
    if (itemID == state.orderedData[i]) break;
  }

  return update(state, {
    data: {
      $unset: [itemID]
    },
    orderedData: { $splice: [[i, 1]] }
  });
};

const commentsClear = (
  state: CommentsType,
  action: CommentsClearAction
): CommentsType => initialState;

const reducer = (
  state = initialState,
  action: TCommentsAction
): CommentsType => {
  switch (action.type) {
    case COMMENTS_INIT:
      return commentsInit(state, action);
    case COMMENTS_RECEIVE_COMMENT:
      return commentsReceiveComment(state, action);
    case COMMENTS_RECEIVE_ANSWER:
      return commentsReceiveAnswer(state, action);
    case COMMENTS_READ:
      return commentsRead(state, action);
    case COMMENTS_CLEAR:
      return commentsClear(state, action);

    default:
      return state;
  }
};

export default reducer;

const getEmptyItem = (comment: CommentNotification): ItemCommentData => {
  return {
    commentsList: {},
    item: comment.item,
    newComment: false,
    newAnswer: false
  };
};
