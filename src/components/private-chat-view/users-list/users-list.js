import { useEffect, useState } from "react";
import styles from "./users-list.module.css";
import { URL } from "../../../utils/constants";
import { useChatContext } from "../../../contexts/chat-context";
import {
  getUserSession,
  getUserToken,
} from "../../../utils/localStorage.utils";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { setRefreshChats, refreshChats } = useChatContext();
  useEffect(() => {
    fetch(URL + "user")
      .then((res) => res.json())
      .then((availableUsers) => {
        const userId = getUserSession().id;

        const usersWithoutMe = availableUsers.filter(
          (user) => user._id !== userId
        );

        setUsers(usersWithoutMe);
      });
  }, []);

  const handleClickUser = (user) => {
    const body = { chatMembers: [user._id] };
    fetch(URL + "chat", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        authorization: `Bearer ${getUserToken()}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => {
        setRefreshChats(!refreshChats);
      });
  };

  return (
    <div className={styles.container}>
      <h1>Available users</h1>

      {users?.map((user) => (
        <p key={user._id} onClick={() => handleClickUser(user)}>
          {user.firstName}
        </p>
      ))}
    </div>
  );
};

export default UsersList;
