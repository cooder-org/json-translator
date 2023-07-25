"use client";

import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Triangle } from "react-loader-spinner";
import {EndpointList} from "../components/endpoint"

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const [formData, setFormData] = useState({
    typeName: "ShareOrNot",
    schema:
      "// The following is a schema definition for determining whether a user wants to share a post or not:\n\nexport interface ShareOrNot {\n  isShare: boolean;\n  url: string;\n  comment: string;\n}",
    output: "",
    prompt: "https://github.com/shengxia/RWKV_Role_Playing_API 一个基于Flask实现的RWKV角色扮演API",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/endpoint/list", {
        method: "POST",
      });
      const rsp = await response.json();
      setEndpoints(rsp.data);
    };
    fetchData();
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
    let list = [...endpoints];
    list.push(formData);
    setEndpoints(list);
    setLoading(false);
  };

  const onClickEndpoint = async (endpoint) => {
    setFormData({...formData, typeName: endpoint.typeName, schema: endpoint.schema});
  };


  return (
    <>
      {loading && (
        <Triangle
          height="80"
          width="80"
          color="green"
          ariaLabel="loading"
          wrapperClass="fixed top-0 left-0 right-0 bottom-0 h-screen z-50 overflow-hidden bg-gray-100 opacity-75 block items-center justify-center"
        />
      )}
      <div className="sm:mx-auto sm:w-full">
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          translate the input of natural language into a specified structure
        </h2>
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">将自然语言的输入提取为指定的结构</h2>
      </div>
      <main className="flex flex-row items-center justify-between p-2">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
          <div className="mt-1 sm:mx-auto sm:w-full">
            <div className="space-y-6">
              <div>
                <label htmlFor="typeName" className="block text-sm font-medium leading-6 text-gray-900">
                  Type Name（类型名称）
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
                    Type Definition In TS （类型描述 Typescript）
                  </label>
                </div>
                <div className="mt-2">
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
                      fontSize: 12,
                      // backgroundColor: "#f5f5f5",
                      fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="prompt" className="block text-sm font-medium leading-6 text-gray-900">
                    Input（输入）
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
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={onClick}
                  disabled={loading}
                >
                  {loading ? "Translating（转换中）" : "Translate (转换)"}
                </button>
              </div>

              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={onAddEndpoint}
                >
                  Add TO Endpoint
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div>
            <label htmlFor="output" className="block text-sm font-medium leading-6 text-gray-900">
              Output（输出）
            </label>
            <div className="mt-2">
              <CodeEditor
                name="output"
                value={formData.output || ""}
                language="json"
                padding={15}
                minHeight={300}
                style={{
                  fontSize: 12,
                  // backgroundColor: "#f5f5f5",
                  fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <EndpointList endpoints={endpoints} onClickEndpoint={onClickEndpoint}/>
    </>
  );
}
