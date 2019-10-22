import { updateObject } from "../utility";
import update from "immutability-helper";
import { ChatType, TChatActions } from "./types";

const initialState: ChatType = {};

export default (state = initialState, action: TChatActions): ChatType => {
  switch (action.type) {
    default:
      return state;
  }
};
