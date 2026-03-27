import * as z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.object({ value: z.string() })).min(1, "Add at least one tech").default([]),
  link: z.string().optional(),
  github: z.string().optional(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;
