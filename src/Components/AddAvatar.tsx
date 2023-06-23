import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserType } from "../Context/User";
import { db, storage } from "../FirebaseConfig";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";

export const AddAvatar = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const { docId } = useContext(User) as UserType;

  let navigate = useNavigate();

  const addFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
          await uploadBytesResumable(imgRef, avatar).then(() => {
            getDownloadURL(imgRef).then(async (url) => {
              await updateDoc(doc(db, "users", docId), {
                avatarPath: url
              });
            });
          });
          setTimeout(() => {
            navigate("/AboutYou");
          }, 3000);
          setAvatar(null);
        } catch (err) {
          console.log(err);
        }
      };
      uploading();
    }
  }, [avatar, docId, navigate]);

  return (
    <div className="AddAvatar">
      <input
        required
        style={{ display: "none" }}
        type="file"
        id="file"
        onChange={addFile}
      />
      <label htmlFor="file">
        <Tooltip title="Add  photo" placement="top">
          <IconButton>
            <CameraAltOutlinedIcon sx={{ color: "white" }} />
            <Typography ml={1} color="white">
              Upload photo
            </Typography>
          </IconButton>
        </Tooltip>
      </label>
      <Link to="/AboutYou">
        <Box
          mt={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "#2a3942",
            height: "50px"
          }}
        >
          <Button sx={{ color: "white", mx: "5vh" }}>Skip</Button>
        </Box>
      </Link>
    </div>
  );
};
