import * as z from "zod";

export const CategoryEnum = z.enum([
  "Backend",
  "Frontend",
  "AI",
  "DevOps",
  "Others",
]);
export const postSchema = z.object({
  content: z.string().min(20, "Content is too short"),
  category: CategoryEnum,
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean(),
});

export type PostFormValues = z.infer<typeof postSchema>;
