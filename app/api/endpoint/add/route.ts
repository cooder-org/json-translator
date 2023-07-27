import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { md5sum } from "@/lib/utils";
import { executeQuery, DBError } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { schema, typeName, prompt } = await req.json();
  if (!schema || !typeName || !prompt) {
    return NextResponse.json({ error: "Missing required parameters: schema, typeName, prompt" }, { status: 400, statusText: "Bad Request" });
  }
  
  const id = md5sum(schema);
  const query = "INSERT INTO `endpoints` (`type_id`, `type_schema`, `type_name`, `prompt`) VALUES (?, ?, ?, ?)";
  const values = [id, schema, typeName, prompt];
  const resp = await executeQuery({query, values});
  if ((resp as any).error) {
    return NextResponse.json({ error: (resp as DBError).error }, { status: 500 });
  }

  return NextResponse.json({ success: true, endpointId: id });
}
