import React, { useEffect } from "react";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Headers from "./components/Headers";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import ChatPage from "./pages/ChatPage";
export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log("Authenticated User:", authUser);
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="bg-white">
      <Headers />
      <Routes>
        <Route path="/about" element={<About />} />

        <Route path="/" element={<Home />} />
        <Route
          path="/sign-in"
          element={!authUser ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-up/"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />

        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/" />}
        />

        <Route path="/create-listing" element={authUser && <CreateListing />} />

        <Route
          path="/update-listing/:listingId"
          element={authUser && <UpdateListing />}
        />
        <Route path="/chat" element={authUser && <ChatPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}
