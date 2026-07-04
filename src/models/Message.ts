// src/models/Message.ts

import mongoose, { Schema, models, model } from "mongoose";

export interface IMessage {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio" | "document" | "none";
  seenBy: mongoose.Types.ObjectId[];
  deliveredTo: mongoose.Types.ObjectId[];
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    mediaUrl: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "document", "none"],
      default: "none",
    },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    deliveredTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default models.Message || model<IMessage>("Message", MessageSchema);

