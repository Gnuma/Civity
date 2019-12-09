import { BehaviorSubject, of } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  switchMap,
  catchError
} from "rxjs/operators";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { ___BOOK_HINTS_ENDPOINT___ } from "../store/endpoints";
import { GeneralBook } from "../types/ItemTypes";

export const searchBooks = (subject: BehaviorSubject<string>) => {
  return subject.pipe(
    debounceTime(100),
    filter(query => query.length > 2),
    switchMap(query =>
      ajax.post(___BOOK_HINTS_ENDPOINT___, { keyword: query }).pipe()
    ),
    map(transfromGetBooksReponse)
  );
};

const transfromGetBooksReponse = ({
  response
}: {
  response: GeneralBook[];
}) => {
  return response;
};
