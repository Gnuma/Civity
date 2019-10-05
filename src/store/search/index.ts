import { Epic, ActionsObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAIL,
  SEARCH_SUGGEST,
  SEARCH_SET_ACTIVE,
  SEARCH_SET_SEARCHQUERY,
  SEARCH_GO_HOME,
  SEARCH_UPDATE_HISTORY,
  SEARCH_LOAD_MORE_SUCCESS,
  SEARCH_LOAD_MORE_FAIL,
  SEARCH_LOAD_MORE_START,
  TSearchActions,
  SearchResult,
  SearchRecent,
  SearchOptions,
  ResultTypeEnum,
  SearchSetSearchQueryAction
} from "./types";
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

//import { singleResults, multiResults } from "../../mockData/SearchResults";
import { Keyboard } from "react-native";
import {
  ___BOOK_HINTS_ENDPOINT___,
  ___AD_SEARCH_ENDPOINT___
} from "../constants";
import { isIsbn, setItem } from "../utility";
import update from "immutability-helper";
import { GeneralBook, SearchResultObject } from "../../types/itemTypes";
import { StoreType } from "../root";

export const searchRecentKey = "@auth:searchRecent";

export const searchSetSearchQuery = (search_query: string): TSearchActions => ({
  type: SEARCH_SET_SEARCHQUERY,
  payload: {
    search_query
  }
});

export const searchStart = (
  search_query?: string,
  isbn?: string
): TSearchActions => {
  return {
    type: SEARCH_START,
    payload: {
      search_query,
      isbn
    }
  };
};

export const searchSuccess = (data: SearchResult): TSearchActions => {
  return {
    type: SEARCH_SUCCESS,
    payload: {
      ...data
    }
  };
};

export const searchFail = (error: unknown): TSearchActions => {
  return {
    type: SEARCH_FAIL,
    payload: {
      error: error
    }
  };
};

export const searchSuggest = (
  suggestions: Array<GeneralBook>
): TSearchActions => {
  return {
    type: SEARCH_SUGGEST,
    payload: {
      suggestions
    }
  };
};

export const searchSetActive = (isActive: boolean): TSearchActions => {
  return {
    type: SEARCH_SET_ACTIVE,
    payload: {
      isActive: isActive
    }
  };
};

export const searchGoHome = (): TSearchActions => {
  return {
    type: SEARCH_GO_HOME
  };
};

export const searchUpdateHistory = (recent: SearchRecent): TSearchActions => {
  setItem(searchRecentKey, recent);
  return {
    type: SEARCH_UPDATE_HISTORY,
    payload: {
      recent
    }
  };
};

export const searchLoadMoreSuccess = (
  data: Array<SearchResultObject>,
  page: number,
  isLast: boolean
): TSearchActions => ({
  type: SEARCH_LOAD_MORE_SUCCESS,
  payload: {
    data,
    page,
    isLast
  }
});

export const searchLoadMoreFail = (error: unknown): TSearchActions => ({
  type: SEARCH_LOAD_MORE_FAIL,
  payload: {
    error
  }
});

export const searchLoadMoreStart = (): TSearchActions => ({
  type: SEARCH_LOAD_MORE_START
});

export const search = (
  searchOptions: SearchOptions
): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState) => {
    Keyboard.dismiss();

    let keyName;
    let value;
    console.log(searchOptions);
    if (searchOptions.isbn && searchOptions.title) {
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
    } else if (searchOptions.keyword) {
      keyName = "keyword";
      value = searchOptions.keyword;
      dispatch(searchStart(searchOptions.keyword));
    } else throw "Search options 404";
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

export const searchLoadMore = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => (dispatch, getState) => {
  const { page, resultType, searchQuery, bookIsbn } = getState().search;
  const keyName = resultType === ResultTypeEnum.SINGLE ? "book" : "keyword";
  const value = resultType === ResultTypeEnum.SINGLE ? bookIsbn : searchQuery;
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
const searchChangeEpic = (
  action$: ActionsObservable<SearchSetSearchQueryAction>
) =>
  action$.pipe(
    ofType<SearchSetSearchQueryAction>(SEARCH_SET_SEARCHQUERY),
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
const formatHistoryUpdate = (
  { order, keys }: SearchRecent,
  { isbn, ...rest }: SearchOptions
): SearchRecent => {
  if (!isbn || !rest.title) throw "Format History 404";
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
  order = update(order, { $unshift: [{ isbn, title: rest.title }] });
  keys[isbn] = true;
  return {
    order,
    keys
  };
};
