import api from "@/lib/axios";

export const skillsService = {
  // Bringing all the skills from the backend
  getAll: async () => {
    const response = await api.get("/skills");
    return response.data;
  },

  // Add a new skill
  create: async (data: any) => {
    const response = await api.post("/skills", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/skills/${id}`, data);
    return response.data;
  },

  // Delete skill
  delete: async (id: string) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};
