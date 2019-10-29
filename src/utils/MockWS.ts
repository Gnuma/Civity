import { Server } from "mock-socket";
import { ___WS_TEST_ENDPOINT } from "../store/endpoints";
import { ResumeMessages } from "../store/chat/types";
import uuid = require("uuid");

class MockServer {
  mockServer?: Server;

  init = () => {
    console.log("aoo");
    this.mockServer = new Server(___WS_TEST_ENDPOINT);
    this.mockServer.on("connection", socket => {
      let id = 0;
      console.log("connected");
      const interval = setInterval(() => {
        const response = { data: "Message id: " + id };
        console.log("Sending: ", response);
        socket.send(JSON.stringify(response));
        id++;
      }, 2000);
      //setTimeout(() => clearInterval(interval), 20000);
    });
  };
}
export default new MockServer();

export const generateMessageResume = (nChats: number): ResumeMessages[] => {
  let data: ResumeMessages[] = [];
  for (let i = 0; i < nChats; i++) {
    let nMessages = Math.floor(Math.random() * 10);
    data.push({
      id: i,
      messages: []
    });
    for (let f = 0; f < nMessages; f++) {
      data[i].messages.push({
        _id: f,
        createdAt: new Date().toString(),
        is_read: false,
        user: {
          _id: 0,
          username: "Io"
        },
        text: "Message: " + f
      });
    }
  }
  return data;
};
