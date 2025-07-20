import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: number
  }
}

export interface CustomSession extends Session {
  user?: SessionData['user'];
}