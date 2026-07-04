import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, socketId, isOnline } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const updateData: Record<string, unknown> = { isOnline };

    if (socketId) {
      updateData.socketId = socketId;
    }

    if (!isOnline) {
      updateData.lastSeen = new Date();
      updateData.socketId = "";
    }

    await User.findByIdAndUpdate(userId, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Socket connect update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}


