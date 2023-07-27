import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { executeQuery } from "@/lib/db";

export async function POST(req: NextRequest) {
  const query = "select * from endpoints";
  const resp = await executeQuery({query});
  const data = (resp as any).map((r: any) => {
    return {
      id: r.type_id,
      typeName: r.type_name,
      schema: r.type_schema,
      prompt: r.prompt,
    }
  });

  return NextResponse.json({ success: true, data: data });
}
