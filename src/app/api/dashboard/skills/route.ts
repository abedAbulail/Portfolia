import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsForPersonalInfo,
} from "@/lib/airtable";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await getSkillsForPersonalInfo(session.personalInfoId);
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.skillName?.trim()) {
      return NextResponse.json(
        { error: "Skill name is required." },
        { status: 400 }
      );
    }

    const skill = await createSkill(session.personalInfoId, body);
    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json(
      { error: "Failed to create skill." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...fields } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Skill ID required." }, { status: 400 });
    }

    const skill = await updateSkill(id, fields);
    return NextResponse.json({ skill });
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json(
      { error: "Failed to update skill." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Skill ID required." }, { status: 400 });
    }

    await deleteSkill(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill." },
      { status: 500 }
    );
  }
}
