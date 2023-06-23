import React, { useContext } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { PostType } from "../Context/Posts";
import { Box, Stack, Avatar, Typography } from "@mui/material";
import { updateDoc, doc } from "@firebase/firestore";
import { db } from "../FirebaseConfig";
import { User, UserType } from "../Context/User";

interface StatusProps {
  post: PostType;
}

const seenPost = () => {
  updateDoc(doc(db, "Posts"), {
    displayName: true
  });
};

export const AllStatus = ({ post }: StatusProps) => {
  const { user } = useContext(User) as UserType;

  return (
    <Box mx={1} width="100%" sx={{ bgcolor: "#222e35" }}>
      {post.uid !== user.uid && (
        <Link to={`/ShowStatus/${post.Id}`} className="linkWhite">
          <Box
            display="flex"
            m={0.5}
            p={1}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2a3942"
              }
            }}
            onClick={seenPost}
          >
            <Stack
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {post.text ? (
                <Avatar>{post.text}</Avatar>
              ) : (
                <Avatar src={post.photo} alt="Img" />
              )}
            </Stack>
            <Box width="100%">
              <Box
                mx={2}
                sx={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography variant="h6">{post.name}</Typography>
                <Moment className="last-postTime" fromNow>
                  {post.time.toDate()}
                </Moment>
              </Box>
            </Box>
          </Box>
        </Link>
      )}
    </Box>
  );
};
