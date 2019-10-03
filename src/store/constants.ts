export const ___SERVER_ENDPOINT___ = "http://176.223.136.43:8000/";
//export const ___SERVER_ENDPOINT___ = "http://17029.l.time4vps.cloud/";
export const ___BASE_ENDPOINT___ = ___SERVER_ENDPOINT___ + "gnuma/v1/";

export const ___WS_ENDPOINT___ = "ws://176.223.136.43:8000/" + "ws/chat/";
export const ___WS_TEST_ENDPOINT = "ws://192.168.178.104:1234";

export const ___AD_SEARCH_ENDPOINT___ =
  ___SERVER_ENDPOINT___ + "search/books/search/";

export const ___BOOK_HINTS_ENDPOINT___ =
  ___SERVER_ENDPOINT___ + "search/books/hint/";
export const ___OFFICE_HINTS_ENDPOINT___ =
  ___SERVER_ENDPOINT___ + "search/offices/hint/";
export const ___COURSE_HINTS_ENDPOINT___ =
  ___SERVER_ENDPOINT___ + "search/courses/hint/";
export const ___SUBJECT_HINTS_ENDPOINT___ =
  ___SERVER_ENDPOINT___ + "search/subjects/hint/";

export const ___LOGIN_ENDPOINT___ = ___BASE_ENDPOINT___ + "auth/login/";
export const ___LOGOUT_ENDPOINT___ = ___BASE_ENDPOINT___ + "logout/";
export const ___SIGNUP_ENDPOINT___ = ___BASE_ENDPOINT___ + "auth/registration/";
export const ___WHOAMI_ENDPOINT___ = ___BASE_ENDPOINT___ + "whoami/";
export const ___INITUSER_ENDPOINT___ = ___BASE_ENDPOINT___ + "init/";
export const ___VALIDATE_USER___ = ___BASE_ENDPOINT___ + "verify/";
export const ___SEND_VALIDATION___ = ___BASE_ENDPOINT___ + "send/";
export const ___MODIFY_USER___ = ___BASE_ENDPOINT___ + "change/";
export const ___OFFICE_CHANGE___ = ___BASE_ENDPOINT___ + "office/change/";

export const ___CREATE_BOOK___ = ___BASE_ENDPOINT___ + "books/";
export const ___CREATE_AD___ = ___BASE_ENDPOINT___ + "ads/";
export const ___BASE_UPLOAD_PICTURE___ = ___BASE_ENDPOINT___ + "ads/upload/";
export const ___GET_AD___ = ___BASE_ENDPOINT___ + "ads/";
export const ___MODIFY_AD___ = ___BASE_ENDPOINT___ + "ads/modify/";
export const ___DELTE_AD___ = ___BASE_ENDPOINT___ + "ads/delete/";
export const ___REPORT_AD___ = ___BASE_ENDPOINT___ + "ads/report/";

export const ___CREATE_COMMENT___ = ___BASE_ENDPOINT___ + "comments/";

export const ___RETRIEVE_CHATS___ = ___BASE_ENDPOINT___ + "chat/operations/";
export const ___SEND_MESSAGE___ = ___BASE_ENDPOINT___ + "chat/operations/";
export const ___READ_CHAT___ =
  ___BASE_ENDPOINT___ + "chat/operations/readMessages/";
export const ___LOAD_EARLIER_CHAT___ =
  ___BASE_ENDPOINT___ + "chat/retrievePage/";

export const ___CONTACT_USER___ = ___BASE_ENDPOINT___ + "chat/";
export const ___REQUEST_CONTACT___ = ___BASE_ENDPOINT___ + "chat/confirmChat/";
export const ___ACCEPT_CHAT___ = ___BASE_ENDPOINT___ + "chat/accept/";
export const ___REJECT_CHAT___ = ___BASE_ENDPOINT___ + "chat/reject/";

export const ___CREATE_OFFERT___ =
  ___BASE_ENDPOINT___ + "chat/operations/createOffert/";
export const ___ACCEPT_OFFERT___ =
  ___BASE_ENDPOINT___ + "chat/operations/acceptOffert/";
export const ___REJECT_OFFERT___ =
  ___BASE_ENDPOINT___ + "chat/operations/rejectOffert/";
export const ____CANCEL_OFFERT___ =
  ___BASE_ENDPOINT___ + "chat/operations/deleteOffert/";
export const ___COMPLETE_EXCHANGE___ =
  ___BASE_ENDPOINT___ + "chat/operations/complete/";
export const ___SEND_FEEDBACK___ = ___BASE_ENDPOINT___ + "chat/feedback/";

export const ___CHECK_USERNAME___ = ___BASE_ENDPOINT___ + "verify/username/";
export const ___CHECK_EMAIL___ = ___BASE_ENDPOINT___ + "verify/email/";
export const ___CHECK_PHONE___ = ___BASE_ENDPOINT___ + "verify/phone/";

export const ___UPDATE_FCM___ = ___BASE_ENDPOINT___ + "fcm/change/";
