import React, { useContext } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { PostType } from "../Context/Posts";
import { Box, Stack, Avatar, Typography } from "@mui/material";
import { updateDoc, doc } from "@firebase/firestore";
import { db } from "../FirebaseConfig";
import { User, UserType } from "../Context/User";



const seenPost = () => {
  updateDoc(doc(db, "Posts"), {
    displayName: true
  });
};

export const AllStatus = ({ post }: StatusProps) => {
  const { user } = useContext(User) as UserType;

  return (
    <Box width="100%">
      {post.uid !== user.uid && (
        <Link to={`/ShowStatus/${post.Id}`} className="linkWhite">
          <Box
            display="flex"
            mx={1}
            py={1.5}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#222e35"
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
