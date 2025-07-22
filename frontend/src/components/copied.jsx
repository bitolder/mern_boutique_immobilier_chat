// {filteredUsers?.map((user) => (
//     <button
//       key={user._id}
//       onClick={() => setSelectedUser(user)}
//       className={`
//         w-full p-3 flex items-center gap-3
//         hover:bg-base-300 transition-colors
//         ${
//           selectedUser?._id === user._id
//             ? "bg-base-300 ring-1 ring-base-300"
//             : ""
//         }
//       `}
//     >
//       <div className="relative mx-auto lg:mx-0">
//         <img
//           src={user.avatar || "/avatar.png"}
//           alt={user.username}
//           className="size-12 object-cover rounded-full"
//         />
//         {onlineUsers.includes(user._id) ? (
//           <span
//             className="absolute bottom-0 right-0 size-3 bg-green-500
//             rounded-full ring-2 ring-zinc-900"
//           />
//         ) : (
//           <span
//             className="absolute bottom-0 right-0 size-3 bg-slate-500
//             rounded-full ring-2 ring-zinc-900"
//           />
//         )}
//       </div>

//       {/* User info - only visible on larger screens */}
//       <div className="hidden lg:block text-left min-w-0">
//         <div className="font-medium truncate text-slate-400">
//           {user.username}
//         </div>
//         <div className="text-sm text-zinc-400">
//           {/* {onlineUsers.includes(user._id) ? "Online" : "Offline"} */}
//           <p>{user.messages?.slice(-1)[0].text}</p>
//         </div>
//       </div>
//     </button>
//   ))}
