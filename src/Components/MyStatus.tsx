import { Box, Typography, Avatar } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { PostType, Posts, PostsType } from "../Context/Posts";
import { AiFillEye } from "react-icons/ai";
import { query, collection, orderBy, onSnapshot } from "@firebase/firestore";
import { db } from "../FirebaseConfig";
import { Link } from "react-router-dom";
import Moment from "react-moment";

interface StatusProps {
  post: PostType;
}

export const MyStatus = ({ post }: StatusProps) => {
  const { setSeen, seen } = useContext(Posts) as PostsType;

  useEffect(() => {
    const id = post?.Id;
    const q = query(collection(db, `seenPost/${id}/seen`), orderBy("time"));
    const snap = onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((doc) => {
        array.push({ ...doc.data(), Id: doc.id });
      });
      setSeen(array);
    });
    return () => snap();
  }, [post?.Id, setSeen]);

  return (
    <Box display="flex" flexDirection="column" mx={1} alignItems="center">
      <Link to={`/ShowStatus/${post.Id}`} className="linkWhite">
        {post.text ? (
          <Box mx={2}>
            <Avatar sx={{ width: "75px", height: "75px" }}>{post.text}</Avatar>
          </Box>
        ) : (
          <Avatar
            sx={{ width: "75px", height: "75px" }}
            src={post.photo}
            alt="Img"
          />
        )}
      </Link>
      <Box mb={0.5} mt={2} display="flex" alignItems="center">
        <AiFillEye />
        <Typography color="gray" mx={0.5} variant="caption">
          ({seen?.length === 0 ? 0 : seen?.length})
        </Typography>
      </Box>
      <Moment className="last-Post" fromNow>
        {post?.time.toDate()}
      </Moment>
    </Box>
  );
};
