// src/models/chat.ts

import mongoose, { Schema, models, model } from "mongoose";

export interface IChat {
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  members: mongoose.Types.ObjectId[];
  admin?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
}

const ChatSchema = new Schema<IChat>(
  {
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true },
);

export default models.Chat || model<IChat>("Chat", ChatSchema);

