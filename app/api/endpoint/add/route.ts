import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { add, Endpoint } from "../../../../lib/googlesheets";

export async function POST(req: NextRequest) {
  const { schema, typeName, prompt } = await req.json();
  if (!schema || !typeName || !prompt) {
    return NextResponse.json({ error: "Missing required parameters: schema, typeName, prompt" }, { status: 400, statusText: "Bad Request" });
  }

    // save to google sheets
  const id = randomUUID();
  const endpoint: Endpoint = {
    id,
    schema,
    typeName,
    prompt,
  };
  const resp = await add(endpoint);
  console.log(resp);

  return NextResponse.json({ success: true, endpointId: id });
}
