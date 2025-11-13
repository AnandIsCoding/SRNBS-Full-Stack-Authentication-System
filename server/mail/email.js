import { resend } from "../utils/resend.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { error } = await resend.emails.send({
from:  "SRNBS Foundation <onboarding@devlinked.site>",
      to: email,
      subject: "Verify your email address",
      html: `
<div style="
  font-family: 'Arial', sans-serif;
  max-width: 420px;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eee;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
">
  <h2 style="
    text-align: center;
    color: #e91e63;
    margin-bottom: 10px;
  ">
    🔐 Email Verification
  </h2>

  <p style="color: #555; font-size: 15px; margin-bottom: 20px; text-align:center;">
    Use the OTP below to verify your email address for <strong>SRNBS FOUNDATION</strong>.
  </p>

  <div style="
    text-align: center;
    padding: 15px;
    background: #fce4ec;
    border-radius: 10px;
    border: 1px solid #f8bbd0;
    margin-bottom: 20px;
  ">
    <span style="
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #d81b60;
    ">
      ${verificationToken}
    </span>
  </div>

  <p style="font-size: 13px; color: #666; text-align:center;">
    This OTP is valid for <strong>1 Hour</strong>.  
    Do not share it with anyone.<br/>
    check your spam folder if you don't see it in your inbox.<br />
    If you did not request this, please ignore this email.
  </p>

  <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

  <p style="text-align:center; font-size:12px; color:#aaa;">
    © ${new Date().getFullYear()} SRNBS FOUNDATION. All rights reserved.
  </p>
</div>
`,

    });

    if (error) {
      console.log("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true };

  } catch (error) {
    console.log("Resend exception:", error);
    return { success: false, error };
  }
};




//  welcome email

export const sendWelcomeEmail = async (email, username) => {
  try {
    const { error } = await resend.emails.send({
      from:  "SRNBS Foundation <onboarding@devlinked.site>",
      to: email,
      subject: "Welcome to SRNBS Foundation 🎉",
      html: `
<div style="
  font-family: 'Arial', sans-serif;
  max-width: 420px;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eee;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
">

  <h2 style="
    text-align: center;
    color: #e91e63;
    margin-bottom: 10px;
  ">
    🎉 Welcome Aboard!
  </h2>

  <p style="color: #555; font-size: 15px; margin-bottom: 20px; text-align:center;">
    Hi <strong>${username}</strong>, we're excited to have you join 
    <strong>SRNBS FOUNDATION</strong>.
  </p>

  <p style="
    text-align:center; 
    font-size:14px; 
    color:#666;
    line-height: 1.6;
  ">
    Your account has been successfully created.<br />
    You now have full access to your dashboard, resources, and updates.<br/>
    check your spam folder if you don't see it in your inbox.<br />
    If you did not request this, please ignore this email.
  </p>

  <div style="
    margin: 25px auto;
    text-align: center;
  ">
    
  </div>

  <p style="font-size:13px; color:#666; text-align:center; margin-top:10px;">
    We’re here to help if you ever need support.
  </p>

  <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

  <p style="text-align:center; font-size:12px; color:#aaa;">
    © ${new Date().getFullYear()} SRNBS FOUNDATION. All rights reserved.
  </p>

</div>
      `,
    });

    if (error) {
      console.log("Resend Welcome Email Error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.log("Welcome Email Exception:", error);
    return { success: false, error };
  }
};



//  send password reset email

export const sendPasswordResetEmail = async (email, resetPasswordUrl) => {
  try {
    const { error } = await resend.emails.send({
      from:  "SRNBS Foundation <onboarding@devlinked.site>", 
      to: email,
      subject: "Reset Your Password – SRNBS Foundation",
      html: `
<div style="
  font-family: Arial, sans-serif;
  max-width: 460px;
  margin: 20px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #eaeaea;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
">

  <!-- HEADER -->
  <h2 style="
    text-align: center;
    color: #e91e63;
    margin-bottom: 8px;
    font-size: 24px;
  ">
    🔐 Reset Your Password
  </h2>

  <p style="
    text-align: center;
    margin: 0;
    font-size: 14px;
    color: #444;
  ">
    SRNBS FOUNDATION
  </p>

  <!-- MESSAGE -->
  <p style="
    margin-top: 20px;
    font-size: 15px;
    line-height: 1.6;
    color: #555;
  ">
    We received a request to reset your password.  
    Click the button below to create a new password:
  </p>

  <!-- BUTTON -->
  <div style="
    text-align: center;
    margin: 25px 0;
  ">
    <a href="${resetPasswordUrl}" style="
      background: #000;
      padding: 14px 26px;
      display: inline-block;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      transition: 0.3s;
    ">
      Reset Password
    </a>
  </div>

  <!-- EXTRA TEXT -->
  <p style="
    font-size: 13px;
    color: #666;
    text-align: center;
    margin-top: 10px;
  ">
    This link is valid for <strong>1 hour</strong>.<br>
    If you didn’t request this, you can safely ignore this email.<br/>
    check your spam folder if you don't see it in your inbox.<br />
    If you did not request this, please ignore this email.
  </p>

  <hr style="
    border: none;
    border-top: 1px solid #eee;
    margin: 30px 0 18px;
  ">

  <!-- FOOTER -->
  <p style="
    font-size: 12px;
    color: #aaa;
    text-align: center;
    margin: 0;
  ">
    © ${new Date().getFullYear()} SRNBS FOUNDATION.  
    All rights reserved.
  </p>

</div>
      `,
    });

    if (error) {
      console.log("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true };

  } catch (error) {
    console.log("Resend exception:", error);
    return { success: false, error };
  }
};


//  successfull password reset email


export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const { error } = await resend.emails.send({
      from: "SRNBS Foundation <onboarding@devlinked.site>", // works without domain verification
      to: email,
      subject: "✅ Your Password Has Been Reset Successfully",
      html: `
<div style="
  font-family: Arial, sans-serif;
  max-width: 450px;
  margin: auto;
  padding: 22px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eee;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
">

  <h2 style="
    text-align: center;
    color: #000;
    font-weight: 600;
    margin-bottom: 10px;
  ">
    ✅ Password Reset Successful
  </h2>

  <p style="color: #444; font-size: 15px; margin-bottom: 18px; text-align:center;">
    Your password has been successfully updated for your 
    <strong>SRNBS Foundation</strong> account.
  </p>

  <div style="
    background: #f7f7f7;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #e4e4e4;
    margin-bottom: 18px;
  ">
    <p style="color:#333; font-size:14px; text-align:center;">
      If you did not perform this action, please contact support immediately.
    </p>
  </div>

  <p style="font-size: 13px; color: #666; text-align:center;">
    For security reasons, we recommend keeping your account info confidential.<br/>
    check your spam folder if you don't see it in your inbox.<br />
    If you did not request this, please ignore this email.
  </p>

  <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

  <p style="text-align:center; font-size:12px; color:#aaa;">
    © ${new Date().getFullYear()} SRNBS FOUNDATION. All rights reserved.
  </p>
</div>
`,
    });

    if (error) {
      console.log("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true };

  } catch (error) {
    console.log("Resend Exception:", error);
    return { success: false, error };
  }
};
