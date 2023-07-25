import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";

const model = createLanguageModel(process.env);

export async function POST(req: NextRequest) {
  const { schema, typeName, prompt } = await req.json();
  if (!schema || !typeName || !prompt) {
    return NextResponse.json({ error: "Missing required parameters: schema, typeName, prompt" }, { status: 400, statusText: "Bad Request" });
  }

  const translator = createJsonTranslator(model, schema, typeName);
  const resp = await translator.translate(prompt);
  const data = resp.success ? resp.data : { error: resp.message };
  return NextResponse.json(data);
}

export const config = {
  runtime: 'edge'
}
