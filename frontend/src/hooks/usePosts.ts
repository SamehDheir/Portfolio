import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PostQueryParams } from "@/services/posts.service";

export const usePosts = (params?: PostQueryParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: async () => {
      const { data } = await api.get("/posts", { params });
      return data;
    },
  });
};
