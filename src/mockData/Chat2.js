import uuid from "uuid";
import { ChatStatus, ChatType } from "../utils/constants";

export const myID = 1;

const item1ID = uuid.v4();
const item1Chat1ID = uuid.v4();
const item1Chat1UserToID = uuid.v4();
const item1Chat2ID = uuid.v4();
const item1Chat2UserToID = uuid.v4();
const item2ID = uuid.v4();
const item2Chat1ID = uuid.v4();
const item2Chat1UserToID = uuid.v4();
const item3ID = uuid.v4();
const item3Chat1ID = uuid.v4();
const item3Chat1UserToID = uuid.v4();
const item4ID = uuid.v4();
const item4Chat1ID = uuid.v4();
const item4Chat1UserToID = uuid.v4();
const item5ID = uuid.v4();

export const sellerChatList = [
  {
    _id: item1ID,
    book: {
      title: "Matematica Colore",
      authors: "Massimo Massimi"
    },
    price: 14,
    conditions: 0,
    newsCount: 1,
    chats: [
      {
        _id: item1Chat1ID,
        UserTO: {
          _id: item1Chat1UserToID,
          username: "Giancarlo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Messsaggio 1",
            createdAt: new Date(2019, 2, 4, 12, 0),
            is_read: false,
            user: {
              _id: item1Chat1UserToID
            }
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 2",
            createdAt: new Date(2019, 2, 4, 11, 0),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 3",
            createdAt: new Date(2019, 2, 4, 10, 0),
            user: {
              _id: item1Chat1UserToID
            },
            is_read: true
          }
        ]
      },
      {
        _id: item1Chat2ID,
        UserTO: {
          _id: item1Chat2UserToID,
          username: "Marco",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Messsaggio 1",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: item1Chat2UserToID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 2",
            createdAt: new Date(2019, 2, 4, 11, 0),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 3",
            createdAt: new Date(2019, 2, 4, 10, 0),
            user: {
              _id: item1Chat2UserToID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: item2ID,
    book: {
      title: "Italiano Carrarar",
      authors: "Massimo AAAA"
    },
    price: 20,
    conditions: 1,
    newsCount: 1,
    chats: [
      {
        _id: item2Chat1ID,
        UserTO: {
          _id: item2Chat1UserToID,
          username: "Marco",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Messsaggio 1",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: item2Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 2",
            createdAt: new Date(2019, 2, 4, 11, 0),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Messsaggio 3",
            createdAt: new Date(2019, 2, 4, 10, 0),
            user: {
              _id: item2Chat1UserToID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: item3ID,
    book: {
      title: "Tre Carrarar",
      authors: "Massimo AAAA"
    },
    price: 10,
    conditions: 1,
    newsCount: 0,
    chats: [
      {
        _id: item3Chat1ID,
        UserTO: {
          _id: item3Chat1UserToID,
          username: "Marco",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.PROGRESS,
        messages: []
      }
    ]
  },
  {
    _id: item4ID,
    book: {
      title: "Quatt Carrarar",
      authors: "Massimo AAAA"
    },
    price: 12,
    conditions: 1,
    newsCount: 1,
    chats: [
      {
        _id: item4Chat1ID,
        UserTO: {
          _id: item4Chat1UserToID,
          username: "Geronimo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PENDING,
        messages: [
          {
            _id: uuid.v4(),
            text:
              "Sono molto interessato a matematica verde, il prezzo è trattabile?",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: item4Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ciao Bob",
            createdAt: new Date(2019, 2, 4, 11, 0),
            user: {
              _id: item4Chat1UserToID
            },
            is_read: false
          }
        ]
      }
    ]
  },
  {
    _id: item5ID,
    book: {
      title: "Casd Carrarar",
      authors: "Massimo AAAA"
    },
    price: 16,
    conditions: 2,
    newsCount: 0,
    chats: []
  }
];

export const single = {
  _id: item1Chat1ID,
  UserTO: {
    _id: item1Chat1UserToID,
    username: "Giancarlo",
    lastVisit: new Date(2019, 2, 4, 12, 0)
  },
  hasNews: true,
  status: ChatStatus.PROGRESS,
  messages: [
    {
      _id: uuid.v4(),
      text: "Messsaggio 1",
      createdAt: new Date(2019, 2, 4, 12, 0),
      author: item1Chat1UserToID,
      is_read: false,
      user: {
        _id: item1Chat1UserToID
      }
    },
    {
      _id: uuid.v4(),
      text: "Messsaggio 2",
      createdAt: new Date(2019, 2, 4, 11, 0),
      author: myID,
      is_read: true,
      user: {
        _id: myID
      }
    },
    {
      _id: uuid.v4(),
      text: "Messsaggio 3",
      createdAt: new Date(2019, 2, 4, 10, 0),
      author: item1Chat1UserToID,
      is_read: true,
      user: {
        _id: item1Chat1UserToID
      }
    }
  ]
};

const subject1ID = uuid.v4();
const subject1Chat1ID = uuid.v4();
const subject1Chat1UserToID = uuid.v4();
const subject1Chat2ID = uuid.v4();
const subject1Chat2UserToID = uuid.v4();
const subject1Chat3ID = uuid.v4();
const subject1Chat3UserToID = uuid.v4();
const subject2ID = uuid.v4();
const subject2Chat1ID = uuid.v4();
const subject2Chat1UserToID = uuid.v4();
const subject3ID = uuid.v4();
const subject3Chat1ID = uuid.v4();
const subject3Chat1UserToID = uuid.v4();
const subject4ID = uuid.v4();
const subject4Chat1ID = uuid.v4();
const subject4Chat1UserToID = uuid.v4();
const subject5ID = uuid.v4();

export const buyerChatList = [
  {
    _id: subject1ID,
    title: "Matematica",
    newsCount: 2,
    chats: [
      {
        _id: subject1Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat1UserToID,
          username: "Geronimo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ciao certo capo!",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: subject1Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      },
      {
        _id: subject1Chat2ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat2UserToID,
          username: "Tristino",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ciao certo capo! ARARFHNASDFHHFUHSdf",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: subject1Chat2UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      },
      {
        _id: subject1Chat3ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat3UserToID,
          username: "NonRispondo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: subject2ID,
    title: "Italiano",
    newsCount: 1,
    chats: [
      {
        _id: subject2Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject2Chat1UserToID,
          username: "CapoCapo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Io no",
            createdAt: new Date(2019, 2, 4, 12, 30),
            user: {
              _id: subject2Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Al tuo libro",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: subject3ID,
    title: "Inglese",
    newsCount: 0,
    chats: [
      {
        _id: subject3Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject3Chat1UserToID,
          username: "CapoCapo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.LOCAL,
        messages: []
      }
    ]
  },
  {
    _id: subject4ID,
    title: "Quarta Materia",
    newsCount: 0,
    chats: []
  }
];

export const loadMockNew = () => {
  return [
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 11, 30),
      user: {
        _id: myID
      },
      is_read: true
    },
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 10, 30),
      user: {
        _id: myID
      },
      is_read: true
    },
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 9, 30),
      user: {
        _id: myID
      },
      is_read: true
    },
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 11, 30),
      user: {
        _id: myID
      },
      is_read: true
    },
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 10, 30),
      user: {
        _id: myID
      },
      is_read: true
    },
    {
      _id: uuid.v4(),
      text: "Ciao certo capo" + uuid.v4(),
      createdAt: new Date(2019, 1, 4, 9, 30),
      user: {
        _id: myID
      },
      is_read: true
    }
  ];
};

export default {
  sellerChatList,
  buyerChatList
};

export const mockContactItem = {
  _id: uuid.v4(),
  book: {
    title: "Casdas Carrarar",
    authors: "Massimo AAAA",
    subject: {
      _id: uuid.v4(),
      title: "Italiano"
    }
  },
  price: 5,
  conditions: 0,
  seller: {
    user: {
      _id: subject2Chat1UserToID,
      username: "CapoCapo"
    }
  }
};

export const newSellerMsg = {
  type: "newMessage",
  for: "sales",
  msg: {
    msg: {
      _id: uuid.v4(),
      text: "Nuovo messaggio seller",
      createdAt: new Date(),
      user: {
        _id: item1Chat2UserToID
      },
      is_read: false
    },
    chatID: item1Chat2ID,
    itemID: item1ID
  }
};

export const newBuyerMsg = {
  type: "newMessage",
  for: ChatType.shopping,
  msg: {
    msg: {
      _id: uuid.v4(),
      text: "Nuovo messaggio Buyer",
      createdAt: new Date(),
      user: {
        _id: subject1Chat3UserToID
      },
      is_read: false
    },
    chatID: subject1Chat3ID,
    subjectID: subject1ID
  }
};

export const newChat = {
  type: "newChat",
  chat: {
    pk: uuid.v4(),
    item: {
      _id: item1ID,
      seller: {
        user: {
          _id: myID,
          username: "seller"
        },
        classM: null,
        level: "Free",
        adsCreated: 0
      },
      book: {
        title: "Roba Nuova",
        authors: "Massimo Massimi"
      },
      price: 14,
      conditions: 0,
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

export const newChat2 = {
  type: "newChat",
  chat: {
    pk: uuid.v4(),
    item: {
      _id: uuid.v4(),
      seller: {
        user: {
          _id: myID,
          username: "seller"
        },
        classM: null,
        level: "Free",
        adsCreated: 0
      },
      book: {
        title: "Roba Nuova",
        authors: "Massimo Massimi"
      },
      price: 14,
      conditions: 0,
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

export const buyerChatList2 = [
  {
    _id: subject2ID,
    title: "Italiano",
    newsCount: 1,
    chats: [
      {
        _id: subject2Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject2Chat1UserToID,
          username: "CapoCapo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Io no",
            createdAt: new Date(2019, 2, 4, 12, 30),
            user: {
              _id: subject2Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Al tuo libro",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: subject1ID,
    title: "Matematica",
    newsCount: 2,
    chats: [
      {
        _id: subject1Chat2ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat2UserToID,
          username: "Tristino",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ciao certo capo! ARARFHNASDFHHFUHSdf",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: subject1Chat2UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      },
      {
        _id: subject1Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat1UserToID,
          username: "Geronimo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: true,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ciao certo capo!",
            createdAt: new Date(2019, 2, 4, 11, 30),
            user: {
              _id: subject1Chat1UserToID
            },
            is_read: false
          },
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      },
      {
        _id: subject1Chat3ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject1Chat3UserToID,
          username: "NonRispondo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.PROGRESS,
        messages: [
          {
            _id: uuid.v4(),
            text: "Ero interessato al tuo libro",
            createdAt: new Date(2019, 2, 4, 10, 30),
            user: {
              _id: myID
            },
            is_read: true
          },
          {
            _id: uuid.v4(),
            text: "Ciao capo!",
            createdAt: new Date(2019, 2, 4, 9, 30),
            user: {
              _id: myID
            },
            is_read: true
          }
        ]
      }
    ]
  },
  {
    _id: subject3ID,
    title: "Inglese",
    newsCount: 0,
    chats: [
      {
        _id: subject3Chat1ID,
        item: {
          _id: item5ID,
          book: {
            title: "Casd Carrarar",
            authors: "Massimo AAAA"
          },
          price: 16,
          conditions: 2,
          newsCount: 0
        },
        UserTO: {
          _id: subject3Chat1UserToID,
          username: "CapoCapo",
          lastVisit: new Date(2019, 2, 4, 12, 0)
        },
        hasNews: false,
        status: ChatStatus.LOCAL,
        messages: []
      }
    ]
  },
  {
    _id: subject4ID,
    title: "Quarta Materia",
    newsCount: 0,
    chats: []
  },
  {
    _id: subject5ID,
    title: "Capirte",
    newsCount: 0,
    chats: []
  }
];
