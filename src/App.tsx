import "./App.css";
import React, { useContext, useState } from "react";
import Navbar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User, UserType } from "./Context/User";
import Login from "./Components/Login";
import { Profile } from "./Components/Profile";
import { AddAvatar } from "./Components/AddAvatar";
import { UserDataProvider } from "./Context/UserData";
import Chat from "./Components/Chat";
import { AboutYou } from "./Components/AboutYou";
import Status from "./Components/Status";
import { AllUsersProvider } from "./Context/AllUsers";
import { AddStatus } from "./Components/AddStatus";
import { PostsProvider } from "./Context/Posts";
import { ShowStatus } from "./Components/ShowStatus";
import { Welcome } from "./Components/Welcome";
import { Chats } from "./Components/Chats";
import Users from "./Components/Users";
import { Grid } from "@mui/material";
import Search from "./Components/Search";
import { DisplayChatType, DisplayChats } from "./Context/DisplayChats";
import { SearchResult } from "./Components/SearchResult";

export default function App() {
  const { docId } = useContext(User) as UserType;
  const [show, setShow] = useState<boolean>(false);
  const { searchResults } = useContext(DisplayChats) as DisplayChatType;
  const [showContacts, setShowContacts] = useState<boolean>(false)

  return (
    <Grid
      container
      sx={{
        bgcolor: "#111b21",
        color: "#e9edef",
        height: "100vh"
      }}
    >
      <Router>
        <UserDataProvider>
          <AllUsersProvider>
            <PostsProvider>
              <Grid item={true}  my={2} xs={3.5}>
                {docId && (
                  <>
                    <div>
                      {show ? (
                        <Status />
                      ) : (
                        <>
                        {showContacts ? <Users  setShowContacts={setShowContacts}/> : <>   <Navbar setShow={setShow} setShowContacts={setShowContacts}/>
                          <Search />
                          {!searchResults ? <Chats /> : <SearchResult />}</>}
                        
                        </>
                      )}
                    </div>
                  </>
                )}
              </Grid>

              <Grid item={true}  my={2} xs={8.4}>
                <Routes>
                  <Route
                    path="/"
                    element={<Welcome show={show} setShow={setShow} />}
                  />
                  <Route path="/SignUp" element={<SignUp />} />
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/Login" element={<Login />} />
                  <Route path="/AddAvatar" element={<AddAvatar />} />
                  <Route path="/Chat" element={<Chat />} />
                  <Route path="/ShowStatus/:Id" element={<ShowStatus setShow={setShow} />} />
                  <Route path="/AboutYou" element={<AboutYou />} />
                  <Route path="/AddStatus" element={<AddStatus setShow={setShow}/>} />
                </Routes>
              </Grid>
            </PostsProvider>
          </AllUsersProvider>
        </UserDataProvider>
      </Router>
    </Grid>
  );
}
