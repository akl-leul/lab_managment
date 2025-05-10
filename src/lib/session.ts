import type { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string, // must be 32+ chars
  cookieName: 'app-session', // your cookie name
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
