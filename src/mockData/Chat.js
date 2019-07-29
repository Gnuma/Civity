import uuid from "uuid";
import { ChatStatus } from "../utils/constants";

export const mockChatLink = {
  buyer: {
    id: 1,
    name: "Federico"
  },
  seller: {
    id: 2,
    name: "Alice"
  },
  status: ChatStatus.PROGRESS
};

export const mockMessages = [
  {
    _id: "A",
    createdAt: new Date(2019, 2, 4, 12, 0),
    text: "Ciao 6",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: "B",
    createdAt: new Date(2019, 2, 4, 11, 30),
    text: "Ciao 5",
    user: {
      _id: 2,
      name: "Alice"
    }
  },
  {
    _id: "C",
    createdAt: new Date(2019, 2, 4, 11, 0),
    text: "Ciao 4",
    user: {
      _id: 2,
      name: "Alice"
    }
  },
  {
    _id: uuid.v4(),
    createdAt: new Date(2019, 2, 4, 10, 59),
    text: "Spero tutto ok",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: uuid.v4(),
    createdAt: new Date(2019, 2, 4, 10, 58),
    text: "Come va?",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: uuid.v4(),
    createdAt: new Date(2019, 2, 4, 10, 57),
    text: "Ciao skgkldfkgkldfghkodf",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: "D",
    createdAt: new Date(2019, 2, 2, 10, 30),
    text: "Ciao 3",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: "F",
    createdAt: new Date(2019, 2, 2, 9, 30),
    text: "Ciao 2",
    user: {
      _id: 1,
      name: "Federico"
    }
  },
  {
    _id: uuid.v4(),
    createdAt: new Date(2019, 2, 1, 8, 30),
    text: "Ciao 1",
    user: {
      _id: 1,
      name: "Federico"
    }
  }
];

export const chats = [
  {
    id: "1",
    status: 2,
    img: "",
    price: 15,
    conditions: 1,
    seller: {
      name: "Federico",
      fbPoints: 8,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma",
        type: "Tecnico"
      }
    },
    book: {
      title: "Matematica Verde 3",
      authors: "Massimiliano Bergamini, Anna Tritone e Graziella Banzoni",
      isbn: "9788804705161",
      subject: "Matematica",
      year: 3
    },
    description:
      "Libro Matematica Verde 3 venduto praticamente nuovo giusto qualche ammaccatura contattatemi per informazioni e prezzo."
  },
  {
    id: "2",
    status: 2,
    img: "",
    price: 20,
    conditions: 2,
    seller: {
      name: "Marco",
      fbPoints: 23,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma",
        type: "Tecnico"
      }
    },
    book: {
      title: "Matematica Verde 3",
      authors: "Massimiliano Bergamini, Anna Tritone e Graziella Banzoni",
      isbn: "9788804705161",
      subject: "Matematica",
      year: 3
    },
    description:
      "Libro Matematica Verde 3 venduto praticamente nuovo giusto qualche ammaccatura contattatemi per informazioni e prezzo."
  },
  {
    id: "3",
    status: 0,
    img: "",
    price: 18,
    conditions: 3,
    seller: {
      name: "Livia",
      fbPoints: 18,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma",
        type: "Tecnico"
      }
    },
    book: {
      title: "Matematica Verde 3",
      authors: "Massimiliano Bergamini, Anna Tritone e Graziella Banzoni",
      isbn: "9788804705161",
      subject: "Matematica",
      year: 3
    },
    description:
      "Libro Matematica Verde 3 venduto praticamente nuovo giusto qualche ammaccatura contattatemi per informazioni e prezzo."
  }
];

export const mockChat = [
  {
    _id: 1,
    text:
      "It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: "Developer"
    }
  },
  {
    _id: 2,
    text: "React Native lets you build mobile apps using only JavaScript",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: "Developer"
    }
  },
  {
    _id: 3,
    text: "This is a system message.",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    system: true
  }
];

export const oldMockChat = [
  {
    _id: 4,
    text:
      "It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: "Developer"
    }
  },
  {
    _id: 5,
    text: "React Native lets you build mobile apps using only JavaScript",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: "Developer"
    }
  },
  {
    _id: 6,
    text: "This is a system message.",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    system: true
  }
];
