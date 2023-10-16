import { useSession } from "next-auth/react";
import Head from "next/head";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  const { data, isLoading } = api.example.hello.useQuery({ text: "World!" });
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Chatdoc</title>
        <meta name="description" content="Chat with your documents" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {isLoading ? (
          <h1 className="text-white">Loading...</h1>
        ) : session == null ? (
          <Button>Sign In</Button>
        ) : (
          <h1 className="text-white">{data?.greeting}</h1>
        )}
      </main>
    </>
  );
}
