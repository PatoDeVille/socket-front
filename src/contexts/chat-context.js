import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const { children } = props;
  // Para refrescar la ventana de chats
  const [refresh, setRefresh] = useState(true);
  // para refrescar la lista de chats
  const [refreshChats, setRefreshChats] = useState(true);
  // para cargar de manera dinámica el chat que toca
  const [activeChat, setActiveChat] = useState("");

  return (
    <ChatContext.Provider
      value={{
        refresh,
        setRefresh,
        refreshChats,
        setRefreshChats,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
