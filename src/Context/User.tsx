import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ChildrenType {
  children: React.ReactNode;
}
export interface UserType {
  isLoading: boolean;
  docId: any;
  user: any;
  setUser: React.Dispatch<any>;
}
export const User = createContext<UserType | null>(null);

export const UserProvider = ({ children }: ChildrenType) => {
  const [docId, setDocId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(() => {
    const storedValues = localStorage.getItem("user");
    return storedValues ? JSON.parse(storedValues) : [];
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const handle = localStorage.getItem("user");
    if (handle) {
      setUser(JSON.parse(handle));
    }
  }, []);

  useEffect(() => {
    const Auth = onAuthStateChanged(auth, (user) => {
      setDocId(user?.uid);
      setIsLoading(false);
      setUser(user);
    });
    return () => {
      Auth();
    };
  }, []);

  useEffect(() => {
    if (docId) {
      getDoc(doc(db, "users", docId)).then((snap) => {
        setUser(snap.data());
      });
    }
  }, [docId, user]);

  const value = {
    isLoading,
    docId,
    user,
    setUser
  };

  return <User.Provider value={value}>{children}</User.Provider>;
};
