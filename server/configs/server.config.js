import dotenv from 'dotenv'
dotenv.config();

export const PORT = process.env.PORT || 7000;
export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/srnbs';
export const JWTSECRET = process.env.JWTSECRET || 'r7598@^&4h4bdtg$%hhdg$%h';
export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';