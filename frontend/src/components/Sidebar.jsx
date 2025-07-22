import { useEffect, useState } from "react";
import { useChatStore } from "../store/usechatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    setUsers,
    messages,
    getMessages,
    getTheLastMessagesForEachUser,
    lastMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // useEffect(() => {
  //   getUsers(authUser._id);
  //   // users.map((user) => getTheLastMessagesForEachUser(user._id));

  //   users.forEach((user) => getTheLastMessagesForEachUser(user._id));
  // }, [getUsers]);
  useEffect(() => {
    getUsers(authUser._id);
  }, []); // Exécuté uniquement au montage

  useEffect(() => {
    const fetchMessages = async () => {
      await Promise.all(
        users.map((user) => getTheLastMessagesForEachUser(user._id))
      );
    };
    if (users.length > 0) {
      fetchMessages();
    }
  }, [users, messages]); // Déclenché seulement quand `users` change

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  const numberOnlinedUsers = onlineUsers.filter(
    (user) => user !== authUser._id
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    // <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
    //   <div className="border-b border-base-300 w-full p-5">
    //     <div className="flex items-center gap-2">
    //       <Users className="size-6 text-slate-400" />
    //       <span className="font-medium hidden lg:block text-slate-400">
    //         Contacts
    //       </span>
    //     </div>
    //     {/* TODO: Online filter toggle */}
    //     <div className="mt-3 hidden lg:flex items-center gap-2">
    //       <label className="cursor-pointer flex items-center gap-2">
    //         <input
    //           type="checkbox"
    //           checked={showOnlineOnly}
    //           onChange={(e) => setShowOnlineOnly(e.target.checked)}
    //           className="checkbox checkbox-sm"
    //         />
    //         <span className="text-sm text-slate-400">Show online only</span>
    //       </label>
    //       <span className="text-xs text-zinc-500">
    //         ({filteredUsers.length} online)
    //       </span>
    //     </div>
    //   </div>

    //   <div className="overflow-y-auto w-full py-3">
    //     {filteredUsers.map((user) => (
    //       <button
    //         key={user._id}
    //         onClick={() => setSelectedUser(user)}
    //         className={`
    //           w-full p-3 flex items-center gap-3
    //           hover:bg-base-300 transition-colors
    //           ${
    //             selectedUser?._id === user._id
    //               ? "bg-base-300 ring-1 ring-base-300"
    //               : ""
    //           }
    //         `}
    //       >
    //         <div className="relative mx-auto lg:mx-0">
    //           <img
    //             src={user.avatar || "/avatar.png"}
    //             alt={user.username}
    //             className="size-12 object-cover rounded-full"
    //           />
    //           {onlineUsers.includes(user._id) ? (
    //             <span
    //               className="absolute bottom-0 right-0 size-3 bg-green-500
    //               rounded-full ring-2 ring-zinc-900"
    //             />
    //           ) : (
    //             <span
    //               className="absolute bottom-0 right-0 size-3 bg-gray-500
    //               rounded-full ring-2 ring-zinc-900"
    //             />
    //           )}
    //         </div>

    //         {/* User info - only visible on larger screens */}
    //         <div className="hidden lg:block text-left min-w-0">
    //           <div className="font-medium truncate text-slate-400">
    //             {user.username}
    //           </div>
    //           <div className="text-sm text-zinc-400">
    //             {onlineUsers.includes(user._id) ? "Online" : "Offline"}
    //           </div>
    //         </div>
    //       </button>
    //     ))}
    //   </div>
    // </aside>
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-slate-400" />
          <span className="font-medium hidden lg:block text-slate-400">
            Contacts
          </span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-slate-400">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({filteredUsers.length} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const lastMessage = lastMessages[user._id]; // Récupère le dernier message de cet utilisateur

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.avatar || "/avatar.png"}
                  alt={user.username}
                  className="size-12 object-cover rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 
                  ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }
                `}
                />
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-slate-400">
                  {user.username}
                </div>
                <div className="text-sm text-zinc-400 truncate">
                  {/* {lastMessage ? (
                    <>
                      {lastMessage.senderId === authUser._id
                        ? `Vous: ${lastMessage.text}`
                        : lastMessage.text}
                    </>
                  ) : (
                    "Aucun message"
                  )} */}

                  {lastMessage ? (
                    <>
                      {lastMessage.readedBy !== authUser._id &&
                      lastMessage.senderId !== authUser._id ? (
                        <>
                          {lastMessage.senderId === authUser._id ? (
                            <p className="font-bold text-sm text-white">
                              Vous: {lastMessage.text}
                            </p>
                          ) : (
                            <p className="font-bold text-sm text-white">
                              {" "}
                              {lastMessage.text}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {lastMessage.senderId === authUser._id ? (
                            <p>Vous: {lastMessage.text}</p>
                          ) : (
                            <p> {lastMessage.text}</p>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    "Aucun message"
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
export default Sidebar;
