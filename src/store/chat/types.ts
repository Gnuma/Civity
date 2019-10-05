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
