// src/app/api/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/verifyToken";
import { sendMessageSchema } from "@/schemas/messageSchema";

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { chatId, text, mediaUrl, mediaType } = parsed.data;

    if (!text && !mediaUrl) {
      return NextResponse.json(
        { error: "Message must have text or media" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if the chat exists and the user is a member of the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.members.some((m:any) => m.toString() === decoded.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await Message.create({
      chat: chatId,
      sender: decoded.id,
      text,
      mediaUrl,
      mediaType: mediaType || "none",
      deliveredTo: [decoded.id],
      seenBy: [decoded.id],
    });

    chat.lastMessage = message._id;
    await chat.save();

    const populatedMessage = await message.populate(
      "sender",
      "name phone avatar",
    );

    return NextResponse.json({ message: populatedMessage }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
