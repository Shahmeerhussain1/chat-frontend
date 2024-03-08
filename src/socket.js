import { io } from 'socket.io-client';
import env from './config/config';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080';
const URL = env.APIURL;

export const socket = io(URL);