export const itemData = {
  id: "1",
  image_ad: [],
  price: 15,
  condition: 1,
  seller: {
    user: {
      pk: 1,
      username: "Federico",
      fbPoints: 8
    },
    classM: {
      office: {
        id: 1,
        name: "I.I.S.S. J. Von Neumann",
        address: "via Pollenza 156, Roma",
        cap: "00156",
        type: "SP"
      },
      level: "Free",
      adsCreated: 4
    }
  },
  book: {
    title: "Matematica Verde 3",
    author: "Massimiliano Bergamini, Anna Tritone e Graziella Banzoni",
    isbn: "9788804705161",
    subject: "Matematica",
    year: 3,
    classes: []
  },
  description:
    "Libro Matematica Verde 3 venduto praticamente nuovo giusto qualche ammaccatura contattatemi per informazioni e prezzo.",

  comment_ad: [
    {
      pk: 1,
      user: {
        user: {
          username: "Federico",
          fbPoints: 8,
          id: 1
        }
      },
      content:
        "Ciao Gnuma il libro è ancora disponibile? che vuole dire giusto qualche ammaccatura?",
      created: "28/03/2019",
      parent_child: [
        {
          id: 2,
          user: {
            user: {
              username: "Gnuma",
              fbPoints: 10,
              id: 2
            }
          },
          content:
            "Ciao Federico, si il libro è disponibile sempre a 15€, le ammaccature sono qualche pagina  piegata verso la fine del libro, comunque è in ottime condizioni.",
          created: "28/03/2019"
        },
        {
          id: 3,
          user: {
            user: {
              username: "Federico",
              fbPoints: 8,
              id: 1
            }
          },
          content: "Grazie mille non mi interessa più",
          created: "28/03/2019"
        }
      ]
    },
    {
      pk: 4,
      user: {
        user: {
          username: "Arianna",
          fbPoints: 2,
          id: 3
        }
      },
      content: "Ciao, vendi anche a Isa Roma 2? perchè io vengo da li",
      created: "28/03/2019",
      parent_child: []
    }
  ]
};
