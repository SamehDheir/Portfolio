import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/v1/projects");
      return data;
    },
  });
};