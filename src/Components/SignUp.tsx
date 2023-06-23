import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { ChangeEvent, useState } from "react";
import { auth, db } from "../FirebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Divider
} from "@mui/material";

export default function SignUp() {
  const [data, setData] = useState({
    displayname: "",
    email: "",
    password: ""
  });

  let navigate = useNavigate();

  const submitData = (e: ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        setDoc(doc(db, "users", res.user.uid), {
          displayName: data.displayname,
          email: data.email,
          password: data.password,
          uid: res.user.uid,
          time: Timestamp.now()
        })
          .then(() => {
            setData({
              displayname: "",
              email: "",
              password: ""
            });
            toast.success("Account created ");
            // localStorage.setItem("isAuth", true);
            setTimeout(() => {
              navigate("/AddAvatar");
            }, 3000);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="login">
      <ToastContainer />
      <Box
        width="100%"
        sx={{
          color: "white"
        }}
      >
        <Stack spacing={2}>
          <TextField
            sx={{ bgcolor: "#008069" }}
            value={data.displayname}
            onChange={submitData}
            name="displayname"
            variant="filled"
            required
            label="Name"
            color="success"
          />
          <TextField
            value={data.email}
            onChange={submitData}
            sx={{ bgcolor: "#008069" }}
            variant="filled"
            label="Email"
            required
            type="email"
            color="success"
            name="email"
          />
          <TextField
            value={data.password}
            onChange={submitData}
            sx={{ bgcolor: "#008069" }}
            variant="filled"
            label="Password"
            required
            type="password"
            color="success"
            name="password"
          />
        </Stack>
        <Box
          mx={15}
          mb={2}
          mt={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "#2a3942",
            height: "50px"
          }}
        >
          <Button onClick={submit} sx={{ color: "white" }}>
            SignUp
          </Button>
        </Box>
        <Divider>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" mr={1}>
              or
            </Typography>
            <Link to="/Login" className="linkWhite">
              <Typography variant="body2">Login</Typography>
            </Link>
          </Box>
        </Divider>
      </Box>
    </div>
  );
}
