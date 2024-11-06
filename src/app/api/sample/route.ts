import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = Deno.readTextFileSync(`${Deno.cwd()}/src/app/api/samplecode.ts`);
  return Response.json({ code });
}
