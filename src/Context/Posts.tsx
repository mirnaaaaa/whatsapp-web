/* eslint-disable react-hooks/exhaustive-deps */
import { query, collection, orderBy, onSnapshot } from "@firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { db } from "../FirebaseConfig";

interface ChildrenType {
  children: React.ReactNode;
}

export interface PostType {
  text?: number | string;
  photo: any;
  image?: string;
  name: number | string;
  time: string | number | any;
  Id: any;
  uid: number | string;
  ID?: number | string;
}

export interface PostsType {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  replyStatus: any;
  setReplyStatus: React.Dispatch<any>;
  setSeen: React.Dispatch<React.SetStateAction<PostType[] | undefined>>;
  seen: PostType[] | undefined;

}
export const Posts = createContext<PostsType | null>(null);

export const PostsProvider = ({ children }: ChildrenType) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [replyStatus, setReplyStatus] = useState<any>();
  const [seen, setSeen] = useState<PostType[]>();
  
  useEffect(() => {
    const q = query(collection(db, `Posts`), orderBy("time", "asc"));
    const update = onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((doc) => {
        array.push({ ...doc.data(), Id: doc.id });
      });
      setPosts(array);
    });
    return () => update();
  }, [setPosts]);

  const value = {
    posts,
    setPosts,
    replyStatus,
    setReplyStatus,
    seen,
    setSeen
  };

  return <Posts.Provider value={value}>{children}</Posts.Provider>;
};
