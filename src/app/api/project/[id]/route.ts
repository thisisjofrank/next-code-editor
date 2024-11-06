import { NextRequest } from "next/server";
import { DenoSubhostingClient } from "../../DenoSubhostingClient.ts";
import createUrl from "../../../../util/createUrl.ts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = new DenoSubhostingClient();
  const id = (await params).id;
  const body = await request.json();
  const code = body.code;

  // Slightly overcooked here given we're just using one file
  // But we could add multiple files to the deployment here.
  const files = new Map<string, string>();
  files.set("main.ts", code);

  const project = await client.getProject(id);
  const deployment = await client.deployProject(id, files);

  return Response.json({
    project,
    deployment,
    url: createUrl(project, deployment),
  }, { status: 201 });
}
