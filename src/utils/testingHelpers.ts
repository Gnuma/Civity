import uuid from "uuid";
import { GeneralBook, ItemCondition, GeneralAuthor } from "../types/ItemTypes";
import { GeneralInfoItem, PictureSelectorItem } from "../store/sell/types";
import {
  ChatDataType,
  GeneralMessage,
  ChatStatus,
  ChatClass,
  ChatUser,
  AttachmentType
} from "../store/chat/types";
import _ from "lodash";

export const user0: ChatUser = {
  user: { id: 0, username: "User Io" },
  news: 0
};

export const user1: ChatUser = {
  user: { id: 1, username: "User L'altro" },
  news: 0
};

export const generateChatData = (
  size: number
): { data: ChatDataType; chatOrder: string[] } => {
  const data: ChatDataType = {};
  const chatOrder: string[] = [];
  for (let i = 0; i < size; i++) {
    const id = uuid.v4();
    data[id] = {
      id: id,
      messages: generateMessages(50),
      composer: "",
      createdAt: new Date(),
      items: [
        {
          ...generateGeneralInfoItem(1)[0],
          image_ad: [
            "https://civity.s3.amazonaws.com/media/items/c0e71153-f38.jpg"
          ],
          seller: user1
        }
      ],
      status: ChatStatus.PROGRESS,
      users: [user0, user1],
      receiver: user1
    };
    chatOrder.push(id);
  }
  return { data, chatOrder };
};

export const generateMessages = (size: number): GeneralMessage[] => {
  const data: GeneralMessage[] = [];
  const from = new Date("12/1/2019");
  const to = new Date("12/12/2019");
  for (let i = size; i > 0; i--) {
    data.push({
      id: i,
      createdAt: new Date(
        (to.getTime() - from.getTime()) * (i / size) + from.getTime()
      ),
      text: generateText(3, 63),
      sender: _.random(0, 1, false) == 0 ? user1 : user0
    });
    if (i % 5 == 0) {
      const author = _.random(0, 1, false) == 0 ? user1 : user0;
      const seller = author == user1 ? user1 : user0;
      const itemInfos = generateGeneralInfoItem(1)[0];
      data.push({
        attachment: {
          item: {
            ...itemInfos,
            image_ad: [
              "https://civity.s3.amazonaws.com/media/items/c0e71153-f38.jpg"
            ],
            seller: seller
          },
          type: AttachmentType.ITEM,
          buyer: author
        },
        createdAt: new Date(
          (to.getTime() - from.getTime()) * (i / size) + from.getTime()
        ),
        id: i + 1000,
        text: `${author.user.username} ha aggiunto ${itemInfos.book.title} al carrello`,
        system: true
      });
    }
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
