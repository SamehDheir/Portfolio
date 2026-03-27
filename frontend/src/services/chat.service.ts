import api from '@/lib/axios';

export const chatService = {
  sendMessage: async (message: string) => {
    const response = await api.post('/chat', { message });
    return response.data; 
  }
};