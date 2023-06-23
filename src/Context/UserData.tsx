import React, { createContext, useEffect, useState } from "react";
import { UsersType } from "../Type/UserType";
import { useNavigate } from "react-router-dom";
import { ChatsType } from "../Type/ChatsType";

interface ChildrenType {
  children: React.ReactNode;
}
export interface UserDataType {
  startChat: (user: UsersType) => void;
  chat: UsersType;
  setChats: React.Dispatch<any>;
  chats: any;
  setUserDetails: React.Dispatch<UsersType[]>;
  userDetails: UsersType[];
}

export const UserData = createContext<UserDataType | null>(null);

export const UserDataProvider = ({ children }: ChildrenType) => {
  const [chat, setChat] = useState<UsersType>(() => {
    const storedValues = localStorage.getItem("chat");
    return storedValues ? JSON.parse(storedValues) : [];
  });
  const [chats, setChats] = useState<ChatsType[]>([]);
  const [userDetails, setUserDetails] = useState<UsersType[]>([]);

  let navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    const handle = localStorage.getItem("chat");
    if (handle) {
      setChat(JSON.parse(handle));
    }
  }, []);

  const startChat = (user: UsersType): void => {
    setChats([]);
    setChat(user);
    navigate("/Chat");
  };

  const value = {
    startChat,
    chat,
    setChats,
    chats,
    setUserDetails,
    userDetails
  };

  return <UserData.Provider value={value}>{children}</UserData.Provider>;
};
