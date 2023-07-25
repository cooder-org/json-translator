import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { get, Endpoint } from "../../../../lib/googlesheets";

const model = createLanguageModel(process.env);

export async function POST(req: NextRequest, context: { params: any }) {
  const slug = context.params;
  const {prompt} = await req.json();
  const endpoint = await get(slug.id);
  const { schema, typeName } = endpoint as Endpoint;

  const translator = createJsonTranslator(model, schema, typeName);
  const resp = await translator.translate(prompt);
  const data = resp.success ? resp.data : { error: resp.message };
  return NextResponse.json(data);
}
