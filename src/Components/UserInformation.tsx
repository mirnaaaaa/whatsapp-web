import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { AllUsers, AllUsersType } from "../Context/AllUsers";
import { useState } from "react";
import { UsersType } from "../Type/UserType";
import Moment from "react-moment";

export const UserInformation = () => {
  const [information, setInformation] = useState<UsersType>();
  const { users } = useContext(AllUsers) as AllUsersType;

  const { id } = useParams();

  useEffect(() => {
    const correct = users.find((x) => x.displayName === id);
    if (correct) {
      setInformation(correct);
    }
  }, [id, users]);

  return (
    <div className="addStatus-div">
      {information && (
        <>
          <div className="log-profile">
            <div className="changeProfile">
              <img
                className="profile-change"
                src={information?.avatarPath}
                alt="profile"
              />
            </div>
          </div>
          <h1>Name: {information?.displayName}</h1>
          <h1>Email: {information?.email}</h1>
          <h1>ABOUT: {information?.about || "Busy"}</h1>
          <h1>
            Joined:<Moment fromNow>{information?.createdAt.toDate()}</Moment>
          </h1>
        </>
      )}
    </div>
  );
};
