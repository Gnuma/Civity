export default {
  newChat: buyer => `${buyer} vuole iniziare una conversazione`,
  acceptChat: seller => `${seller} ha accettato la conversazione`,
  rejectChat: seller => `${seller} ha accettato la conversazione`,
  sendOffert: (user, amount) => `${user} ha inviato un'offerta di ${amount}.00`,
  acceptOffert: user => `${user} ha accettato l'offerta`,
  rejectOffert: user => `${user} ha rifiutato l'offerta`,
  cancelOffert: user => `${user} ha eliminato l'offerta`,

  completeExchange: user => `${user} ha completato la vendita`,
  sendFeedback: user => `${user} ha lasciato un feedback`,
  blockItem: () => "Il libro è stato eliminato o venduto"
};
