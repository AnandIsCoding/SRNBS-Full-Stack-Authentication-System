import bcrypt from "bcryptjs";
import chalk from 'chalk';
import crypto from 'crypto'
import { OAuth2Client } from "google-auth-library";
import StatusCodes from 'http-status-codes';

import { CLIENT_URL } from '../configs/server.config.js';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mail/email.js';
import User from '../models/user.model.js';
import { generateJWTToken } from '../utils/helper.js';
const client = new OAuth2Client(process.env.CLIENT_ID);
//  signup handler controller


export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Required field missing" });
    }
    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ success: false, message: "User already exists" });
    }

    // 🔹 Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
        message:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
      });
    }
    //hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);


    //  verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000 //1 hour
    });

    //  assign jwt token cokkie 
    generateJWTToken(res, newUser._id, newUser.email)
    await sendVerificationEmail(newUser.email, verificationToken);
    return res.status(StatusCodes.CREATED).json({
      success: true, message: "Otp send to email successfully", user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic
      }
    });
  } catch (error) {
    // Error handling, error response
    if (error.name === "ValidationError") {
      // Extract validation messages
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error(chalk.bgRed("Validation Error =>>>"), messages);
      return res.status(400).json({
        success: false,
        message: messages[0],
        error: messages[0],
      });
    }
    console.error("Error in signupUser:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
  }
}



// ✅ VERIFY EMAIL OTP CONTROLLER
export const verifyEmailOTP = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const otp = String(code).trim();  // ✅ force string match

    const user = await User.findOne({
      verificationToken: otp,          // ✅ compare as string
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user
    });

  } catch (error) {
    console.error("Error in verifyEmailOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// handle login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Block login if email not verified
    if (!user.isVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //Generate JWT Token & Set Cookie
    generateJWTToken(res, user._id, user.email);

    //  Send sanitized user back
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic || null,
      },
    });

  } catch (error) {
    console.log("Error in login controller:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Login failed",
    });
  }
};




//  logout controller
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log("Logout error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to logout",
    });
  }
};




//  fetch profile
export const getMyProfile = async (req, res) => {
  try {
    // req.user is already added by isAuthenticated middleware
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });

  } catch (error) {
    console.log(chalk.bgRed("Error in getMyProfile controller --> "), error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};



//  forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    const emailResponse = await sendPasswordResetEmail(
      user.email,
      `${CLIENT_URL}/reset-password/${resetPasswordToken}`
    );

    if (!emailResponse.success) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.log("Forgot password error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};




//  reset password controller

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    //Validate missing token
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Reset token is missing",
      });
    }

    //  Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

    if (!password || !passwordRegex.test(password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
        message:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }


    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save new password
    user.password = hashedPassword;


    // Clear reset token fields so that token cannot be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();


    // Send success email
    await sendPasswordResetSuccessEmail(user.email);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};





//  google login

export const registerWithGoogleController = async (req, res) => {
  try {
    // access token from request body
    const { token } = req.body;
    const LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = LoginTicket.getPayload();
    const { sub, name, email, picture } = payload;
    let user = await User.findOne({ email });
    let userExists = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        fullName: name,
        profilePic: picture,
      });
    }
    //Generate JWT Token & Set Cookie
    generateJWTToken(res, user._id, user.email);
    // send registration mail to user
    try {
      if (!userExists) {
        await sendWelcomeEmail(user.email, user.fullName);
      }
    } catch (error) {
      console.log(
        chalk.bgRedBright(
          "Error in sending mail to user in registerWithGoogleController"
        )
      );
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login Successfull", user });
  } catch (error) {
    // Error handling, error response
    if (error.name === "ValidationError") {
      // Extract validation messages
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error(chalk.bgRed("Validation Error =>>>"), messages);
      return res.status(400).json({
        success: false,
        message: messages[0],
        error: messages[0],
      });
    }
    console.log(
      chalk.bgRedBright(
        "Error in registerWithGoogleController in auth.controller.js ---->> ",
        error
      )
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in registerWithGoogleController in auth.controller.js",
    });
  }
};