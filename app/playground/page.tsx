"use client";

import { use, useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    typeName: "ShareOrNot",
    schema:
      "// The following is a schema definition for determining whether a user wants to share a post or not:\n\nexport interface ShareOrNot {\n  isShare: boolean;\n  url: string;\n  comment: string;\n}",
    output: "",
    prompt: "https://github.com/shengxia/RWKV_Role_Playing_API A Flask-based RWKV role-playing API",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        const response = await fetch(`/api/endpoint/${id}`);
        const rsp = await response.json();
        setFormData(rsp.data);
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onClick = async () => {
    setLoading(true);
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setFormData((prevState) => ({ ...prevState, output: JSON.stringify(data, null, 2) }));
    setLoading(false);
  };

  const onAddEndpoint = async () => {
    setLoading(true);
    const response = await fetch("/api/endpoint/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success) {
      toast({
        title: "Success",
        description: `Add endpoint success. id: ${data.endpointId}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Add endpoint error: ${data?.error?.code}`,
      });
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <Triangle
          height="80"
          width="80"
          color="black"
          ariaLabel="loading"
          wrapperClass="fixed top-0 left-0 right-0 bottom-0 h-screen z-50 overflow-hidden bg-gray-100 opacity-75 block items-center justify-center"
        />
      )}
      <main className="flex flex-row items-center justify-between p-2">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
          <div className="mt-1 sm:mx-auto sm:w-full">
            <div className="space-y-6">
              <div>
                <label htmlFor="typeName" className="block text-sm font-medium leading-6 text-gray-900">
                  Type Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="typeName"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.typeName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="schema" className="block text-sm font-medium leading-6 text-gray-900">
                    Type Definition In Typescript
                  </label>
                </div>
                <div className="mt-2 h-[300px] overflow-auto">
                  <CodeEditor
                    name="schema"
                    value={formData.schema || ""}
                    language="typescript"
                    placeholder="Please enter typescript."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schema: e.target.value,
                      })
                    }
                    padding={15}
                    style={{
                      minHeight: 300,
                      fontSize: 12,
                      fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="prompt" className="block text-sm font-medium leading-6 text-gray-900">
                    Input
                  </label>
                </div>
                <div className="mt-2">
                  <textarea
                    name="prompt"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.prompt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Button
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6"
                  onClick={onClick}
                  disabled={loading}
                >
                  {loading ? "Translating" : "Translate"}
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6"
                  onClick={onAddEndpoint}
                >
                  Add TO Endpoint
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div>
            <label htmlFor="output" className="block text-sm font-medium leading-6 text-gray-900">
              Output
            </label>
            <div className="mt-2">
              <CodeEditor
                name="output"
                value={formData.output || ""}
                language="json"
                padding={15}
                minHeight={500}
                style={{
                  fontSize: 12,
                  maxHeight: 500,
                  fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  overflow: "scroll",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
