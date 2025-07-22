import express from "express";

import {
  getGlobalMessagesforInbox,
  getLastMessagesForUser,
  getMessages,
  getUsersForSidebar,
  isMessagesReaded,
  messagesIsReaded,
  sendMessages,
} from "../controllers/message.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.get("/users/:userId", verifyToken, getUsersForSidebar);
router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessages);
router.get("/is-readed/:id", verifyToken, isMessagesReaded);
router.get("/messageInbox/:id", verifyToken, getGlobalMessagesforInbox);
router.put("/readed/:id", verifyToken, messagesIsReaded);
router.get("/getLastMessagesForUser/:id", verifyToken, getLastMessagesForUser);
export default router;
