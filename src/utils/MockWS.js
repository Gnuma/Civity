import { Server } from "mock-socket";
import { ___WS_TEST_ENDPOINT } from "../store/endpoints";
import {
  newSellerMsg,
  newBuyerMsg,
  newChat,
  newChat2
} from "../mockData/Chat2";
import { comment } from "../mockData/comments";

const mockServer = new Server(___WS_TEST_ENDPOINT);

mockServer.on("connection", socket => {
  //socket.send(JSON.stringify(newChat));
  setInterval(() => {
    //socket.send(JSON.stringify(newBuyerMsg));
  }, 2000);
  setTimeout(() => {
    socket.send(JSON.stringify(newChat));
    socket.send(JSON.stringify(newChat2));
  }, 100);
  //socket.send(JSON.stringify(newSellerMsg));
  //socket.send(JSON.stringify(comment));
});
