"use client";
import { useEffect, useState } from "react";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-center [&>div]:w-full", className)} {...props} />;
}

export default function Home() {
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    fetch("/api/endpoint/list", { method: "POST" })
      .then((response) => response.json())
      .then((data) => setEndpoints(data.data));
  }, []);

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
                <CardFooter className="flex items-center justify-end">
                  <Button asChild>
                    <Link href={`/playground/?id=${endpoint.id}`}>Try</Link>
                  </Button>
                </CardFooter>
              </Card>
            </Container>
          ))}
      </div>
    </div>
  );
}
