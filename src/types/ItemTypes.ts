export interface GeneralBook {
  isbn: string;
  title: string;
  author: string;
  subject: GeneralSubject;
}

export interface GeneralSubject {
  _id: number;
  title: string;
}

export enum ItemCondition {
  Good = 0,
  Medium = 1,
  Bad = 2
}
