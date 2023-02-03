import { useEffect, useState } from "react";
import styles from "./chats-list.module.css";
import { URL } from "../../../utils/constants";
import {
  getUserSession,
  getUserToken,
} from "../../../utils/localStorage.utils";
import { useChatContext } from "../../../contexts/chat-context";

const ChatsList = () => {
  const { setActiveChat, refreshChats, setRefresh, refresh } = useChatContext();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch(URL + "chat", {
      headers: {
        authorization: `Bearer ${getUserToken()}`,
      },
    })
      .then((res) => res.json())
      .then((chts) => {
        const userSession = getUserSession();
        const filteredChats = chts.map((chat) => ({
          ...chat,
          users: chat.users.filter((user) => user._id !== userSession.id),
        }));
        setChats(filteredChats);
      });
  }, [refreshChats]);

  const handleClickChat = (user) => {
    setActiveChat(user);
    setRefresh(!refresh);
  };
  return (
    <div className={styles.container}>
      <h1>chats</h1>
      {chats.map((chat) => (
        <p key={chat._id} onClick={() => handleClickChat(chat)}>
          {chat.users.map((user) => (
            <span key={user._id}>{user.firstName}</span>
          ))}
        </p>
      ))}
    </div>
  );
};

export default ChatsList;
