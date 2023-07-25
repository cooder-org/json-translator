import CodeEditor from "@uiw/react-textarea-code-editor";

export function EndpointList(props:any) {
  const { endpoints, onClickEndpoint } = props;
  return (
    <div className="p-2">
      Endpoints:
      <div className="flex flex-row">
        {endpoints.map((endpoint:any, index:number) => (
          <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-gray-100" key={index} onClick={()=>onClickEndpoint(endpoint)}>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{endpoint.typeName}</div>
              <div className="mt-2">
                <CodeEditor
                  name="schema"
                  value={endpoint.schema || ""}
                  language="typescript"
                  padding={15}
                  style={{
                    fontSize: 12,
                    fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
