import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios"; 

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await api.get("/skills");
      return data;
    },
  });
};