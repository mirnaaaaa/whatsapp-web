import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import React, { ChangeEvent, useContext, useEffect } from "react";
import { useState } from "react";
import { FcPicture } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, UserType } from "../Context/User";
import { db, storage } from "../FirebaseConfig";

export const EditProfile = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const { docId, user } = useContext(User) as UserType;

  const addFile = (e: ChangeEvent<HTMLInputElement>): void => {
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
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          await uploadBytesResumable(imgRef, avatar).then(() => {
            getDownloadURL(imgRef).then(async (url) => {
              await updateDoc(doc(db, "users", docId), {
                avatarPath: url
              });
            });
          });
          setAvatar(null);
          toast.success("Profile changed");
        } catch (err) {
          console.log(err);
        }
      };
      uploading();
    }
  }, [avatar, docId, user.avatarPath]);

  return (
    <div className="addStatus-div">
      <input
        required
        style={{ display: "none" }}
        type="file"
        id="file"
        onChange={addFile}
      />
      <label htmlFor="file">
        <div className="space-betweenEdit">
          <FcPicture className="addPhoto" />
          <span className="span-photo">Choose your profile</span>
        </div>
      </label>
    </div>
  );
};
