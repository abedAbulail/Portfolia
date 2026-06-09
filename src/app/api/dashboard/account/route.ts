import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, createSession, COOKIE_NAME } from "@/lib/auth";
import {
  getUserById,
  findUserByEmail,
  updateUserEmail,
  updateUserPasswordHash,
  getUserPasswordHash,
} from "@/lib/airtable";
import { cookies } from "next/headers";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await getUserById(session.userId);
  if (!record) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    account: {
      email: record.user.email,
      createdTime: record.createdTime,
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, currentPassword, newPassword } = body as {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  let updatedEmail = session.email;

  if (email && email.toLowerCase() !== session.email.toLowerCase()) {
    const existing = await findUserByEmail(email);
    if (existing && existing.id !== session.userId) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }
    await updateUserEmail(session.userId, email);
    updatedEmail = email.toLowerCase();
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    }
    const hash = await getUserPasswordHash(session.userId);
    if (!hash) {
      return NextResponse.json({ error: "Unable to verify password." }, { status: 500 });
    }
    const valid = await bcrypt.compare(currentPassword, hash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordHash(session.userId, newHash);
  }

  if (updatedEmail !== session.email) {
    const token = await createSession({
      ...session,
      email: updatedEmail,
    });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return NextResponse.json({ success: true });
}
