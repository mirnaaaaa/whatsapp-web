import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { User, UserType } from "../Context/User";
import { db, storage } from "../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  Stack,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

export const Profile = () => {
  const { user, docId } = useContext(User) as UserType;
  const [edit, setEdit] = useState<boolean>(false);
  const [editAbout, setEditAbout] = useState<boolean>(false);
  const [name, setName] = useState<string | number>(user?.displayName);
  const [changeAbout, setChangeAbout] = useState<string | number>(user?.about);
  const [avatar, setAvatar] = useState<File | null>(null);

  const addFile = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) {
      return;
    }
    setAvatar(e.target.files[0]);
  };

  useEffect(() => {
    if (avatar) {
      const uploading = async () => {
        const name = new Date().getTime() + avatar.name;
        const imgRef = ref(storage, `image/${name}`);
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          await uploadBytesResumable(imgRef, avatar).then(() => {
            getDownloadURL(imgRef).then(async (url) => {
              await updateDoc(doc(db, "users", docId), {
                avatarPath: url
              });
            });
          });
          setAvatar(null);
        } catch (err) {
          console.log(err);
        }
      };
      uploading();
    }
  }, [avatar, docId, user.avatarPath]);

  const change = () => {
    if (name) {
      updateDoc(doc(db, "users", docId), {
        displayName: name
      });
      setName("");
      setEdit(false);
    }
    if (changeAbout) {
      updateDoc(doc(db, "users", docId), {
        about: changeAbout
      });
      setChangeAbout("");
      setEditAbout(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {user && (
        <>
          <Stack
            spacing={2}
            sx={{ display: "flex", alignItems: "center", p: "20px" }}
          >
            <input
              required
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={addFile}
            />
            <Tooltip title="Change profile photo">
              <IconButton>
                <label htmlFor="file">
                  <Avatar
                    sx={{ height: "120px", width: "130px", cursor: "pointer" }}
                    alt="user.displayName"
                    src={user.avatarPath}
                  />
                </label>
              </IconButton>
            </Tooltip>
          </Stack>
          <Box m={3} px={6}>
            <Typography variant="body2" sx={{ color: "#008069" }}>
              Your name
            </Typography>
            <Box
              m={1}
              display="flex"
              justifyContent="space-between"
              width="70%"
            >
              {!edit ? (
                <>
                  <Typography>{user.displayName}</Typography>
                  <Tooltip title="Click to edit">
                    <IconButton onClick={() => setEdit(true)}>
                      <EditIcon sx={{ fontSize: "17px", color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Tooltip title="Click to edit">
                    <IconButton onClick={change}>
                      <CheckIcon sx={{ color: "#008069" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
            <Box my={6}>
              <Typography color="gray" variant="caption">
                This is not your username or pin. This name will be visible to
                your WhatsApp contacts
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#008069" }}>
              About
            </Typography>
            <Box
              my={1}
              display="flex"
              justifyContent="space-between"
              width="70%"
            >
              {!editAbout ? (
                <>
                  <Typography>{user?.about || "Busy"}</Typography>
                  <Tooltip title="Click to edit about">
                    <IconButton onClick={() => setEditAbout(true)}>
                      <EditIcon sx={{ fontSize: "17px", color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <input
                    name="changeAbout"
                    value={changeAbout}
                    onChange={(e) => setChangeAbout(e.target.value)}
                  />
                  <Tooltip title="Click to edit">
                    <IconButton onClick={change}>
                      <CheckIcon sx={{ color: "#008069" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
