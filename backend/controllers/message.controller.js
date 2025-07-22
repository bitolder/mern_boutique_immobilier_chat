import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// export const getUsersForSidebar = async (req, res, next) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.findById({
//       _id: { $ne: loggedInUserId },
//     }).select("-password");
//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     next(error);
//   }
// };

export const getUsersForSidebar = async (req, res, next) => {
  try {
    const myId = req.user._id;

    // Récupérer tous les messages où je suis soit l'expéditeur, soit le destinataire
    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    }).select("senderId receiverId text");

    // Extraire tous les IDs uniques des utilisateurs
    const userIds = new Set();
    messages.forEach((message) => {
      if (message.senderId.toString() !== myId.toString()) {
        userIds.add(message.senderId.toString());
      }
      if (message.receiverId.toString() !== myId.toString()) {
        userIds.add(message.receiverId.toString());
      }
    });

    // Trouver les utilisateurs correspondants
    const filteredUsers = await User.find({
      _id: { $in: Array.from(userIds) },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    // const user = await User.findById(userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
export const getGlobalMessagesforInbox = async (req, res, next) => {
  try {
    const myId = req.user._id;
    const messages = await Message.find({
      receiverId: myId, // Filtre les messages où le receiverId correspond à l'utilisateur connecté
    });
    // const user = await User.findById(userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const isMessagesReaded = async (req, res, next) => {
  try {
    const { id: myId } = req.params;
    const messages = await Message.find({
      receiverId: myId, // Filtre les messages où le receiverId correspond à l'utilisateur connecté
    });
    // const user = await User.findById(userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
export const messagesIsReaded = async (req, res, next) => {
  try {
    const { id: idWhoSendMessage } = req.params;
    const myId = req.user._id;
    // Met à jour tous les messages non lus de l'utilisateur connecté en définissant isReaded sur true
    await Message.updateMany(
      { senderId: idWhoSendMessage, readedBy: idWhoSendMessage },
      // Filtre : uniquement les messages non lus
      { $set: { readedBy: myId } } // Mise à jour : marque comme lu
    );
    // const user = await User.findById(userToChatId);
    res.status(200);
  } catch (error) {
    next(error);
  }
};
// export const messagesIsReaded = async (req, res, next) => {
//   try {
//     const { id: idWhoSendMessage } = req.params;

//     // Met à jour tous les messages non lus en les marquant comme lus
//     await Message.updateMany(
//       {
//         $or: [
//           { senderId: idWhoSendMessage, isReaded: false }, // Messages envoyés par l'utilisateur
//           { receiverId: idWhoSendMessage, isReaded: false }, // Messages reçus par l'utilisateur
//         ],
//       },
//       { $set: { isReaded: true } } // Marque les messages comme lus
//     );

//     res.status(200).json({ message: "Messages marked as read successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
export const sendMessages = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      readedBy: senderId,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("newMessageNotification", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
export const getLastMessagesForUser = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    // const user = await User.findById(userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
