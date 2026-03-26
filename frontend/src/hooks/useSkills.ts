import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/v1/skills");
      return data;
    },
  });
};