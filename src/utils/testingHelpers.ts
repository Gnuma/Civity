import uuid from "uuid";
import { GeneralBook, ItemCondition, GeneralAuthor } from "../types/ItemTypes";
import { GeneralInfoItem, PictureSelectorItem } from "../store/sell/types";
import {
  ChatDataType,
  GeneralMessage,
  ChatStatus,
  ChatClass
} from "../store/chat/types";

export const generateChatData = (
  size: number
): { data: ChatDataType; chatOrder: string[] } => {
  const data: ChatDataType = {};
  const chatOrder: string[] = [];
  for (let i = 0; i < size; i++) {
    const id = uuid.v4();
    data[id] = {
      id: id,
      messages: generateMessages(30),
      composer: "",
      createdAt: new Date(),
      items: [
        {
          book: generateBooks(1)[0],
          condition: 0,
          image_ad: [
            "https://civity.s3.amazonaws.com/media/items/c0e71153-f38.jpg"
          ]
        }
      ],
      status: ChatStatus.PROGRESS,
      users: [
        {
          user: {
            id: 0,
            username: "User1"
          },
          news: 0
        },
        {
          user: {
            id: 1,
            username: "User to reciever"
          },
          news: 0
        }
      ],
      receiver: {
        user: {
          id: 1,
          username: "User to reciever"
        },
        news: 0
      }
    };
    chatOrder.push(id);
  }
  return { data, chatOrder };
};

export const generateMessages = (size: number): GeneralMessage[] => {
  const data: GeneralMessage[] = [];
  for (let i = size; i > 0; i--) {
    data.push({
      id: i,
      createdAt: new Date(),
      text: generateText(3, 33),
      sender: {
        user: {
          id: 0,
          username: "User1"
        },
        news: 0
      }
    });
  }
  return data;
};

export const generateBooks = (size: number): GeneralBook[] => {
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
