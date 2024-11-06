"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiClient from "../util/ApiClient.ts";

const client = new ApiClient();

export default function ViewCode() {
  const navigate = useRouter();
  const [code, setCode] = useState("");

  useEffect(() => {
    (async () => {
      const code = await client.getSampleCode();
      setCode(code);
    })();
  }, []);

  const fork = async () => {
    // The omission of a project id here will create a new project
    const responseJson = await client.deployProject(code);
    navigate.push(
      `/edit/${responseJson.project.id}?deployment=${responseJson.deployment.id}`,
    );
  };

  return (
    <div className="editor">
      <pre className="code">{code}</pre>
      <button className="run" onClick={fork}>Create Interactive Sandbox</button>
    </div>
  );
}
