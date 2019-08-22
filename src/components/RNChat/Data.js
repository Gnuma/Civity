import uuid from 'uuid';

export const User1 = {
  name: 'User1',
  id: 1,
};

export const User2 = {
  name: 'User2',
  id: 2,
};

export const User3 = {
  name: User3,
  id: 3,
};

export const generateMessages = (numMessages, from, to) => {
  let messages = [];
  const firstDay = new Date(from);
  const lastDay = new Date(to);

  for (let i = 1; i <= numMessages; i++) {
    const timestamp = new Date(
      firstDay.getTime() +
        (lastDay.getTime() - firstDay.getTime()) * (i / numMessages),
    );

    messages.unshift({
      id: uuid.v4(),
      timestamp: timestamp.toString(),
      testo: 'Messaggio ' + i,
      user: Math.random() < 0.5 ? User1 : User2,
    });

    if (i % 10 == 0)
      messages.unshift({
        id: uuid.v4(),
        timestamp: timestamp.toString(),
        testo: 'Messaggio ' + i,
        system: true,
      });
  }
  return messages;
};

export const messages = generateMessages(100, '2019-08-10', '2019-08-18');
export const messages2 = generateMessages(100, '2019-08-06', '2019-08-10');
