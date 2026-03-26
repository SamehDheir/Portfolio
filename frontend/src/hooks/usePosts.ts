// hooks/usePosts.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/v1/posts");
      return data;
    },
    select: (posts: any[]) => posts.filter((post) => post.published === true),
  });
};