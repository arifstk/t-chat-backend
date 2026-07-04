// src/app/api/group/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/verifyToken";
import { createGroupSchema } from "@/schemas/chatSchema";

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createGroupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { groupName, members } = parsed.data;

    await dbConnect();

    // Ensure the current user is included in the members list
    const allMembers = Array.from(new Set([...members, decoded.id]));

    const chat = await Chat.create({
      isGroup: true,
      groupName,
      members: allMembers,
      admin: decoded.id,
    });

    const populatedChat = await chat.populate(
      "members",
      "name phone avatar isOnline lastSeen",
    );

    return NextResponse.json({ chat: populatedChat }, { status: 201 });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
