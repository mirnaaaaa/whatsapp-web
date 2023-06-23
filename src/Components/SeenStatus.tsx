import React from "react";
import Moment from "react-moment";
import { PostType } from "../Context/Posts";
import { Avatar, Box, Typography } from "@mui/material";
interface ViewProps {
  view: PostType;
}

export const SeenStatus = ({ view }: ViewProps) => {

  return (
    <Box display="flex" alignItems="center" m={1}>
      <Avatar src={view.photo} alt="profile" />
      <Box display="flex" flexDirection="column" mx={1}>
        <Typography variant="body2">{view.name}</Typography>
        <Moment className="last-postTime" fromNow>
          {view.time.toDate()}
        </Moment>
      </Box>
    </Box>
  );
};
