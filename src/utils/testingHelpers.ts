import uuid from "uuid";
import { GeneralBook, ItemCondition, GeneralAuthor } from "../types/ItemTypes";
import { GeneralInfoItem, PictureSelectorItem } from "../store/sell/types";

export const generateBooks = (size: number) => {
  const data = [];
  for (let i = 0; i < size; i++)
    data.push({
      title: generateText(3, 33),
      authors: AuthorsList,
      isbn: uuid.v4(),
      subject: { _id: 4, title: "Matematica" }
    });
  return data;
};

export const generateItemOnlyBooks = (size: number): GeneralInfoItem[] => {
  const data = [];
  for (let i = 0; i < size; i++)
    data.push({
      book: {
        title: generateText(3, 33),
        authors: AuthorsList,
        isbn: uuid.v4(),
        subject: { _id: 4, title: "Matematica" }
      }
    });
  return data;
};

export const generateGeneralInfoItem = (
  size: number
): PictureSelectorItem[] => {
  const data = [];
  for (let i = 0; i < size; i++)
    data.push({
      book: {
        title: generateText(3, 33),
        authors: AuthorsList,
        isbn: uuid.v4(),
        subject: { _id: 4, title: "Matematica" }
      },
      price: Math.floor(Math.random() * 20 + 5).toString(),
      condition: ItemCondition.Good,
      image_ad: []
    });
  return data;
};

export const generateText = (min: number, max: number) => {
  const length = Math.random() * (max - min) + min;
  return LOREM.substring(0, length);
};

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, enim! Cupiditate ratione quisquam provident dolore ut velit at, libero necessitatibus vitae sed enim culpa eos quo doloribus magnam amet repellendus.";

const AuthorsList: GeneralAuthor[] = [
  {
    id: 1,
    name: "Test 1",
    last_name: "TestLast",
    books: []
  },
  {
    id: 2,
    name: "Test 2",
    last_name: "Colloquio",
    books: []
  }
];
