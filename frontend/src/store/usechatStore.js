import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTheLastMessageReaded: false,
  thereIsnewMessageNotification: null,
  truncatedMessage: [],
  messages: [],
  lastMessages: [],

  // getUsers: async () => {
  //   set({ isUsersLoading: true });
  //   try {
  //     const res = await axiosInstance.get("/messages/users");
  //     set({ users: res.data });
  //   } catch (error) {
  //     //   toast.error(error.response.data.message);
  //     console.log(error);
  //   } finally {
  //     set({ isUsersLoading: false });
  //   }
  // },
  getUsers: async (userId) => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/users/${userId}`);
      set({ users: res.data });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({ messages: res.data });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setUsers: () => {
    const { users } = get(); // Obtenez la liste actuelle des utilisateurs
    const updatedUsers = users.map((user) => ({
      ...user,
      isSelected: user._id === selectedUserId, // Marquez l'utilisateur sélectionné
    }));
    set({ users: updatedUsers }); // Mettez à jour l'état
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      // const authUser = useAuthStore.getState().authUser;

      // const theMessageIsItForMe = newMessage.receiverId === authUser._id;
      // console.log(theMessageIsItForMe);
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
      // set({ thereIsnewMessageNotification: true });

      // if (theMessageIsItForMe) set({ thereIsnewMessageNotification: true });
      // else return;
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  isMessagesReaded: async (senderId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/is-readed/${senderId}`);
      set({ messages: res.data });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  messagesIsReaded: async (senderId) => {
    set({ isMessagesLoading: true });
    try {
      await axiosInstance.put(`/messages/readed/${senderId}`);
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  truncatedMessageForSidebar: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/messageInbox/${userId}`);
      set({ truncatedMessage: res.data });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  // setIsTheLastMessageReaded: (IsTheLastMessageReadeds) => {
  //   // const isTheLastMessageReaded =  get()
  //   set({ isTheLastMessageReaded: IsTheLastMessageReadeds });
  // },
  /*  surement faux*/

  // subscribeToMessagesIfReaded: () => {
  //   const authUser = useAuthStore.getState().authUser;
  //   if (!authUser) return;

  //   const socket = useAuthStore.getState().socket;

  //   socket.on("newMessage", (newMessage) => {
  //     // const isMessageSentFromSelectedUser =
  //     //   newMessage.receiverId === authUser._id;

  //     // if (!isMessageSentFromSelectedUser) return;

  //     set({
  //       messagessss: [...get().messagessss, newMessage],
  //     });
  //   });
  // },

  // unsubscribeFromMessagesIfReaded: () => {
  //   const authUser = useAuthStore.getState().authUser;
  //   if (!authUser) return;
  //   const socket = useAuthStore.getState().socket;
  //   socket.off("newMessage");
  // },
  /* on va try ici */

  subscribeToMessagesNotification: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessageNotification", (newMessage) => {
      const authUser = useAuthStore.getState().authUser;

      const theMessageIsItForMe = newMessage.receiverId === authUser._id;

      if (theMessageIsItForMe) set({ thereIsnewMessageNotification: true });
      else return;
    });
  },

  unsubscribeFromMessagesNotification: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessageNotification");
  },
  setThereIsnewMessageNotification: (value) =>
    set({ thereIsnewMessageNotification: value }),
  // getTheLastMessagesForEachUser: async (userId) => {
  //   set({ isMessagesLoading: true });
  //   try {
  //     const res = await axiosInstance.get(`/getLastMessagesForUser/${userId}`);
  //     set({ lastMessages: res.data });
  //   } catch (error) {
  //     //   toast.error(error.response.data.message);
  //     console.log(error);
  //   } finally {
  //     set({ isMessagesLoading: false });
  //   }
  // },
  getTheLastMessagesForEachUser: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      if (!userId) {
        console.error("Invalid userId:", userId);
        return;
      }
      const res = await axiosInstance.get(
        `/messages/getLastMessagesForUser/${userId}`
      );
      set((state) => ({
        lastMessages: {
          ...state.lastMessages,
          [userId]: res.data.length > 0 ? res.data.slice(-1)[0] : null,
        }, // Prend le dernier message
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set((state) => ({ isMessagesLoading: false }));
    }
  },
}));
