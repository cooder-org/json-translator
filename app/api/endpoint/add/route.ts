import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const { schema, typeName, prompt } = await req.json();
  if (!schema || !typeName || !prompt) {
    return NextResponse.json({ error: "Missing required parameters: schema, typeName, prompt" }, { status: 400, statusText: "Bad Request" });
  }

  const id = randomUUID();

  // save to storage

  return NextResponse.json({success: true, endpointId: id});
}
