"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// import { useParams, useSearchParams } from 'react-router-dom';
import DeploymentViewer from "../../components/DeploymentViewer.tsx";
import ApiClient from "../../util/ApiClient.ts";

const client = new ApiClient();

export default function EditCode() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Editor state
  const [running, setRunning] = useState<string>("Run");
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [code, setCode] = useState<string>("");

  // Load default editor contents
  useEffect(() => {
    (async () => {
      const code = await client.getSampleCode();
      setCode(code);
    })();
  }, []);

  // OPTIONAL:
  // Pre-load the deployment triggered on redirect from ViewCode
  // A nice UX touch - grabbing the deploymentId from the URL
  // so that the user can see the deployment status immediately

  useEffect(() => {
    if (!searchParams.has("deployment")) return;

    (async () => {
      const deploymentId = searchParams.get("deployment")!;
      const response = await client.waitForDeployment(deploymentId);
      //      searchParams.delete('deployment');

      setUrl(response.url);
      setStatus(response.deployment.status);
      router.push(searchParams.toString());
    })();
  }, []);

  // UI Callbacks
  const deployChanges = async () => {
    setRunning("Running...");

    // This will create a new deployment and generate a new URL.
    // The serve isn't ready until the `waitForDeployment` promise resolves.
    const { deployment } = await client.deployProject(code, id!);
    const response = await client.waitForDeployment(deployment.id);

    setUrl(response.url);
    setStatus(response.deployment.status);

    setRunning("Run");
  };

  return (
    <div className="editor">
      <textarea
        className="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="run" onClick={deployChanges}>{running}</button>
      <DeploymentViewer url={url} status={status} />
    </div>
  );
}
