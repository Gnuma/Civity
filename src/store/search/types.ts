import { SearchResultObject, GeneralBook } from "../../types/ItemTypes";

export const SEARCH_START = "SEARCH_START";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAIL = "SEARCH_FAIL";
export const SEARCH_SUGGEST = "SEARCH_SUGGEST";
export const SEARCH_SET_ACTIVE = "SEARCH_SET_ACTIVE";
export const SEARCH_SET_SEARCHQUERY = "SEARCH_SET_SEARCHQUERY";
export const SEARCH_GO_HOME = "SEARCH_GO_HOME";
export const SEARCH_UPDATE_HISTORY = "SEARCH_UPDATE_HISTORY";
export const SEARCH_LOAD_MORE_SUCCESS = "SEARCH_LOAD_MORE_SUCCESS";
export const SEARCH_LOAD_MORE_FAIL = "SEARCH_LOAD_MORE_FAIL";
export const SEARCH_LOAD_MORE_START = "SEARCH_LOAD_MORE_START";

export interface SearchType {
  results?: Array<SearchResultObject>;
  resultType?: ResultType;
  page: number;
  isLast?: boolean;
  isLoadingMore?: boolean;
  error?: unknown;
  loading?: boolean;
  searchQuery?: string;
  isActive?: boolean;
  showResults?: boolean;
  suggestions?: Array<GeneralBook>;
  recent: SearchRecent;
  bookIsbn?: string;
}

export interface SearchOptions {
  isbn?: string;
  title?: string;
  keyword?: string;
}

export enum ResultTypeEnum {
  SINGLE = "single",
  MULTI = "multi"
}

export interface SearchRecentObject {
  isbn: string;
  title: string;
}

export type ResultType = ResultTypeEnum.SINGLE | ResultTypeEnum.MULTI;

export interface SearchRecent {
  order: SearchRecentObject[];
  keys: { [key: string]: boolean };
}

export interface SearchResult {
  resultType: ResultType;
  results: Array<SearchResultObject>;
  last: boolean;
}

export interface SearchSetSearchQueryAction {
  type: typeof SEARCH_SET_SEARCHQUERY;
  payload: {
    search_query: string;
  };
}

export interface SearchStartAction {
  type: typeof SEARCH_START;
  payload: {
    search_query?: string;
    isbn?: string;
  };
}

export interface SearchSuccessAction {
  type: typeof SEARCH_SUCCESS;
  payload: {
    results: Array<SearchResultObject>;
    resultType: ResultType;
    last: boolean;
  };
}

export interface SearchFailAction {
  type: typeof SEARCH_FAIL;
  payload: {
    error: unknown;
  };
}

export interface SearchSuggestAction {
  type: typeof SEARCH_SUGGEST;
  payload: {
    suggestions: Array<GeneralBook>;
  };
}

export interface SearchSetActiveAction {
  type: typeof SEARCH_SET_ACTIVE;
  payload: {
    isActive: boolean;
  };
}

export interface SearchGoHomeAction {
  type: typeof SEARCH_GO_HOME;
}

export interface SearchUpdateHistoryAction {
  type: typeof SEARCH_UPDATE_HISTORY;
  payload: {
    recent: SearchRecent;
  };
}

export interface SearchLoadMoreSuccessAction {
  type: typeof SEARCH_LOAD_MORE_SUCCESS;
  payload: {
    data: Array<SearchResultObject>;
    page: number;
    isLast: boolean;
  };
}

export interface SearchLoadMoreFailAction {
  type: typeof SEARCH_LOAD_MORE_FAIL;
  payload: {
    error: unknown;
  };
}

export interface SearchLoadMoreStartAction {
  type: typeof SEARCH_LOAD_MORE_START;
}

export type TSearchActions =
  | SearchSetSearchQueryAction
  | SearchStartAction
  | SearchSuccessAction
  | SearchFailAction
  | SearchSuggestAction
  | SearchSetActiveAction
  | SearchGoHomeAction
  | SearchUpdateHistoryAction
  | SearchLoadMoreSuccessAction
  | SearchLoadMoreFailAction
  | SearchLoadMoreStartAction;
