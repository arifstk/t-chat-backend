import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, userId } = body;

    if (!messageId || !userId) {
      return NextResponse.json(
        { error: "messageId and userId are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { seenBy: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message seen update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

