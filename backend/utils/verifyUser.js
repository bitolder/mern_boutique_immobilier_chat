import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "./error.js";
// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token; // on recup le token "cookie"

//   if (!token) return next(errorHandler(401, "Unauthorized")); // on vérifie le token si il existe ou pas

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     // on vérifie si c'est le bon token en fonction du compte de l'utilisateur
//     if (err) return next(errorHandler(403, "Forbidden"));

//     req.user = user; // on envoie l'user a update " dans user.controller" grace au next qui es un middleware
//     next();
//   });
// };
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(404, "You are not authenticated."));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(errorHandler(400, "Invalid token"));
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
