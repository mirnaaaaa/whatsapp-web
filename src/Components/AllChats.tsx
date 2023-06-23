import { onSnapshot, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { User, UserType } from "../Context/User";
import { UserData, UserDataType } from "../Context/UserData";
import { db } from "../FirebaseConfig";
import { ChatsType } from "../Type/ChatsType";
import { UsersType } from "../Type/UserType";
import { Stack, Avatar, Box, Typography, Divider } from "@mui/material";

interface ChatType {
  USER: UsersType;
}

export const AllChats = ({ USER }: ChatType) => {
  const [last, setLast] = useState<ChatsType>();
  const { startChat } = useContext(UserData) as UserDataType;
  const { user } = useContext(User) as UserType;

  const from = user.uid;
  const to: any = user.uid === USER.userId ? USER.uid : USER.userId;
  const id = from > to ? `${from + to}` : `${to + from}`;

  useEffect(() => {
    const snap = onSnapshot(doc(db, `lastMessage/${id}`), (x) => {
      if (x.exists()) {
        const L: any = { ...x.data() };
        setLast(L);
      }
    });
    return () => snap();
  }, [id, last]);

  return (
    <Box width="100%">
      <div onClick={() => startChat(USER)}>
        <div key={USER.combined}>
          <div>
            {USER.uid !== user.uid && USER.userId !== user.uid ? (
              <Divider />
            ) : (
              <Box
                display="flex"
                mx={1}
                p={1}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#222e35"
                  }
                }}
              >
                {USER.uid === user.uid ? (
                  <>
                    <Stack
                      spacing={2}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Avatar alt="USER.displayName" src={USER.avatarPath} />
                    </Stack>
                    <Box width="100%">
                      <Box
                        mx={1}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <Box display="flex">
                          <Typography variant="body1">
                            {USER.displayName}
                          </Typography>
                          {USER.uid === USER.userId && (
                            <Typography
                              sx={{ color: "gray" }}
                              variant="caption"
                              mt={0.4}
                              ml={1}
                            >
                              (You)
                            </Typography>
                          )}
                        </Box>
                        <Moment className="last-messageTime" fromNow>
                          {last?.time.toDate()}
                        </Moment>
                      </Box>
                      <Typography
                        display="flex"
                        ml={1.5}
                        variant="caption"
                        sx={{ color: "gray" }}
                      >
                        {last?.text}
                      </Typography>
                      {last?.photo && (
                        <Typography
                          display="flex"
                          ml={1.5}
                          variant="caption"
                          sx={{ color: "gray" }}
                        >
                          Image
                        </Typography>
                      )}
                      <Divider />
                    </Box>
                  </>
                ) : (
                  <>
                    <Stack
                      spacing={2}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Avatar alt="USER.displayname" src={USER.avatarpath} />
                    </Stack>
                    <Box width="100%">
                      <Box
                        mx={1}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <Typography variant="body1">
                          {USER.displayname}
                        </Typography>
                        <Moment className="last-messageTime" fromNow>
                          {last?.time.toDate()}
                        </Moment>
                      </Box>
                      <Typography
                        display="flex"
                        ml={1.5}
                        variant="caption"
                        sx={{ color: "gray" }}
                      >
                        {last?.text}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        {last?.photo && (
                          <Typography
                            display="flex"
                            ml={1.5}
                            variant="caption"
                            sx={{ color: "gray" }}
                          >
                            Image
                          </Typography>
                        )}
                      </Box>
                      <Divider />
                    </Box>
                  </>
                )}
              </Box>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};
