import { IronSessionOptions } from 'iron-session';

export interface UserSession {
  id: string;
  username: string;
  role: string;
  profileImage?: string | null;
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'lab-equipment-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
