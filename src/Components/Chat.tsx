import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { User, UserType } from "../Context/User";
import { UserData, UserDataType } from "../Context/UserData";
import { db, storage } from "../FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Messages } from "./Messages";
import { ChatsType } from "./../Type/ChatsType";
import {
  Avatar,
  Box,
  Grid,
  Input,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { ChatProfile } from "./ChatProfile";

export default function Chat() {
  const [text, setText] = useState<string | number>("");
  const [photo, setPhoto] = useState<File | undefined>();
  const { setChats, chats, chat } = useContext(UserData) as UserDataType;
  const { user } = useContext(User) as UserType;
  const [show, setShow] = useState<Boolean>(false);

  const addFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) {
      return;
    }
    setPhoto(e.target.files[0]);
  };

  const from = user.uid;
  const to: any =
    (!chat.userId && chat.uid) || user.uid === chat.userId
      ? chat.uid
      : chat.userId;
  const id = from > to ? `${from + to}` : `${to + from}`;

  const ariaLabel = { "aria-label": "description" };

  const sendMessage = async () => {
    if (text) {
      const get = await getDoc(doc(db, "chat", id));
      if (get.exists()) {
        await addDoc(collection(db, "chats", id, "messages"), {
          text,
          from: user.uid,
          to: chat.uid,
          time: Timestamp.now(),
          Id: id
        });
        await setDoc(doc(db, "lastMessage", id), {
          text,
          from: user.uid,
          to: chat.uid,
          time: Timestamp.now()
        });
      }
      if (!get.exists()) {
        await setDoc(doc(db, "chat", id), {
          displayName: user?.displayName,
          avatarPath: user?.avatarPath,
          userId: user.uid,
          uid: chat?.uid,
          displayname: chat?.displayName,
          avatarpath: chat?.avatarPath,
          combined: id,
          time: serverTimestamp(),
          About: user.about ? user.about : "",
          about: chat?.about ? chat?.about : ""
        });
        await addDoc(collection(db, "chats", id, "messages"), {
          text,
          from: user.uid,
          to: chat.uid,
          time: Timestamp.now(),
          Id: id
        });
        await setDoc(doc(db, "lastMessage", id), {
          text,
          from: user.uid,
          to: chat.uid,
          time: Timestamp.now()
        });
      }
      setText("");
    }
    if (photo) {
      const name = new Date().getTime() + photo.name;
      const imgRef = ref(storage, `photos/${name}`);
      await uploadBytesResumable(imgRef, photo).then(() => {
        getDownloadURL(imgRef).then(async (url) => {
          const get = await getDoc(doc(db, "chat", id));
          if (get.exists()) {
            await addDoc(collection(db, "chats", id, "messages"), {
              photo: url,
              from: user.uid,
              to: chat.uid,
              time: Timestamp.now(),
              Id: id
            });
            await setDoc(doc(db, "lastMessage", id), {
              photo: url,
              from: user.uid,
              to: chat.uid,
              time: Timestamp.now()
            });
          }
          if (!get.exists()) {
            await setDoc(doc(db, "chat", id), {
              displayName: user?.displayName,
              avatarPath: user?.avatarPath,
              userId: user.uid,
              uid: chat?.uid,
              displayname: chat?.displayName,
              avatarpath: chat?.avatarPath,
              combined: id,
              userAbout: user?.about,
              chatAbout: chat?.about,
              time: serverTimestamp(),
              about: user.about ? user.about : "",
              About: chat?.about ? chat?.about : ""
            });
            await addDoc(collection(db, "chats", id, "messages"), {
              photo: url,
              from: user.uid,
              to: chat.uid,
              time: Timestamp.now(),
              Id: id
            });
            await setDoc(doc(db, "lastMessage", id), {
              photo: url,
              from: user.uid,
              to: chat.uid,
              time: Timestamp.now()
            });
          }
        });
      });
      setPhoto(undefined);
    }
  };

  useEffect(() => {
    const q = query(collection(db, `chats/${id}/messages`), orderBy("time"));
    const snap = onSnapshot(q, (snap) => {
      let array: any = [];
      snap.forEach((doc) => {
        array.push({ ...doc.data(), Id: doc.id });
      });
      setChats(array);
    });
    return () => snap();
  }, [id, setChats]);

  const sent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && sendMessage();
  };

  return (
    <Grid container>
      <Grid item xs={show ? 8 : 16}>
        <Paper
          square
          sx={{
            bgcolor: "#222e35",
            display: "flex",
            flexDirection: "row",
            mr: "2px",
            width: "100%"
          }}
        >
          {chat && (
            <Box
              key={chat.uid}
              width="100%"
              m={1}
              onClick={() => setShow(true)}
              sx={{ cursor: "pointer" }}
            >
              {chat.userId === user.uid ? (
                <Box display="flex" flexDirection="row">
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      color: "white"
                    }}
                  >
                    <Avatar alt="chat.displayname" src={chat.avatarpath} />
                    <Typography ml={1} variant="h6">
                      {chat.displayname}
                    </Typography>
                    {user.uid === chat.uid && (
                      <Typography variant="caption" ml={1} mt={0.5}>
                        (Message yourself)
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Box display="flex" sx={{ flexDirection: "row" }}>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <Avatar alt="chat.displayname" src={chat.avatarPath} />
                    <Typography ml={1} variant="h6">
                      {chat.displayName}
                    </Typography>
                    {!chat.userId && chat.uid === user.uid && (
                      <Typography variant="caption" ml={1} mt={0.5}>
                        (Message yourself)
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
        </Paper>
        <div className="conversation">
        <Box m={2}>

          {chats &&
            chats.map((message: ChatsType) => (
              <div key={message.Id}>
                <Messages message={message} />
              </div>
            ))}
                    </Box>

        </div>
       
        <Box bgcolor="#222e35" px={8} display="flex" width="100%">
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={addFile}
          />
          <Box mt="17px" mr="10px">
            <Tooltip title="Attach photo">
              <label htmlFor="file">
                <InsertLinkIcon sx={{ cursor: "pointer" }} />
              </label>
            </Tooltip>
          </Box>
          <Box
            sx={{
              "& > :not(style)": { m: 1 },
              width: "100%"
            }}
          >
            <Input
              inputProps={ariaLabel}
              sx={{ bgcolor: "#2a3942", p: "6px" }}
              placeholder={photo ? "Sent photo" : "Type a message"}
              value={text}
              name="text"
              onKeyDown={sent}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              color="success"
            />
          </Box>
        </Box>
      </Grid>
      {show && (
        <Grid item xs={4}>
          <ChatProfile setShow={setShow} />
        </Grid>
      )}
    </Grid>
  );
}
