import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, getUserPasswordHash } from "@/lib/airtable";
import { createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordHash = await getUserPasswordHash(user.id);
    if (!passwordHash || !(await bcrypt.compare(password, passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      slug: user.slug,
      personalInfoId: user.personalInfoId,
    });

    const response = NextResponse.json({
      user: { email: user.email, slug: user.slug },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to sign in. Please try again." },
      { status: 500 }
    );
  }
}
