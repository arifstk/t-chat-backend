// src/models/user.ts

import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  avatar?: string;
  about?: string;
  isOnline: boolean;
  lastSeen: Date;
  fcmToken?: string;
  socketId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    avatar: { type: String, default: "" },
    about: { type: String, default: "Hey there! I am using WhatsApp Clone." },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    fcmToken: { type: String },
    socketId: { type: String },
  },
  { timestamps: true },
);

export default models.User || model<IUser>("User", UserSchema);
