// src/schemas/messageSchema.ts

import { z } from "zod";

export const sendMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  text: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z
    .enum(["image", "video", "audio", "document", "none"])
    .default("none"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
