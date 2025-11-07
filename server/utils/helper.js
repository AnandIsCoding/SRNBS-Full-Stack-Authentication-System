import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../configs/server.config.js';

// ✅ Generate JWT token & store in cookie
export const generateJWTToken = (res, userId, userEmail) => {
  try {
    const token = jwt.sign(
      { userId, userEmail },
      JWTSECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;

  } catch (error) {
    console.log("Error in JWT token generation :---> ", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Something went wrong" });
  }
};
