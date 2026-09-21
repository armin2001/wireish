import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  message: z.string().min(10, "Please briefly describe your needs"),
});

export type ContactFormData = z.infer<typeof contactSchema>;