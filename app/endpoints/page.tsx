import { EndpointList } from "@/components/endpoint";
import { executeQuery } from "@/lib/db";

async function getEndpints() {
  const query = "select * from endpoints";
  const resp = await executeQuery({ query });
  console.log(resp);
  const data = (resp as any).map((r: any) => {
    return {
      id: r.type_id,
      typeName: r.type_name,
      schema: r.type_schema,
      prompt: r.prompt,
    };
  });

  return data;
}

export default async function Home() {
  const endpoints = await getEndpints();
  return (
    <>
      <EndpointList endpoints={endpoints} />
    </>
  );
}
