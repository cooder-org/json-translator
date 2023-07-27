import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { executeQuery } from "@/lib/db";

const model = createLanguageModel(process.env);

async function getEndpoint(id: string) {
  const query = `SELECT * FROM endpoints WHERE type_id = ? limit 1`;
  const values = [id];
  const recs = await executeQuery({ query, values });
  const rec = (recs as any[])[0];
  return {
    id: rec.type_id,
    typeName: rec.type_name,
    schema: rec.type_schema,
    prompt: rec.prompt,
  };
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const record = await getEndpoint(id);
  return NextResponse.json({success: true, data: record});
}

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "Missing required parameters: prompt" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const record = await getEndpoint(id);

  const { typeName, schema } = record;
  const translator = createJsonTranslator(model, schema, typeName);
  const resp = await translator.translate(prompt);
  const data = resp.success ? resp.data : { error: resp.message };

  return NextResponse.json(data);
}