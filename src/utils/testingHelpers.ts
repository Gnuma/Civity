import uuid from "uuid";
import { GeneralBook, ItemCondition } from "../types/ItemTypes";

export const generateBooks = (size: number) => {
  const data = [];
  for (let i = 0; i < size; i++)
    data.push({
      title: generateText(3, 33),
      author: "Io, te, gli altri",
      isbn: uuid.v4(),
      subject: { _id: 4, title: "Matematica" }
    });
  return data;
};

interface GeneralItemInfo {
  book: GeneralBook;
  price?: string;
  condition?: ItemCondition;
  notes?: string;
}

export const generateItemOnlyBooks = (size: number): GeneralItemInfo[] => {
  const data = [];
  for (let i = 0; i < size; i++)
    data.push({
      book: {
        title: generateText(3, 33),
        author: "Io, te, gli altri",
        isbn: uuid.v4(),
        subject: { _id: 4, title: "Matematica" }
      }
    });
  return data;
};

export const generateText = (min: number, max: number) => {
  const length = Math.random() * (max - min) + min;
  return LOREM.substring(0, length);
};

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, enim! Cupiditate ratione quisquam provident dolore ut velit at, libero necessitatibus vitae sed enim culpa eos quo doloribus magnam amet repellendus.";
