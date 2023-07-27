import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { executeQuery } from "@/lib/db";

const model = createLanguageModel(process.env);

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "Missing required parameters: prompt" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const query = `SELECT * FROM endpoints WHERE type_id = ?`;
  const values = [id];
  const recs = await executeQuery({ query, values });
  const record = (recs as any[])[0];

  if (!record) {
    return NextResponse.json(
      { error: `Endpoint with id ${id} not found` },
      { status: 404, statusText: "Not Found" }
    );
  }

  const { type_name, type_schema } = record;
  const translator = createJsonTranslator(model, type_schema, type_name);
  const resp = await translator.translate(prompt);
  const data = resp.success ? resp.data : { error: resp.message };

  return NextResponse.json(data);
}