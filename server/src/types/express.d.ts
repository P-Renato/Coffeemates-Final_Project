import { UserPayload } from '../libs/types';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}