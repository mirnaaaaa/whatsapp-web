import React, { useContext } from "react";
import { AllChats } from "./AllChats";
import { UsersType } from "./../Type/UserType";
import { Box, Typography } from "@mui/material";
import { DisplayChatType, DisplayChats } from "../Context/DisplayChats";

export const Chats = () => {
  const { chats } = useContext(DisplayChats) as DisplayChatType;

  return (
    <Box>
      <Box  mt={3} sx={{display: "flex", justifyContent:"center" }}>
        {chats?.length === 0 && (
          <Typography variant="h5">No chats yet</Typography>
          
        )}
              </Box>

        {chats &&
          chats.map((USER: UsersType) => (
            <Box key={USER.combined} display="flex" width="100%">
              <AllChats USER={USER} />
            </Box>
          ))}
    </Box>
  );
};
