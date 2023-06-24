import React, { useState } from "react";
import { useContext } from "react";
import { User, UserType } from "../Context/User";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig";

interface ShowType {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowContacts: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setShow, setShowContacts }: ShowType) {
  const { user, docId, setUser } = useContext(User) as UserType;
  const [click, setClick] = useState<null | HTMLElement>(null);

  const open = Boolean(click);

  let navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth).then(() => {
      navigate("/Login");
    });
    setUser([]);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setClick(event.currentTarget);
  };

  const handleClose = () => {
    setClick(null);
  };

  const showStatus = () => {
    setShow(true);
    navigate("/");
  };

  return (
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
        {docId && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Stack>
              <Avatar alt="profile" src={user?.avatarPath} />
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Tooltip title="Status">
                <IconButton onClick={showStatus}>
                  <DonutLargeIcon sx={{ fontSize: "20px", color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="New chat">
                <IconButton onClick={() => setShowContacts(true)}>
                  <ChatIcon sx={{ fontSize: "20px", color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Menu">
                <IconButton
                  aria-controls={open ? "menu" : undefined}
                  id="button"
                  onClick={handleClick}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MoreVertIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu"
                anchorEl={click}
                open={open}
                MenuListProps={{
                  "aria-labelledby": "button"
                }}
                onClick={handleClose}
              >
                <Link to="/Profile" className="link">
                  <MenuItem
                    sx={{
                      "&:hover": {
                        bgcolor: "#222e35",
                        color: "white"
                      }
                    }}
                  >
                    Account
                  </MenuItem>
                </Link>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    "&:hover": {
                      bgcolor: "#222e35",
                      color: "white"
                    }
                  }}
                >
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
