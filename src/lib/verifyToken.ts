// src/lib/verifyToken.ts

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  id: string;
  phone: string;
}

export function verifyToken(req: NextRequest): DecodedToken | null {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string,
    ) as DecodedToken;

    return decoded;
  } catch (error) {
    return null;
  }
}
