import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isDeletingUser: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);

      set({ authUser: res.data });

      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  google: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/google", {
        name: data.user.displayName,
        email: data.user.email,
        photo: data.user.photoURL,
      });
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  deleteUser: async (id) => {
    set({ isDeletingUser: true });
    try {
      await axiosInstance.delete(`/auth/delete/${id}`);
      set({ authUser: null });
      toast.success("User deleted successfully");
    } catch (error) {
      console.log("error in deleting user:", error);
      toast.error("error in deleting user");
    } finally {
      set({ isDeletingUser: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUser", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
