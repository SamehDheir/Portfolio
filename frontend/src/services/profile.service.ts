import api from "@/lib/axios";

export const profileService = {
  getMe: async () => {
    const response = await api.get("/profile/me");
    return response.data;
  },

  update: async (formData: FormData) => {
    const response = await api.patch("/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
