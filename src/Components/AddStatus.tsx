import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext } from "react";
import { useState } from "react";
import { User, UserType } from "../Context/User";
import { db, storage } from "../FirebaseConfig";
import { Box, Button, TextField, Typography } from "@mui/material";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { useNavigate } from "react-router-dom";

interface ShowType {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddStatus = ({ setShow }: ShowType) => {
  const [text, setText] = useState<number | string>();
  const [photo, setPhoto] = useState<any>(null);
  const { user } = useContext(User) as UserType;

  let navigate = useNavigate();

  const addFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) {
      return;
    }
    setPhoto(e.target.files[0]);
  };

  const addPost = async () => {
    if (text) {
      await addDoc(collection(db, "Posts"), {
        text,
        time: Timestamp.now(),
        name: user.displayName,
        image: user.avatarPath,
        uid: user.uid
      });
      setText("");
      await setDoc(doc(db, "LastPost", user.uid), {
        user: user.uid,
        text,
        time: Timestamp.now()
      });
    }
    if (photo) {
      const name = new Date().getTime() + photo.name;
      const imgRef = ref(storage, `postsPhotos/${name}`);
      await uploadBytesResumable(imgRef, photo).then(() => {
        getDownloadURL(imgRef).then(async (url) => {
          await addDoc(collection(db, "Posts"), {
            photo: url,
            time: Timestamp.now(),
            name: user.displayName,
            image: user.avatarPath,
            uid: user.uid
          });
          await setDoc(doc(db, "LastPost", user.uid), {
            user: user.uid,
            photo: url,
            time: Timestamp.now()
          });
        });
      });

      setPhoto(null);
    }
    setShow(true);
    navigate("/");
  };

  return (
    <Box
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100%"
    >
      <Box width="60%">
        <Typography
          justifyContent="center"
          alignItems="center"
          display="flex"
          mb={2}
        >
          <b>What's in your mind</b>
        </Typography>
        <TextField
          color="success"
          placeholder="Type..."
          name="text"
          value={text}
          sx={{ bgcolor: "#222e35" }}
          fullWidth
          onChange={(e) => setText(e.target.value)}
        />
        <input
          style={{ display: "none" }}
          type="file"
          id="file"
          onChange={addFile}
        />
        <label htmlFor="file">
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            my={2}
          >
            <CollectionsOutlinedIcon
              sx={{ cursor: "pointer" }}
              color="success"
            />
            <Typography variant="body2" ml={1}>
              Tap to add photo
            </Typography>
          </Box>
        </label>
        <Box
          mx={15}
          alignItems="center"
          display="flex"
          sx={{
            height: "50px",
            bgcolor: "#222e35",
            marginTop: "20px"
          }}
        >
          <Button fullWidth onClick={addPost} sx={{ color: "white" }}>
            Post
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
