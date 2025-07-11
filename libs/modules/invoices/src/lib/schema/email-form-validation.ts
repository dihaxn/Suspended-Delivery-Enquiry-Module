import { z } from 'zod';

export const emailFormSchema = z.object({
  sendTo: z.string().email('Invalid email address').max(75, 'Message cannot exceed 75 characters'),
  subject: z.string().min(1, 'Subject is required').max(75, 'Message cannot exceed 75 characters'),
  message: z.string().min(1, 'Message is required').max(350, 'Message cannot exceed 350 characters'),
});