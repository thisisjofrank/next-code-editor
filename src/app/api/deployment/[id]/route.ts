import { NextRequest } from "next/server";
import { DenoSubhostingClient } from "../../DenoSubhostingClient.ts";
import createUrl from "../../../../util/createUrl.ts";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = new DenoSubhostingClient();
  const id = (await params).id;

  let url: string | null = null;
  let project: Project | undefined;
  const deployment = await client.getDeployment(id);

  // Only grab the extra project info if the deployment is done
  // This way we don't spam the API too much
  if (deployment.status === "success" || deployment.status === "failed") {
    project = await client.getProject(deployment.projectId);
    url = createUrl(project, deployment);
  }

  return Response.json({
    project,
    deployment,
    url,
  }, { status: 200 });
}
