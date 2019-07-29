import uuid from "uuid";
import { ChatType } from "../utils/constants";

export const newCommentsSingle = [
  {
    pk: 1,
    itemPK: 2,
    user: {
      username: "Federico",
      fbPoints: 8,
      id: 1
    },
    content:
      "Ciao Gnuma il libro è ancora disponibile? che vuole dire giusto qualche ammaccatura?",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  },
  {
    pk: 2,
    itemPK: 2,
    fatherPK: 2,
    user: {
      username: "Gnuma",
      fbPoints: 10,
      id: 2
    },
    content:
      "Ciao Federico, si il libro è disponibile sempre a 15€, le ammaccature sono qualche pagina  piegata verso la fine del libro, comunque è in ottime condizioni.",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  },
  {
    pk: 4,
    itemPK: 1,
    user: {
      username: "Arianna",
      fbPoints: 2,
      id: 3
    },
    content: "Ciao, vendi anche a Isa Roma 2? perchè io vengo da li",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  },
  {
    pk: 8,
    user: {
      username: "Federico",
      fbPoints: 8,
      id: 1
    },
    content:
      "Ciao Gnuma il libro è ancora disponibile? che vuole dire giusto qualche ammaccatura?",
    created_at: "28/03/2019",
    answers: [],
    book: "Titolo nuovo",
    itemPK: 3
  }
];

export const newCommentsMulti = [
  {
    pk: 1,
    itemPK: 2,
    user: {
      username: "Federico",
      fbPoints: 8,
      id: 1
    },
    content:
      "Ciao Gnuma il libro è ancora disponibile? che vuole dire giusto qualche ammaccatura?",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  },
  {
    pk: 2,
    itemPK: 2,
    fatherPK: 2,
    user: {
      username: "Gnuma",
      fbPoints: 10,
      id: 2
    },
    content:
      "Ciao Federico, si il libro è disponibile sempre a 15€, le ammaccature sono qualche pagina  piegata verso la fine del libro, comunque è in ottime condizioni.",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  },
  {
    pk: 4,
    itemPK: 1,
    user: {
      username: "Arianna",
      fbPoints: 2,
      id: 3
    },
    content: "Ciao, vendi anche a Isa Roma 2? perchè io vengo da li",
    created_at: "28/03/2019",
    answers: [],
    book: "Matematica Verde 3"
  }
];

export const comment = {
  type: "newComment",
  for: "sales",
  comment: {
    pk: 1,
    item: {
      pk: 1,
      seller: {
        user: {
          _id: 100,
          username: "Test6"
        },
        classM: null,
        level: "Free",
        adsCreated: 0
      },
      book: {
        title: "Marte è bella",
        authors: "tu ca ri to ta"
      },
      image_ad: []
    },
    user: {
      user: {
        _id: 2,
        username: "Gnuma"
      },
      classM: null,
      level: "Free",
      adsCreated: 0
    },
    createdAt: "2019-04-19T21:59:07.804904Z",
    text: "Ciao, hai per caso pure la seconda edizione?"
  }
};

export const answer = {
  type: "newAnswer",
  for: ChatType.shopping,
  answer: {
    pk: 2,
    parent: {
      pk: 1,
      item: {
        pk: 1,
        seller: {
          user: {
            _id: 100,
            username: "Test6"
          },
          classM: null,
          level: "Free",
          adsCreated: 0
        },
        book: null,
        image_ad: []
      },
      user: {
        user: {
          _id: 2,
          username: "Gnuma"
        },
        classM: null,
        level: "Free",
        adsCreated: 0
      },
      createdAt: "2019-04-19T21:59:19.881828Z",
      text: "Ciao, hai per caso pure la seconda edizione?"
    },
    user: {
      user: {
        _id: 100,
        username: "Test6"
      },
      classM: null,
      level: "Free",
      adsCreated: 0
    },
    createdAt: "2019-04-20T21:59:19.881828Z",
    text: "No, non ce l'ho!"
  }
};

const item1ID = uuid.v4();
const item1comment1ID = uuid.v4();
const item2ID = uuid.v4();
const item2comment1ID = uuid.v4();
const item2comment2ID = uuid.v4();

export const commentList = {
  [item1ID]: {
    pk: item1ID,
    type: ChatType.shopping,
    book: {
      title: "Matematica Verde 3",
      authors: "tu ca ri to ta"
    },
    data: [
      { pk: 1, answers: [{ pk: uuid.v4() }] },
      { pk: 4, answers: [{ pk: uuid.v4() }] }
    ]
  },
  [item2ID]: {
    pk: item2ID,
    type: "sales",
    book: {
      title: "Non matematica ajflksjgkljdflgjdfklgjldkfgjkldfjglkjdfkljgkldfg",
      authors: "tu ca ri to ta"
    },
    data: [{ pk: 1, answers: [] }, { pk: 2, answer: [] }]
  }
};
