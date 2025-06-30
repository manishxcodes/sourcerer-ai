import { z } from 'zod'

export const userSchema = z.object({
    id: z.number(),
    name: z.string().min(6),
    email: z.string().email(),
    credits: z.number().default(500),
    subscription_id: z.string().nullable(),
    created_at: z.date()
});

export type userData = z.infer<typeof userSchema>;

export const searchQuerySchema = z.object({
    id: z.string().uuid(),
    searchInput: z.string().min(6),
    userEmail: z.string().email(),
    created_at: z.date(),
    type: z.enum(["search","research"])
})

export type searchQueryData = z.infer<typeof searchQuerySchema>;


export const searchResponseSchema = z.object({
  title: z.string(),
  snippet: z.string(),
  link: z.string().url(),
  displayLink: z.string(),
  ogImage: z.string().url().optional().nullable(),
  cseImage: z.string().url().optional().nullable(),
});

export type searchResponseType = z.infer<typeof searchResponseSchema>;

export const searchResponseSchemaArray = z.array(searchResponseSchema);

export type searchResponseArray = z.infer<typeof searchResponseSchemaArray>;