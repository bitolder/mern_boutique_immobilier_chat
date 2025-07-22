import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { generateToken } from "../lib/generateToken.js";
dotenv.config({ path: ".env" });
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedpassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedpassword });
  try {
    await newUser.save();
    res.status(201).json("user created successfully!");
  } catch (error) {
    next(error);
  }
};
// export const signin = async (req, res, next) => {
//   const { email, password } = req.body;
//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) return next(errorHandler(404, "Wrong credentials!"));
//     const validPassword = bcryptjs.compareSync(password, validUser.password);

//     if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
//     const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
//     const { password: pass, ...userInfo } = validUser._doc; // ici je recup les toutes les info de l'utilisateur a l'aide du ...userInfo sauf le password que je stock dans pass
//     res
//       .cookie("access_token", token, { httpOnly: true })
//       .status(200)
//       .json(userInfo);
//   } catch (error) {
//     next(error);
//   }
// };
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(401, "invalid credentials"));

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) return next(errorHandler(401, "invalid credentials"));
    generateToken(user._id, res);
    const { password: pass, ...userInfo } = user._doc;
    res.json(userInfo);
  } catch (error) {
    next(error);
  }
};
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      generateToken(user._id, res);
      const { password: pass, ...rest } = user._doc;
      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json(rest);
      res.json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      //   const { password: pass, ...rest } = newUser._doc;
      //   res
      //     .cookie("access_token", token, { httpOnly: true })
      //     .status(200)
      //     .json(rest);
      // }
      generateToken(user._id, res);
      const { password: pass, ...userInfo } = newUser._doc;
      res.json(userInfo);
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res, next) => {
  // if (req.user.id !== req.params.id)
  //   return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
