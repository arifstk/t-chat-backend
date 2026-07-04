// app/api/users/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/schemas/userSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { phone, password } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ phone });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "30d" },
    );

    user.isOnline = true;
    await user.save();

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
