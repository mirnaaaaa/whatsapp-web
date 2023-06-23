import React, { useContext, useState } from "react";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { BsSearch } from "react-icons/bs";
import { UserData, UserDataType } from "../Context/UserData";
import { Box, InputBase, Paper, Stack } from "@mui/material";
import { DisplayChats, DisplayChatType } from "../Context/DisplayChats";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Search() {
  const { setSearchResults, chats, users, searchResults } = useContext(
    DisplayChats
  ) as DisplayChatType;
  const [userName, setUserName] = useState<string | number>();
  const { setUserDetails } = useContext(UserData) as UserDataType;

  const searchUser = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", userName));
    onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((user) => {
        array.push(user.data());
      });
      setUserDetails(array);
    });
    setUserName("");
  };

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && searchUser();
  };

  const handleSearch = (e: any) => {
    if (!e.target.value) return setSearchResults(chats);

    const user = users.filter((chat: any) =>
      chat?.displayName.includes(e.target.value)
    );
    setSearchResults(user);
  };

  const clearSearch = () => setSearchResults(null);

  return (
    <Box mx={3} my={1} sx={{ display: "flex", flexDirection: "column" }}>
      <Paper
        sx={{
          bgcolor: "#222e35",
          ml: "14px",
          display: "flex",
          height: "",
          mr: "2px",
          width: "100%"
        }}
      >
        <Box
          m={1}
          sx={{
            mr: "40px"
          }}
        >
          {searchResults ? (
            <ArrowBackIcon
              onClick={clearSearch}
              sx={{ color: "#008069", cursor: "pointer" }}
            />
          ) : (
            <BsSearch />
          )}
        </Box>
        <Stack sx={{ width: "100%", display: "flex", my: "3px" }}>
          <InputBase
            sx={{ color: "inherit" }}
            placeholder="Search or start a new chat "
            onKeyDown={enter}
            onChange={handleSearch}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
