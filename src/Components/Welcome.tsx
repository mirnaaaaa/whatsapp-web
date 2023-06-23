import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserType } from "../Context/User";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import { Posts, PostsType } from "../Context/Posts";
import { MyStatus } from "./MyStatus";

interface ShowType {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Welcome = ({ show, setShow }: ShowType) => {
  const { docId, user } = useContext(User) as UserType;
  const [upload, setUpload] = useState<Boolean>(false);
  const { posts } = useContext(Posts) as PostsType;

  let navigate = useNavigate();

  useEffect(() => {
    const correct = posts.find((x) => x.uid === user.uid);
    if (correct) {
      setUpload(true);
    }
  }, [user, posts]);

  useEffect(() => {
    if (!docId) {
      navigate("/Login");
    }
  }, [docId, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        color: "gray"
      }}
    >
      {!show ? (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Typography variant="h6" mb={2}>
            Send and receive messages without keeping your phone online.
          </Typography>
          <WhatsAppIcon sx={{ color: "white" }} />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center "
        >
          <Box>
            <DonutLargeIcon sx={{ mt: "90px", fontSize: "90px" }} />
            <CloseIcon
              onClick={() => setShow(false)}
              sx={{
                cursor: "pointer",
                position: "absolute",
                right: "0",
                mr: "20px",
                color: "white"
              }}
            />
          </Box>
          {upload ? (
            <>
              <Typography my={10}>View your updates</Typography>
              <Box display="flex" flexDirection="row">
                {posts?.map(
                  (post) => post.uid === user.uid && <MyStatus post={post} />
                )}
              </Box>
            </>
          ) : (
            <Typography variant="h6" mt={15}>
              Click on a contact to view their status updates
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
