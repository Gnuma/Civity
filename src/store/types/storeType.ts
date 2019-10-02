import { OfficeType, UserData } from "./profile";
import { ResultType, ToastType } from "./utils";
import { PreviewImage, SellProcessType } from "./sell";
import { GeneralBook, ItemCondition } from "./item";

export default interface StoreType {
  search: SearchType;
  auth: AuthType;
  sell: SellType;
  comments: CommentsType;
  chat: ChatType;
  settings: SettingsType;
}

export interface AuthType {
  token: string;
  office: OfficeType;
  userData: UserData;
  isActive: boolean;
  id: number;
  error: unknown;
  loading: boolean;
  delayedLogin: boolean;
}

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

export interface SellType {
  previews: Array<PreviewImage>; //Todo
  previewsOrder: Array<number>;
  checking: Array<unknown>; //Todo
  book: GeneralBook;
  price: string;
  conditions: ItemCondition;
  description: string;
  loading: boolean;
  error: unknown;
  type: SellProcessType;
  itemModId: number;
}

export interface CommentsType {
  data: Object; // Todo
  orderData: Array<unknown>; // Todo
  error: unknown;
  loading: boolean;
}

export interface ChatType {
  data: Object; // Todo
  salesOrderedData: Array<Object>; //Todo
  shoppingOrderedData: Array<Object>;
  contactedItems: Object; //Todo
  error: unknown;
  salesFocus: number;
  shoppingFocus: number;
  chatFocus: number;
  loading: boolean;
}

export interface SettingsType {
  isConnected: boolean;
  navState: Object; //Todo
  fcmToken: string;
  toast: ToastType;
}
