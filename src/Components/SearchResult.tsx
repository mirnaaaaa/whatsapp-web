import React, { useContext } from "react";
import { Typography, Box } from "@mui/material";
import { DisplayChats, DisplayChatType } from "../Context/DisplayChats";
import { EachUser } from "./EachUser";

export const SearchResult = () => {
  const { searchResults } = useContext(DisplayChats) as DisplayChatType;

  const result = searchResults?.map((chat: any) => <EachUser chat={chat} />);

  const contact = result?.length ? (
    result
  ) : (
    <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
      <Typography variant="h5">No contacts found </Typography>
    </Box>
  );

  return <Box mt={2}>{contact}</Box>;
};
