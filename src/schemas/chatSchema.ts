// src/schemas/chatSchemas.ts

import { z } from "zod";

export const createChatSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
});

export const createGroupSchema = z.object({
  groupName: z.string().min(2, "Group name must be at least 2 characters"),
  members: z.array(z.string()).min(2, "Group must have at least 2 members"),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
