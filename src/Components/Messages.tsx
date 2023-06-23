import React, { useContext, useEffect, useRef } from "react";
import { User, UserType } from "../Context/User";
import Moment from "react-moment";
import { ChatsType } from "./../Type/ChatsType";
import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
interface MessageType {
  message: ChatsType;
}

export const Messages = ({ message }: MessageType) => {
  const { user } = useContext(User) as UserType;

  const scroll = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className={`message-container ${message.from === user.uid && "user"}`}
      ref={scroll}
    >
      <div className={message.from === user.uid ? "user1" : "user2"}>
        <Box display="flex" flexDirection="column">
          {message.post && (
            <Link to={`/ShowStatus/${message.postId}`} className="linkWhite">
              <Box bgcolor="#2a3942">
                <Typography ml={1} variant="caption">
                  Reply
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }} my={1}>
                  <Avatar
                    sx={{ width: "85px", m: "6px" }}
                    variant="square"
                    src={message.post}
                  >
                    {message.post}
                  </Avatar>
                </Box>
              </Box>
            </Link>
          )}
          <Typography mx={1} mt={0.5} variant="body1">
            {message.text}
          </Typography>
          {message.photo && <img src={message.photo} alt="photos" />}
          <Moment className="messageTime" fromNow>
            {message?.time.toDate()}
          </Moment>
        </Box>
      </div>
    </div>
  );
};
