import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[500px] min-w-screen">
        <div>
          <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Make LLM As Your API Server</h2>
          <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Types are all you need</h2>
        </div>
        <div className="mt-6 flex justify-between w-72">
          <Button asChild variant="outline">
            <Link href="/endpoints">View Endpoint</Link>
          </Button>
          <Button asChild>
            <Link href="/playground">Add Endpoint</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
