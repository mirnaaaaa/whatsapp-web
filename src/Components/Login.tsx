import { signInWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { User, UserType } from "../Context/User";
import { auth } from "../FirebaseConfig";
import { Box, Typography, Stack, TextField, Button } from "@mui/material";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const { docId } = useContext(User) as UserType;

  let navigate = useNavigate();

  useEffect(() => {
    if (docId) {
      navigate("/");
    }
  }, [docId, navigate]);

  const handleSubmit = (e: ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = () => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        setData({
          email: "",
          password: ""
        });
        toast.success("Login successfully");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => toast.error(error.message));
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
        <Box mb={1} display="flex" justifyContent="center">
          <Typography variant="h6">
            <b>welcome back!</b>
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            sx={{ bgcolor: "#008069" }}
            onChange={handleSubmit}
            value={data.email}
            name="email"
            variant="filled"
            required
            label="email"
            color="success"
          />
          <TextField
            onChange={handleSubmit}
            sx={{ bgcolor: "#008069" }}
            value={data.password}
            variant="filled"
            label="password"
            required
            type="password"
            color="success"
            name="password"
          />
        </Stack>
        <Box
          mx={15}
          mb={3}
          mt={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "#2a3942",
            height: "50px"
          }}
        >
          <Button onClick={submit} sx={{ color: "white" }}>
            Login
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="caption">
            <b> Don't have an account?</b>
          </Typography>
          <Link to="/SignUp" className="linkWhite">
            <Typography display="flex" ml={1} mb={0.1} variant="caption">
              SignUp
            </Typography>
          </Link>
        </Box>
      </Box>
    </div>
  );
}
