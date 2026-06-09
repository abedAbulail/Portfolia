import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createUserAccount,
  findUserByEmail,
  generateSlug,
} from "@/lib/airtable";
import { createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = generateSlug(name);
    const user = await createUserAccount(email, passwordHash, name.trim(), slug);

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
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
