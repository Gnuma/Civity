import uuid from "uuid";

export const multiResults = {
  object: "Matematica Verde",
  resultType: "multi",
  results: [
    {
      id: "0",
      name: "Matematica Verde 3",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 26,
      seller: "Marco",
      conditions: 1,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma"
      }
    },
    {
      id: "1",
      name: "Matematica Verde 2",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 14,
      seller: "Francesco",
      conditions: 2,
      office: {
        id: 2,
        name: "Liceo G.S. Orazio",
        address: "via Alberto Savinio 40, Roma"
      }
    },
    {
      id: "2",
      name: "Matematica Verde 1",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 20,
      seller: "Federica",
      conditions: 3,
      office: {
        id: 3,
        name: "Liceo Scientifico Nomenaton",
        address: "via della Bufalotta 229, Roma"
      }
    },
    {
      id: "4",
      name: "Matematica Verde 2",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 14,
      seller: "Federico",
      conditions: 1,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma"
      }
    },
    {
      id: "5",
      name: "Matematica Verde 2",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 14,
      seller: "Un nome lungo",
      conditions: 1,
      office: {
        id: 2,
        name: "Liceo G.S. Orazio",
        address: "via Alberto Savinio 40, Roma"
      }
    },
    {
      id: "6",
      name: "Matematica Verde 1",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 20,
      seller: "Marco",
      conditions: 3,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma"
      }
    },
    {
      id: "7",
      name: "Matematica Verde 2",
      img: "",
      authors: "Alessandro Borghesi, Francesca Maravilla",
      price: 14,
      seller: "Marco",
      conditions: 2,
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma"
      }
    }
  ]
};

export const generateResults = (length, last = true) => {
  let results = [];
  for (let i = 0; i < length; i++) {
    results.push({
      book: {
        author: "autore",
        isbn: "9788808182296",
        subject: {
          _id: 19,
          title: "Fisica"
        },
        title: "Titolo"
      },
      condition: 0,
      description: "Descrizione",
      image_ad: ["http://17029.l.time4vps.cloud/items/4680ccee-5bd.jpg"],
      pk: uuid.v4(),
      price: 10,
      seller: {
        _id: 75,
        adsCreated: 2,
        course: {
          name: "B",
          office: {
            address: "VIA POLLENZA, 115",
            id: 7268,
            name: "J.VON NEUMANN",
            officetype: "SP",
            course: {
              name: "B",
              year: "5"
            }
          },
          year: "5"
        },
        respect: 0,
        usertype: "Free",
        xp: 0,
        user: {
          username: "Username"
        }
      }
    });
  }
  return {
    results,
    resultType: "single",
    last
  };
};

export const singleResults = {
  resultType: "single",
  results: [
    {
      book: {
        author: "Massimo Bergamini",
        classes: [
          {
            office: {
              cap: "00156",
              id: 1,
              level: "SP",
              name: "J. Von Neumann"
            }
          }
        ],
        isbn: "9788808837837",
        title: "Matematica Verde 3"
      },
      condition: 1,
      description: "Ottimo Matemata cnere",
      image_ad: ["matematicaVerde.jpeg"],
      pk: 14,
      price: 12,
      seller: {
        adsCreated: 5,
        classM: {
          office: {
            cap: "00156",
            id: 1,
            level: "SP",
            name: "J. Von Neumann"
          }
        },
        level: "Free",
        user: {
          username: "Test4"
        }
      }
    },
    {
      book: {
        author: "Massimo ASDASD",
        classes: [
          {
            office: {
              cap: "00156",
              id: 1,
              level: "SP",
              name: "J. Von Neumann"
            }
          }
        ],
        isbn: "9788808837831",
        title: "Corsaro Nero"
      },
      condition: 2,
      description: "Ottimo a cnere",
      image_ad: ["CorsaroNero.jpeg"],
      pk: 15,
      price: 11,
      seller: {
        adsCreated: 5,
        classM: {
          office: {
            cap: "00156",
            id: 1,
            level: "SP",
            name: "J. Von Neumann"
          }
        },
        level: "Free",
        user: {
          username: "Test4"
        }
      }
    },
    {
      book: {
        author: "Carlo Luca Laico",
        classes: [
          {
            office: {
              cap: "00156",
              id: 1,
              level: "SP",
              name: "J. Von Neumann"
            }
          }
        ],
        isbn: "9788808837832",
        title: "Guerra Mondiale"
      },
      condition: 3,
      description: "Ottimo a cnere",
      image_ad: ["GuerraMondiale.jpeg"],
      pk: 16,
      price: 11,
      seller: {
        adsCreated: 5,
        classM: {
          office: {
            cap: "00156",
            id: 1,
            level: "SP",
            name: "J. Von Neumann"
          }
        },
        level: "Free",
        user: {
          username: "Test4"
        }
      }
    },
    {
      book: {
        author: "Massimo ASDASD",
        classes: [
          {
            office: {
              cap: "00156",
              id: 1,
              level: "SP",
              name: "J. Von Neumann"
            }
          }
        ],
        isbn: "9788808837834",
        title: "Sezione Aurea"
      },
      condition: 2,
      description: "Ottimo a cnere",
      image_ad: ["sezioneAurea.jpeg"],
      pk: 20,
      price: 50,
      seller: {
        adsCreated: 5,
        classM: {
          office: {
            cap: "00156",
            id: 1,
            level: "SP",
            name: "J. Von Neumann"
          }
        },
        level: "Free",
        user: {
          username: "Test4"
        }
      }
    }
  ]
};
