import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  results: null, //search items results
  error: null, //errors
  loading: false, //is loading results
  searchQuery: "", //search query,
  isActive: false,
  showResults: false,
  suggestions: [],
  recent: {
    order: [],
    keys: {}
  }
};

const searchSetSearchQuery = (state, action) => {
  return updateObject(state, {
    searchQuery: action.payload.search_query
  });
};

const searchStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    searchQuery: action.payload.search_query,
    isActive: false,
    showResults: true,
    results: null
  });
};

const searchSuccess = (state, action) => {
  return updateObject(state, {
    results: action.payload.results,
    error: null,
    loading: false
  });
};

const searchFail = (state, action) => {
  return updateObject(state, {
    error: action.payload.error,
    loading: false
  });
};

const searchSuggest = (state, action) => {
  return updateObject(state, {
    suggestions: action.payload.suggestions
  });
};

const searchSetActive = (state, action) => {
  return updateObject(state, {
    isActive: action.payload.isActive
  });
};

const searchGoHome = (state, action) => {
  return updateObject(state, {
    showResults: false,
    searchQuery: "",
    isActive: false,
    suggestions: []
  });
};

const searchUpdateHistory = (state, { payload: { recent } }) =>
  update(state, {
    recent: {
      $set: recent
    }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEARCH_START:
      return searchStart(state, action);

    case actionTypes.SEARCH_SUCCESS:
      return searchSuccess(state, action);

    case actionTypes.SEARCH_FAIL:
      return searchFail(state, action);

    case actionTypes.SEARCH_SUGGEST:
      return searchSuggest(state, action);

    case actionTypes.SEARCH_SET_ACTIVE:
      return searchSetActive(state, action);

    case actionTypes.SEARCH_SET_SEARCHQUERY:
      return searchSetSearchQuery(state, action);

    case actionTypes.SEARCH_GO_HOME:
      return searchGoHome(state, action);

    case actionTypes.SEARCH_UPDATE_HISTORY:
      return searchUpdateHistory(state, action);

    default:
      return state;
  }
};

export default reducer;
