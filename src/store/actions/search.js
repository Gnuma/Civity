import * as actionTypes from "./actionTypes";
import axios from "axios";
import { ofType } from "redux-observable";
import {
  map,
  mergeMap,
  catchError,
  switchMap,
  debounceTime,
  concatMap
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

import { singleResults, multiResults } from "../../mockData/SearchResults";
import { Keyboard } from "react-native";
import {
  ___BOOK_HINTS_ENDPOINT___,
  ___AD_SEARCH_ENDPOINT___
} from "../constants";
import { isIsbn, setItem } from "../utility";
import update from "immutability-helper";

const isOffline = false;
export const searchRecentKey = "@auth:searchRecent";

export const searchSetSearchQuery = search_query => {
  return {
    type: actionTypes.SEARCH_SET_SEARCHQUERY,
    payload: {
      search_query: search_query
    }
  };
};

export const searchStart = (search_query, isbn) => {
  return {
    type: actionTypes.SEARCH_START,
    payload: {
      search_query: search_query,
      isbn
    }
  };
};

export const searchSuccess = data => {
  return {
    type: actionTypes.SEARCH_SUCCESS,
    payload: {
      ...data
    }
  };
};

export const searchFail = error => {
  return {
    type: actionTypes.SEARCH_FAIL,
    payload: {
      error: error
    }
  };
};

export const searchSuggest = suggestions => {
  return {
    type: actionTypes.SEARCH_SUGGEST,
    payload: {
      suggestions
    }
  };
};

export const searchSetActive = isActive => {
  return {
    type: actionTypes.SEARCH_SET_ACTIVE,
    payload: {
      isActive: isActive
    }
  };
};

export const searchGoHome = () => {
  return {
    type: actionTypes.SEARCH_GO_HOME
  };
};

export const searchUpdateHistory = recent => {
  setItem(searchRecentKey, recent);
  return {
    type: actionTypes.SEARCH_UPDATE_HISTORY,
    payload: {
      recent
    }
  };
};

export const searchLoadMoreSuccess = (data, page, isLast) => ({
  type: actionTypes.SEARCH_LOAD_MORE_SUCCESS,
  payload: {
    data,
    page,
    isLast
  }
});

export const searchLoadMoreFail = error => ({
  type: actionTypes.SEARCH_LOAD_MORE_FAIL,
  payload: {
    error
  }
});

export const searchLoadMoreStart = () => ({
  type: actionTypes.SEARCH_LOAD_MORE_START
});

/**
 * searchOptions: {
 *    //Single
 *    isbn,
 *    title,
 *    //Multi
 *    keyword
 * }
 */
export const search = searchOptions => {
  return (dispatch, getState) => {
    Keyboard.dismiss();

    let keyName;
    let value;
    console.log(searchOptions);
    if (searchOptions.isbn) {
      try {
        const recent = formatHistoryUpdate(
          getState().search.recent,
          searchOptions
        );
        dispatch(searchUpdateHistory(recent));
      } catch (error) {
        console.log(error);
        dispatch(
          searchUpdateHistory({
            order: [],
            keys: {}
          })
        );
      }

      keyName = "book";
      value = searchOptions.isbn;
      dispatch(searchStart(searchOptions.title, value));
    } else {
      keyName = "keyword";
      value = searchOptions.keyword;
      dispatch(searchStart(searchOptions.keyword));
    }
    axios
      .post(___AD_SEARCH_ENDPOINT___, {
        [keyName]: value,
        page: 1
      })
      .then(res => {
        console.log(res);
        dispatch(searchSuccess(res.data));
      })
      .catch(err => {
        console.log({ err });
        dispatch(searchFail(err));
      });
  };
};

export const searchLoadMore = () => (dispatch, getState) => {
  const { page, resultType, searchQuery, bookIsbn } = getState().search;
  const keyName = resultType === "single" ? "book" : "keyword";
  const value = resultType === "single" ? bookIsbn : searchQuery;
  dispatch(searchLoadMoreStart());
  axios
    .post(___AD_SEARCH_ENDPOINT___, {
      [keyName]: value,
      page: page + 1
    })
    .then(res => {
      console.log(res);
      dispatch(
        searchLoadMoreSuccess(res.data.results, page + 1, res.data.last)
      );
    })
    .catch(err => {
      console.log({ err });
      dispatch(searchLoadMoreFail(err));
    });
};

/*
export const handleSearchQueryChange = search_query => {
  return dispatch => {
    dispatch(searchSetSearchQuery(search_query));
    axios
      .post(___BOOK_HINTS_ENDPOINT___, {
        keyword: search_query
      })
      .then(res => {
        dispatch(searchSuggest(res.data.results));
      })
      .catch(err => {
        dispatch(searchFail(err));
      });
  };
};
*/

//Epics
const searchChangeEpic = action$ =>
  action$.pipe(
    ofType(actionTypes.SEARCH_SET_SEARCHQUERY),
    debounceTime(200),
    mergeMap(action =>
      ajax
        .post(___BOOK_HINTS_ENDPOINT___, {
          keyword: action.payload.search_query
        })
        .pipe(
          map(({ response }) => {
            console.log(response);
            return searchSuggest(response);
          }),
          catchError(error => of(searchFail(error)))
        )
    )
  );

export const searchEpics = [searchChangeEpic];

const SEARCH_HISTORY_LENGTH = 4;
const formatHistoryUpdate = ({ order, keys }, { isbn, ...rest }) => {
  for (var index = 0; index < order.length; index++)
    if (order[index].isbn == isbn) break;
  if (index !== order.length) {
    let { isbn: deprecatedIsbn } = order[index];
    order = update(order, { $splice: [[index, 1]] });
    delete keys[deprecatedIsbn];
  } else if (order.length >= SEARCH_HISTORY_LENGTH) {
    index = order.length - 1;
    let { isbn: deprecatedIsbn } = order[index];
    order = update(order, { $splice: [[index, 1]] });
    delete keys[deprecatedIsbn];
  }
  order = update(order, { $unshift: [{ isbn, ...rest }] });
  keys[isbn] = true;
  return {
    order,
    keys
  };
};
