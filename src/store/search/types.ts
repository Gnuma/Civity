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
  results: Array<unknown>; //TODO
  resultType: ResultType;
  page: number;
  isLast: boolean;
  isLoadingMore: boolean;
  error: unknown;
  loading: boolean;
  searchQuery: string;
  isActive: boolean;
  showResults: true;
  suggestions: unknown; //ToDo
  recent: unknown; //Todo
  bookIsbn: string;
}

export type ResultType = "single" | "multi";

export interface SearchSetSearchQueryAction {
  type: typeof SEARCH_SET_SEARCHQUERY;
  payload: {
    search_query: string;
  };
}

export interface SearchStartAction {
  type: typeof SEARCH_START;
  payload: {
    search_query: string;
    isbn: string;
  };
}

export interface SearchSuccessAction {
  type: typeof SEARCH_SUCCESS;
  payload: {
    results: Array<Object>; //Todo
    resultType: ResultType;
    last: boolean;
  };
}
