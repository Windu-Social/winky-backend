import { Auth } from '../models/auth.model';

export interface LoginResponse {
  user: Omit<Auth, 'auth'>;
  token: string;
}
