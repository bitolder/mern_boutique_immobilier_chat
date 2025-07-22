// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";
// import { useAuthStore } from "./useAuthStore.js";

// const BASE_URL = "http://localhost:3000";

// export const useUserStore = create((set, get) => ({
//   isUpdatingProfile: false,
//   socket: null,
//   isDeletingUser: false,
//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.put("/user/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("error in update profile:", error);
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },
//   deleteUser: async (id) => {
//     set({ isDeletingUser: true });
//     try {
//       await axiosInstance.delete(`/user/delete/${id}`);
//       set({ authUser: null });
//       toast.success("User deleted successfully");
//     } catch (error) {
//       console.log("error in deleting user:", error);
//       toast.error("error in deleting user");
//     } finally {
//       set({ isDeletingUser: false });
//     }
//   },
// }));
