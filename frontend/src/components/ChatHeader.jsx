import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/usechatStore";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [selectedUserInfo, setSelectedUserInfo] = useState();

  const receiverId = window.location.search.substring(1);
  useEffect(() => {
    const fetchSelectedUser = async () => {
      const res = await axiosInstance.get(`/user/${selectedUser._id}`);
      const data = res.data;
      setSelectedUserInfo(data);
    };

    fetchSelectedUser();
  }, [selectedUser]);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.avatar || "/avatar.png"}
                alt={selectedUser?.username}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-slate-400">
              {selectedUser?.username}
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
