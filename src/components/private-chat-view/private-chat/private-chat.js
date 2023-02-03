import { useEffect, useState } from "react";
import styles from "./private-chat.module.css";
import {
  getUserSession,
  getUserToken,
} from "../../../utils/localStorage.utils";
import { useChatContext } from "../../../contexts/chat-context";

const URL = "http://localhost:3005/message/";

const PrivateChat = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [storedMessages, setStoredMessages] = useState([]);
  const { activeChat, refresh } = useChatContext();

  useEffect(() => {
    socket.connect();
    socket.on("connection", (data) => {
      console.log("Connected");
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // * Fetch messages
  useEffect(() => {
    if (activeChat) {
      fetch(URL + activeChat._id, {
        headers: {
          authorization: `Bearer ${getUserToken()}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const parsed = res.map((mesg) => ({
            ...mesg,
            user:
              mesg.user._id === getUserSession().id
                ? "Yo"
                : mesg.user.firstName,
          }));
          setStoredMessages(parsed);
          setMessages([]);
        });
    }
  }, [activeChat, refresh]);

  useEffect(() => {
    const receivedMessage = (message) => {
      const parsedMessage = {
        ...message,
        user:
          message.user._id === getUserSession().id
            ? "Yo"
            : message.user.firstName,
      };
      setMessages([parsedMessage, ...messages]);
    };

    if (activeChat) {
      socket.emit("join-chat", activeChat._id);
      socket.on("chat-joined", (data) => {
        console.log(`Joined chat: ${data}`);
      });
      socket.on("NEW_MESSAGE", receivedMessage);
    }

    //Desuscribimos el estado del componente cuando ya no es necesario utilizarlo
    return () => {
      socket.off("NEW_MESSAGE", receivedMessage);
    };
  }, [messages, socket, activeChat]);

  //Cargamos los mensajes guardados en la BDD la primera vez

  const handlerSubmit = (e) => {
    //Evitamos recargar la página
    e.preventDefault();

    //Limpiamos el mensaje
    setMessage("");

    //Petición http por POST para guardar el artículo:

    const body = {
      body: message,
    };
    fetch(URL + activeChat._id, {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        authorization: `Bearer ${getUserToken()}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });
  };
  console.debug('activeChat',activeChat);
  return (
    <div className={styles.container}>
      <div className={styles["top-card"]}>
        <h1>
          PRIVATE CHAT with:{" "}
          {activeChat?.users?.map((user) => (
            <span>{user.firstName}</span>
          ))}
        </h1>
        <div className={styles["message-send-row"]}>
          <textarea
            type="text"
            placeholder="message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            resize={false}
          />
          <button className={styles.button} onClick={handlerSubmit}>
            Send
          </button>
        </div>
      </div>

      {/* ------------- WINDOW CHAT ------------- */}

      <div className={styles.window}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles["message-row"]} ${
              message.user === "Yo" ? styles.end : styles.start
            }`}
          >
            <div
              className={`${styles.message} ${
                message.user === "Yo" ? "bg-green" : "bg-gray"
              }`}
            >
              {message.user}: {message.body}
            </div>
          </div>
        ))}

        <h3 className={styles["title-divider"]}>... Mensajes guardados ...</h3>
        {storedMessages.map((message, index) => (
          <div
            key={index}
            className={`${styles["message-row"]} ${
              message.user === "Yo" ? styles.end : styles.start
            }`}
          >
            <div
              className={`${styles.message} ${
                message.user === "Yo"
                  ? styles["bg-self-blue"]
                  : styles["bg-light-blue"]
              }`}
            >
              {message.user}: {message.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivateChat;
