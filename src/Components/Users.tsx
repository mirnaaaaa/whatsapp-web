import React, { useContext } from "react";
import { Paper, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DisplayChatType, DisplayChats } from "../Context/DisplayChats";
import { TheUsers } from "./TheUsers";
import { UsersType } from "../Type/UserType";

interface ShowType {
  setShowContacts: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Users({ setShowContacts }: ShowType) {
  const { users } = useContext(DisplayChats) as DisplayChatType;

  return (
    <Box>
      <Paper
        square
        sx={{
          bgcolor: "#222e35",
          p: "14px",
          display: "flex",
          height: "100%",
          mx: "5px"
        }}
      >
        <ArrowBackIcon
          onClick={() => setShowContacts(false)}
          sx={{ color: "#008069", cursor: "pointer" }}
        />
        <Typography color="white" variant="body1" ml={2}>
          All users
        </Typography>
      </Paper>
      <div>
        {users.map((showUsers: UsersType) => (
          <Box mt={1} display="flex" width="100%" key={showUsers.uid}>
            <TheUsers showUsers={showUsers} />
          </Box>
        ))}
      </div>
    </Box>
  );
}
