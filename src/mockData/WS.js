import uuid from "uuid";

export const newChat = {
  type: "newChat",
  chat: {
    pk: 1,
    item: {
      pk: 1,
      seller: {
        user: {
          username: "seller"
        },
        classM: null,
        level: "Free",
        adsCreated: 0
      },
      book: null,
      image_ad: []
    },
    buyer: {
      pk: 2,
      user: {
        username: "buyer"
      }
    },
    created: "2019-04-19T21:59:33.021565Z"
  }
};
