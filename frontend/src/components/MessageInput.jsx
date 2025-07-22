import { useRef, useState } from "react";
import { useChatStore } from "../store/usechatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");

  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    setUsers,
    messagesIsReaded,
    getTheLastMessagesForEachUser,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
      });

      // Clear form
      setText("");
      // if (!users._id.includes(selectedUser._id)) {
      //   getUsers();
      // }
      getTheLastMessagesForEachUser(selectedUser._id);
      if (!users.some((user) => user._id === selectedUser._id)) {
        getUsers();
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md text-slate-400"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
