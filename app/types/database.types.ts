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

