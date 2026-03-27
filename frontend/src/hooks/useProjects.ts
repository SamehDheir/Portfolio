import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data;
    },
  });
};