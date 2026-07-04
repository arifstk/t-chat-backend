// src/app/api/chats/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/verifyToken";
import { createChatSchema } from "@/schemas/chatSchema";

// user all chat list fetch
export async function GET(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const chats = await Chat.find({ members: decoded.id })
      .populate("members", "name phone avatar isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// new chat create (if already exists, return that)
export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { receiverId } = parsed.data;

    await dbConnect();

    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [decoded.id, receiverId], $size: 2 },
    }).populate("members", "name phone avatar isOnline lastSeen");

    if (chat) {
      return NextResponse.json({ chat });
    }

    // If no chat exists, create a new one
    chat = await Chat.create({
      isGroup: false,
      members: [decoded.id, receiverId],
    });

    chat = await chat.populate(
      "members",
      "name phone avatar isOnline lastSeen",
    );

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
