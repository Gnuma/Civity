import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  data: {},
  orderedData: [],
  error: null,
  loading: false
};

const commentsInit = (state, action) => {
  const { data } = action.payload;

  let orderedData = [];
  let formattedData = {};

  for (let i = 0; i < data.length; i++) {
    const type = data[i].type;

    if (type == "newComment") {
      let itemID = data[i].comment.item.pk;
      if (!formattedData[itemID]) orderedData.push(itemID);
      formattedData = update(formattedData, {
        [itemID]: item =>
          update(item || getEmptyItem(data[i].comment), {
            commentsList: { [data[i].comment.pk]: { $set: true } },
            [type]: { $set: true }
          })
      });
    } else {
      let itemID = data[i].answer.parent.item.pk;
      if (!formattedData[itemID]) orderedData.push(itemID);
      formattedData = update(formattedData, {
        [itemID]: item =>
          update(item || getEmptyItem(data[i].answer.parent), {
            commentsList: { [data[i].answer.parent.pk]: { $set: true } },
            [type]: { $set: true }
          })
      });
    }
  }

  return update(state, {
    data: { $set: formattedData },
    orderedData: { $set: orderedData }
  });
};

const commentsReceiveComment = (state, action) => {
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

const commentsReceiveAnswer = (state, action) => {
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

const commentsRead = (state, action) => {
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

const commentsClear = () => initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COMMENTS_INIT:
      return commentsInit(state, action);
    case actionTypes.COMMENTS_RECEIVE_COMMENT:
      return commentsReceiveComment(state, action);
    case actionTypes.COMMENTS_RECEIVE_ANSWER:
      return commentsReceiveAnswer(state, action);
    case actionTypes.COMMENTS_READ:
      return commentsRead(state, action);
    case actionTypes.COMMENTS_CLEAR:
      return commentsClear(state, action);

    default:
      return state;
  }
};

export default reducer;

const getEmptyItem = comment => {
  return {
    commentsList: {},
    item: comment.item
  };
};
