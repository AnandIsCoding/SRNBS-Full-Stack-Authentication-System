import {Resend} from 'resend'
import { RESEND_API_KEY } from '../configs/server.config.js';

export const resend = new Resend(RESEND_API_KEY);

