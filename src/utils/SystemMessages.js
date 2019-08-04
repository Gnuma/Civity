export default {
  acceptChat: user => `${user} ha accettato la chat`,
  rejectChat: user => `${user} ha rifiutato la chat`,
  sendOffert: (user, amount) =>
    `${user} ha offerto EUR ${amount}.00 per il libro`,
  acceptOffert: user => `${user} ha accettato l'offerta`,
  rejectOffert: user => `${user} ha rifiutato l'offerta`,
  cancelOffert: user => `${user} ha cancellato l'offerta`,
  completeExchange: user =>
    `${user} ha segnalato di aver completato lo scambio`,
  sendFeedback: (user, feedbackType) =>
    `${user} ha lasciato un feedback ${feedbackType}`,
  blockItem: () => "Il libro è stato eliminato o venduto"
};
