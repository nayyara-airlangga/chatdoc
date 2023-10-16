import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Icon } from "@iconify/react";
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
        {session == null ? (
          <Button
            variant="secondary"
            onClick={() => void signIn("google")}
            className="flex items-center gap-2 align-middle"
          >
            <Icon fontSize={24} icon="flat-color-icons:google" />
            Sign In with Google
          </Button>
        ) : isLoading ? (
          <h1 className="text-white">Loading...</h1>
        ) : (
          <>
            <h1 className="text-white">
              {data?.greeting} And Hello {session.user.name}!
            </h1>
            <br />
            <Button variant="secondary" onClick={() => void signOut()}>
              Sign Out
            </Button>
          </>
        )}
      </main>
    </>
  );
}
