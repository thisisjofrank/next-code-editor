import { DenoSubhostingClient } from "../DenoSubhostingClient.ts";
import createUrl from "../../../util/createUrl.ts";

const sampleCode = Deno.readTextFileSync(
  `${Deno.cwd()}/src/app/api/samplecode.ts`,
);

export async function POST() {
  const client = new DenoSubhostingClient();
  const id = (await client.createProject()).id;
  const code = sampleCode;

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
