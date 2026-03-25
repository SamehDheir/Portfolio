import api from '@/lib/axios';

export const projectsService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.patch(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};