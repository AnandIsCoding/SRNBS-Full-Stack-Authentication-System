import chalk from "chalk";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWTSECRET } from "../configs/server.config.js";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWTSECRET);
    } catch (error) {
      console.log(chalk.red("❌ JWT Verification Failed -->"), error.message);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    // ✅ Correct — Token payload contains userId (NOT decoded.id)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    req.user = user; // attach logged in user

    next();

  } catch (error) {
    console.log(chalk.bgRed("❌ Middleware Error -->"), error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
