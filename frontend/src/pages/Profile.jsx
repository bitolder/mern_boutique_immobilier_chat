import { useState, useRef, useEffect } from "react";

import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../lib/firebase";

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

export default function Profile() {
  const { authUser, signout, isUpdatingProfile, updateProfile, deleteUser } =
    useAuthStore();

  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const fileref = useRef();
  const id = authUser._id;
  const listingsRef = useRef(null);
  console.log(id);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  //  upload t
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await fetch(`/api/user/update/${authUser._id}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();

      // if (data.success === false) {
      //   // dispatch(updateUserFailure(data.message));

      //   return;
      // }

      // dispatch(updateUserSuccess(data));
      updateProfile(formData);
      // setUpdateSuccess(true);
    } catch (error) {
      // dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      // dispatch(deleteUserStart());
      // const res = await fetch(`/api/user/delete/${authUser._id}`, {
      //   method: "DELETE",
      // });
      // const data = await res.json();
      // if (data.success === false) {
      //   // dispatch(deleteUserFailure(data.message));
      //   return;
      // }
      // dispatch(deleteUserSuccess(data));
      deleteUser(id);
    } catch (error) {
      // dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      // dispatch(signOutUserStart());
      // const res = await fetch("/api/auth/signout");
      // const data = await res.json();
      // if (data.success === false) {
      //   // dispatch(deleteUserFailure(data.message));
      //   return;
      // }
      // dispatch(deleteUserSuccess(data));
      signout();
    } catch (error) {
      // dispatch(deleteUserFailure(data.message));
    }
  };
  const handleScrollForShowListingItems = () => {
    if (listingsRef.current) {
      listingsRef.current.scrollIntoView(
        {
          behavior: "smooth",
          block: "start", // Le défilement commence en haut de la section
        },
        50
      );
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await axiosInstance.get(`/user/listings/${authUser._id}`);
      const data = res.data;
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      handleScrollForShowListingItems();
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleDeleteListing = async (listingId) => {
    try {
      const res = await axiosInstance.delete(`/listing/delete/${listingId}`);
      const data = res.data;
      if (data.success === false) {
        console.log("Error in deleting");
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white">
      <div className="p-3 max-w-lg mx-auto ">
        <h1 className="text-3xl text-center font-semibold my-7 text-black">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileref}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileref.current.click()}
            src={formData.avatar || authUser.avatar}
            alt="profile picture"
            className=" mt-2 w-24 h-24 rounded-full self-center cursor-pointer"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload (image must be less than 2 mb)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span> {`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-700"> Image successfully Upload</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            id="username"
            defaultValue={authUser.username}
            className="border p-3 rounded-lg  bg-white text-black"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            className="border p-3 rounded-lg bg-white text-black"
            defaultValue={authUser.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg  bg-white text-black"
            onChange={handleChange}
          />
          <button
            disabled={isUpdatingProfile}
            className="text-white bg-slate-700 rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-60"
          >
            {isUpdatingProfile ? "Loading..." : "Update"}
          </button>
          <Link
            to={"/create-listing"}
            className="text-white uppercase  text-center bg-green-700 rounded-lg p-3 hover:opacity-85 disabled:opacity-60 "
          >
            create Listing
          </Link>
        </form>

        <div className=" flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className=" text-red-700  cursor-pointer "
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className=" text-red-700  cursor-pointer"
          >
            Sign Out
          </span>
        </div>

        <p className="text-green-700 mt-5">
          {updateSuccess ? "User is updated successfully" : ""}
        </p>
        <button onClick={handleShowListings} className="text-green-700 w-full">
          Show Listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? showListingsError : ""}
        </p>
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col">
            <h1 className="font-semibold mt-7 text-2xl text-center">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                className="flex items-center border gap-4 p-3 justify-between"
                key={listing._id}
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="w-16 h-16 object-contain  "
                    src={listing.imagesUrls[0]}
                    alt="listings cover"
                  />
                </Link>
                <Link
                  className="flex-1 font-semibold hover:underline  text-slate-700 truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center ">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
