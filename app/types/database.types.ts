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


