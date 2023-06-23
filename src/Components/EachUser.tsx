import React, { useContext } from "react";
import { UsersType } from "../Type/UserType";
import { UserData } from "../Context/UserData";
import { UserDataType } from "../Context/UserData";
import { Box, Stack, Avatar, Typography, Divider } from "@mui/material";
import { DisplayChats, DisplayChatType } from "../Context/DisplayChats";

interface PostsProps {
  chat: UsersType;
}

export const EachUser = ({ chat }: PostsProps) => {
  const { startChat } = useContext(UserData) as UserDataType;
  const { setSearchResults } = useContext(DisplayChats) as DisplayChatType;

  return (
    <Box m={1} onClick={() => setSearchResults(null)}>
      <Box
        display="flex"
        width="100%"
        onClick={() => startChat(chat)}
        p={1}
        sx={{
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#222e35"
          }
        }}
      >
        <Stack spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar alt="chat?.displayName" src={chat?.avatarPath} />
        </Stack>
        <Typography ml={1} mt={1} variant="body1">
          {chat?.displayName}
        </Typography>
      </Box>
      <Divider />
    </Box>
  );
};
