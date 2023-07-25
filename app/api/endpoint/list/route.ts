import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { list } from "../../../../lib/googlesheets";

export async function POST(req: NextRequest) {
  const ret = await list();

  return NextResponse.json({ list: ret });
}
