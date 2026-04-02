import api from "@/lib/axios";

export interface PostQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
}

export const postsService = {
  // @/services/posts.service.ts

  getAll: async (params?: PostQueryParams) => {
    const formattedParams = {
      ...params,
      page: params?.page || 1,
      limit: params?.limit || 6,
      publishedOnly:
        params?.publishedOnly !== undefined
          ? String(params.publishedOnly)
          : undefined,
    };

    const response = await api.get("/posts", {
      params: formattedParams,
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/posts/stats");
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.patch(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
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
  },
};
