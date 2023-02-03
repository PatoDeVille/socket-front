import { io } from "socket.io-client";
import { ChatContextProvider } from "../../contexts/chat-context";
import { getUserToken } from "../../utils/localStorage.utils";
import ChatsList from "./chats-list/chats-list";
import UsersList from "./users-list/users-list";
import styles from "./private-chat-view.module.css";
import PrivateChat from "./private-chat/private-chat";

const token = getUserToken();
const socket = io("http://localhost:3005", {
  path: "/private",
  reconnectionDelayMax: 10000,
  auth: {
    token,
  },
});

const PrivateChatView = () => {
  return (
    <div className={styles.container}>
      <ChatContextProvider>
        <UsersList />
        <ChatsList />
        <PrivateChat socket={socket} />
      </ChatContextProvider>
    </div>
  );
};

export default PrivateChatView;
