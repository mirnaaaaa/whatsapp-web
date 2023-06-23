import React, { createContext, useEffect, useState } from "react";
import { UsersType } from './../Type/UserType';
import { query, collection, orderBy, onSnapshot } from "@firebase/firestore";
import { db } from "../FirebaseConfig";

export interface DisplayChatType {
  chats: any;
  setChats: React.Dispatch<any>;
  setSearchResults: React.Dispatch<any>;
  searchResults: any;
  users: any;
}

export const DisplayChats = createContext<DisplayChatType | null>(null);

interface ChildrenType {
  children: React.ReactNode;
}

export const DisplayChatsProvider = ({ children }: ChildrenType) => {
  const [chats, setChats] = useState<UsersType[]>();
  const [searchResults, setSearchResults] = useState<any>(null)
  const [users, setUsers] = useState<UsersType[]>([]);


  useEffect(() => {
    const q = query(collection(db, `chat`)
    , orderBy("time", "desc")
    );
    const getUsers = onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((user) => {
        array.push(user.data());
      });
      setChats(array);
    });
    return () => getUsers(); 
  
  }, [setChats]);
  
  useEffect(() => {
    const usersRef = collection(db, "users");
    const getUser = onSnapshot(usersRef, (snap) => {
      let array: any = [];
      snap.forEach((user) => {
        array.push(user.data());
      });
      setUsers(array);
    });
    // }

    return () => getUser();
  
  }, []);

  

  const value = {
    chats,
    setChats,
    searchResults,
    setSearchResults,
    users
  };

  return <DisplayChats.Provider value={value}>{children}</DisplayChats.Provider>;
};
