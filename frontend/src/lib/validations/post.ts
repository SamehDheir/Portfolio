import * as z from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  content: z.string().min(20, "Content is too short"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()), 
  isPublished: z.boolean(),
});

export type PostFormValues = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
};