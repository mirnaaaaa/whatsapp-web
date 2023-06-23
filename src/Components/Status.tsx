import { onSnapshot, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { PostType, Posts, PostsType } from "../Context/Posts";
import { User, UserType } from "../Context/User";
import { db } from "../FirebaseConfig";
import { AllStatus } from "./AllStatus";
import {
  Paper,
  Stack,
  Box,
  Avatar,
  Typography,
  Divider,
  Badge,
  styled
} from "@mui/material";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

export default function Status() {
  const { posts } = useContext(Posts) as PostsType;
  const { user } = useContext(User) as UserType;
  const [lastPost, setLastPost] = useState<PostType>();

  useEffect(() => {
    const snap = onSnapshot(doc(db, `LastPost/${user.uid}`), (x) => {
      if (x.exists()) {
        const L: any = { ...x.data() };
        setLastPost(L);
      }
    });
    return () => snap();
  }, [user.uid, lastPost]);

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    fontSize: 14,
    height: 22
  }));

  return (
    <Box m={1}>
      <Paper
        square
        sx={{
          bgcolor: "#222e35",
          ml: "14px",
          display: "flex",
          height: "100%",
          mr: "2px"
        }}
      >
        <Stack sx={{ width: "100%", m: "8px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Stack>
              {lastPost ? (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    lastPost?.photo ? (
                      <SmallAvatar alt="Your status" src={lastPost.photo} />
                    ) : (
                      <SmallAvatar alt="Your status">
                        {lastPost.text}
                      </SmallAvatar>
                    )
                  }
                >
                  <Avatar alt={user.Name} src={user.avatarPath} />
                </Badge>
              ) : (
                <Avatar alt={user.Name} src={user.avatarPath} />
              )}
            </Stack>
            <Box
              mt={0.5}
              ml={2}
              display="flex"
              flexDirection="column"
              width="100%"
            >
              <Typography color="white" variant="body1">
                My status
              </Typography>
              {lastPost ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mr={2}
                  mt={-1}
                >
                  <Box>
                    <Moment className="last-Post" fromNow>
                      {lastPost?.time.toDate()}
                    </Moment>
                  </Box>
                  <Link to="/AddStatus" className="link">
                    <CreateOutlinedIcon sx={{ color: "#008069" }} />
                  </Link>
                </Box>
              ) : (
                <Link to="/AddStatus" className="link">
                  <Typography
                    mt={-0.5}
                    sx={{ color: "gray" }}
                    variant="caption"
                  >
                    Add Status
                  </Typography>
                </Link>
              )}
            </Box>
          </Box>
        </Stack>
      </Paper>
      <Divider />
      <Typography variant="body2" m={1.5}>
        RECENT
      </Typography>
      {posts?.map((post) => (
        <Box key={post.Id} display="flex" width="100%">
          <AllStatus post={post} />
        </Box>
      ))}
    </Box>
  );
}
