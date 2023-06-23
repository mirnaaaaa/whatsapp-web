import { doc, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserType } from "../Context/User";
import { db } from "../FirebaseConfig";
import { Box, Button, TextField, Typography } from "@mui/material";

export const AboutYou = () => {
  const [about, setAbout] = useState<string | number>();
  const { docId } = useContext(User) as UserType;

  let navigate = useNavigate();

  const update = () => {
    if (about) {
      updateDoc(doc(db, "users", docId), {
        about
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
    setAbout("");
  };

  return (
    <div className="AddAvatar">
      <Box display="flex" alignItems="center">
        <Typography mr={2} className="aboutYou">
          ABOUT:
        </Typography>
        <TextField
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          sx={{ bgcolor: "#008069" }}
          variant="filled"
          label="busy..."
          color="success"
          name="about"
        />
      </Box>
      <Box my={3} display="flex">
        <Box
          ml={3}
          display="flex"
          justifyContent="center"
          sx={{
            bgcolor: "#2a3942",
            height: "40px"
          }}
        >
          <Button onClick={update} sx={{ color: "white" }}>
            Update
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          ml={3}
          sx={{
            bgcolor: "#2a3942",
            height: "40px"
          }}
        >
          <Link to="/">
            <Button sx={{ color: "white" }}>Skip</Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
};
