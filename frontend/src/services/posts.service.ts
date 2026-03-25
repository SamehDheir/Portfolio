import api from '@/lib/axios';

export const postsService = {
  getAll: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await api.get('/posts', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.patch(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string, isPublished: boolean) => {
    const response = await api.patch(`/posts/${id}/status`, { isPublished });
    return response.data;
  }
};