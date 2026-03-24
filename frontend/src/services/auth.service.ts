import api from '@/lib/axios';
import { LoginInput, LoginResponse } from '@/types/auth';

export const authService = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};