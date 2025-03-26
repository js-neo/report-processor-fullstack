import { TokenPayload } from '../services/authService.js';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}