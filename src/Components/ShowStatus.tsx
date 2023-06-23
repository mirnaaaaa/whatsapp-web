import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Posts, PostsType } from "../Context/Posts";
import { PostType } from "../Context/Posts";
import Moment from "react-moment";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { User, UserType } from "../Context/User";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Input,
  IconButton,
  Menu,
  Tooltip
} from "@mui/material";
import { UserData, UserDataType } from "../Context/UserData";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { AiFillEye } from "react-icons/ai";
import { SeenStatus } from "./SeenStatus";

interface ShowType {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowStatus = ({ setShow }: ShowType) => {
  const [post, setPost] = useState<PostType>();
  const { posts, replyStatus, seen } = useContext(Posts) as PostsType;
  const { docId, user } = useContext(User) as UserType;
  const { chat, setChats } = useContext(UserData) as UserDataType;
  const [text, setText] = useState<string | number>("");
  const [click, setClick] = useState<null | HTMLElement>(null);

  const open = Boolean(click);
  const { Id } = useParams();
  let navigate = useNavigate();

  const handleClose = () => {
    setClick(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setClick(event.currentTarget);
  };

  useEffect(() => {
    const correct = posts?.find((x) => x.Id === Id);
    if (correct) {
      setPost(correct);
    }
    if (!text) {
      setTimeout(() => {
        navigate("/");
      }, 60000);
    }
  }, [Id, posts, docId, navigate, text, replyStatus]);

  const sendMessage = async () => {
    const from = user.uid;
    const to: any = post?.uid;
    const id = from > to ? `${from + to}` : `${to + from}`;

    if (text) {
      const get = await getDoc(doc(db, "chat", id));
      if (get.exists()) {
        await addDoc(collection(db, "chats", id, "messages"), {
          text,
          from: user.uid,
          to: post?.uid,
          time: Timestamp.now(),
          Id: id,
          post: post?.text ? post.text : post?.photo,
          postId: post?.Id
        });
        await setDoc(doc(db, "lastMessage", id), {
          text,
          from: user.uid,
          to: post?.uid,
          time: Timestamp.now()
        });
      }
      if (!get.exists()) {
        await setDoc(doc(db, "chat", id), {
          displayName: user?.displayName,
          avatarPath: user?.avatarPath,
          userId: user.uid,
          uid: post?.uid,
          displayname: post?.name,
          avatarpath: post?.image,
          combined: id,
          time: serverTimestamp(),
          post: post?.text ? post.text : post?.photo,
          About: user.about ? user.about : "",
          about: chat?.about ? chat?.about : "",
          postId: post?.Id
        });
        await addDoc(collection(db, "chats", id, "messages"), {
          text,
          from: user.uid,
          to: post?.uid,
          time: Timestamp.now(),
          Id: id,
          post: post?.text ? post.text : post?.photo,
          postId: post?.Id
        });
        await setDoc(doc(db, "lastMessage", id), {
          text,
          from: user.uid,
          to: post?.uid,
          time: Timestamp.now()
        });
      }
      setText("");
    }
  };

  useEffect(() => {
    const Seen = async () => {
      const id = post?.Id;
      const userUid = user.uid;
      const ID = id > userUid ? `${id + userUid}` : `${userUid + id}`;
      const get = await getDoc(doc(db, "seenPost", id, "seen", ID));
      if (get.exists()) return;
      if (post && post.uid !== user.uid) {
        await setDoc(doc(db, "seenPost", id, "seen", ID), {
          name: user.displayName,
          Id: post?.Id,
          uid: user.uid,
          photo: user.avatarPath,
          time: Timestamp.now(),
          ID
        });
      }
    };
    Seen();
  }, [post, user.avatarPath, user.displayName, user.uid]);

  const replayOnStatus = () => {
    setShow(false);
    navigate("/Chat");
    sendMessage();
    setChats([]);
  };

  return (
    <div className="addStatusDiv">
      {post && (
        <>
          <div>
            <Box
              display="flex"
              mx={1}
              py={1.5}
              sx={{
                cursor: "pointer"
              }}
            >
              <Stack
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Avatar alt="USER.displayName" src={post.image} />
              </Stack>
              <Box width="100%">
                <Box
                  mx={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {post.uid === user.uid ? (
                      <Typography
                        sx={{ color: "gray" }}
                        variant="caption"
                        ml={1}
                        my={0.5}
                      >
                        (You)
                      </Typography>
                    ) : (
                      <Typography variant="h6">{post.name}</Typography>
                    )}
                  </Box>

                  <Moment className="last-postTime" fromNow>
                    {post.time.toDate()}
                  </Moment>
                </Box>
              </Box>
            </Box>
          </div>
          <Box
            bgcolor="#222e35"
            p={8}
            m={6}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            {post.text && <Typography variant="h2">{post.text}</Typography>}
            {post.photo && (
              <Avatar
                variant="square"
                src={post.photo}
                alt="Img"
                sx={{ width: 300, height: 300 }}
              />
            )}
            {post.uid !== user.uid ? (
              <Box width="100%" mt={4} display="flex">
                <Input
                  sx={{ bgcolor: "#2a3942", p: "6px" }}
                  placeholder="Type a replay..."
                  value={text}
                  name="replay"
                  onChange={(e) => setText(e.target.value)}
                  fullWidth
                  color="success"
                />
                <IconButton onClick={replayOnStatus} aria-label="Sent Reply">
                  <SendOutlinedIcon
                    sx={{
                      mx: "4px",
                      color: "white",
                      "&:hover": {
                        color: "#008069"
                      }
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <Box
                mt={10}
                display="flex"
                alignItems="center"
                sx={{ curser: "pointer" }}
              >
                <Tooltip title="Show" sx={{ color: "white" }}>
                  <IconButton
                    aria-controls={open ? "menu" : undefined}
                    id="button"
                    onClick={handleClick}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <AiFillEye />
                    <Typography color="gray" mx={0.5} variant="caption">
                      ({seen?.length === 0 ? 0 : seen?.length})
                    </Typography>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="Show"
                  anchorEl={click}
                  open={open}
                  MenuListProps={{
                    "aria-labelledby": "button"
                  }}
                  onClick={handleClose}
                >
                  {seen?.length === 0 && (
                    <Typography m={2} variant="body2">
                      No views yet
                    </Typography>
                  )}
                  {seen?.length !== 0 &&
                    seen?.map((view: PostType) => (
                      <Box display="flex" flexDirection="column">
                        <SeenStatus view={view} />
                      </Box>
                    ))}
                </Menu>
              </Box>
            )}
          </Box>
        </>
      )}
    </div>
  );
};
