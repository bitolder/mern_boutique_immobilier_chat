import jwt from "jsonwebtoken";
export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Si l'application n'est pas en développement, l'option secure est activée (true).
    // Sinon (en développement), l'option secure est désactivée (false). secure est utiliser pour le HTTPS on localhost on n'en a pas besoin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
    sameSite: "strict",
  });
  return token;
};
