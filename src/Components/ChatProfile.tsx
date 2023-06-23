import React, { Dispatch, SetStateAction, useContext } from "react";
import { UserData, UserDataType } from "../Context/UserData";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { User, UserType } from "../Context/User";
import CloseIcon from "@mui/icons-material/Close";

interface Info {
  setShow: Dispatch<SetStateAction<Boolean>>;
}

export const ChatProfile = ({ setShow }: Info) => {
  const { chat } = useContext(UserData) as UserDataType;
  const { user } = useContext(User) as UserType;

  return (
    <div style={{ background: "#1a1a1a", height: "100%" }}>
      <Paper
        square
        sx={{
          bgcolor: "#222e35",
          ml: "4px",
          width: "100%",
          color: "white"
        }}
      >
        <Box display="flex" flexDirection="row" width="100%" p={2}>
          <CloseIcon
            onClick={() => setShow(false)}
            sx={{
              cursor: "pointer"
            }}
          />
          <Typography ml={2}>Contact info</Typography>
        </Box>
      </Paper>

      {!chat.userId ? (
        <>
          <Stack
            mb={2}
            py={4}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "white",
              bgcolor: "#111b21"
            }}
          >
            <Avatar
              sx={{ width: 176, height: 176 }}
              alt="chat.displayName"
              src={chat.avatarPath}
            />
            {chat.uid === user.uid && (
              <Typography variant="caption" color="gray" mt={2}>
                (You)
              </Typography>
            )}
            <Typography mt={1} variant="h6">
              {chat.displayName}
            </Typography>
          </Stack>
          <Box
            pl={4}
            py={2}
            sx={{
              bgcolor: "#111b21"
            }}
          >
            <Typography variant="body2" color="gray">
              About
            </Typography>
            <Typography variant="h6">
              {chat.about ? chat.about : "Empty"}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          {chat.uid === user.uid ? (
            <>
              {" "}
              <Stack
                mb={2}
                py={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  bgcolor: "#111b21"
                }}
              >
                <Avatar
                  sx={{ width: 176, height: 176 }}
                  alt="chat.displayName"
                  src={chat.avatarPath}
                />
                {chat.uid === chat.userId && (
                  <Typography variant="caption" color="gray" mt={2}>
                    (You)
                  </Typography>
                )}
                <Typography mt={1} variant="h6">
                  {chat.displayName}
                </Typography>
              </Stack>
              <Box
                pl={4}
                py={2}
                sx={{
                  bgcolor: "#111b21"
                }}
              >
                <Typography variant="body2" color="gray">
                  About
                </Typography>
                <Typography variant="h6">
                  {chat.About ? chat.About : "Empty"}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Stack
                mb={2}
                py={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  bgcolor: "#111b21"
                }}
              >
                <Avatar
                  sx={{ width: 176, height: 176 }}
                  alt="chat.displayname"
                  src={chat.avatarpath}
                />

                <Typography mt={1} variant="h6">
                  {chat.displayname}
                </Typography>
              </Stack>
              <Box
                pl={4}
                py={2}
                sx={{
                  bgcolor: "#111b21"
                }}
              >
                <Typography variant="body2" color="gray">
                  About
                </Typography>
                <Typography variant="h6">
                  {chat.about ? chat.about : "Empty"}
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </div>
  );
};
