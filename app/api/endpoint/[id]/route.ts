import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";

const model = createLanguageModel(process.env);

export async function POST(req: NextRequest, context: {params: any}) {
  const slug = context.params;
  console.log(context)
  return NextResponse.json(slug);
}