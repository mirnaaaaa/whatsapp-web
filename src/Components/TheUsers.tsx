import React, { useContext } from "react";
import { User, UserType } from "../Context/User";
import { UsersType } from "../Type/UserType";
import { Box, Stack, Avatar, Typography, Divider } from "@mui/material";
import { UserData, UserDataType } from "../Context/UserData";

interface Type {
  showUsers: UsersType;
}

export const TheUsers = ({ showUsers }: Type) => {
  const { user } = useContext(User) as UserType;
  const { startChat } = useContext(UserData) as UserDataType;

  return (
    <Box
      onClick={() => startChat(showUsers)}
      width="100%"
      display="flex"
      mx={1}
      py={1.5}
      sx={{
        cursor: "pointer",
        "&:hover": {
          bgcolor: "#222e35"
        }
      }}
    >
      <Stack spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar alt="USER.displayName" src={showUsers.avatarPath} />
      </Stack>
      <Box width="100%" mx={2}>
        <Box
          sx={{
            display: "flex"
          }}
        >
          <Typography variant="body1">{showUsers.displayName}</Typography>
          {showUsers.uid === user.uid && (
            <Typography ml={1} mt={0.3} variant="caption">
              (You)
            </Typography>
          )}
        </Box>
        <Typography color="gray" variant="caption" mt={-0.5} display="flex">
          {showUsers.about}
        </Typography>
      </Box>
      <Divider />
    </Box>
  );
};
