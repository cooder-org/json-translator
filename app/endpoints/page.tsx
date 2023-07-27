"use client";
import { useEffect, useState } from "react";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-center [&>div]:w-full", className)} {...props} />;
}

export default function Home() {
  const { toast } = useToast();
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    fetch("/api/endpoint/list", { method: "POST" })
      .then((response) => response.json())
      .then((data) => setEndpoints(data.data));
  }, []);

  const copyToClipboard = (id: string, prompt: string) => {
    const body = { prompt: prompt };
    const currentHost = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const curl = `curl -X 'POST' '${currentHost}/api/endpoint/${id}' \\\n -H 'Content-Type: application/json' \\\n -d '${JSON.stringify(body)}' `;
    navigator.clipboard.writeText(curl);
    toast({
      title: "Copied to clipboard",
      description: "The cURL command has been copied to your clipboard.",
    });
  };

  return (
    <div className="items-start justify-center gap-6 rounded-lg p-8">
      <div className="flex flex-row flex-wrap">
        {endpoints &&
          endpoints.map((endpoint: any, index: number) => (
            <Container key={index} className="m-2 hover:bg-black">
              <Card className="w-[420px] max-w-[420px] min-w-[420px]">
                <CardHeader>
                  <CardTitle>{endpoint.typeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 h-[300px] overflow-auto">
                    <CodeEditor
                      name="schema"
                      value={endpoint.schema || ""}
                      language="typescript"
                      padding={15}
                      style={{
                        border: "1px solid #eaeaea",
                        borderRadius: 4,
                        backgroundColor: "white",
                        minHeight: 300,
                        maxHeight: 300,
                        fontSize: 12,
                        fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                        overflow: "auto",
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="outline" className="w-[150px]" onClick={() => copyToClipboard(endpoint.id, endpoint.prompt)}>
                    Copy as cURL
                  </Button>
                  <Button asChild className="w-[150px]">
                    <Link href={`/playground/?id=${endpoint.id}`}>Try in playground</Link>
                  </Button>
                </CardFooter>
              </Card>
            </Container>
          ))}
      </div>
    </div>
  );
}
