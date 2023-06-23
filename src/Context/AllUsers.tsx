import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../FirebaseConfig";
import { collection, onSnapshot, query } from "firebase/firestore";
import { UsersType } from "../Type/UserType";
interface ChildrenType {
  children: React.ReactNode;
}
export interface AllUsersType {
  users: UsersType[];
}

export const AllUsers = createContext<AllUsersType | null>(null);

export const AllUsersProvider = ({ children }: ChildrenType) => {
  const [users, setUsers] = useState<UsersType[]>([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef
      //, where("uid", "not-in", [auth.currentUser?.uid])
    );
    const getUsers = onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((user) => {
        array.push(user.data());
      });
      setUsers(array);
    });
    return () => {
      auth.currentUser?.uid && getUsers();
    };
  }, []);

  const value = {
    users
  };

  return <AllUsers.Provider value={value}>{children}</AllUsers.Provider>;
};
