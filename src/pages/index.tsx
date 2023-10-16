import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import Head from "next/head";
import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { FileUpload } from "~/modules/home/components/FileUpload";

export default function Home() {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>Chatdoc</title>
        <meta name="description" content="Chat with your documents" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-blue-500">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="text-5xl font-bold">Chat with any document</h1>
            </div>

            <p className="mt-3 max-w-xl text-lg text-slate-600">
              Can&apos;t find what you need from a paper, presentation, PRD,
              etc.? Chat with your document directly to find your answers ASAP.
            </p>

            <div className="mt-3 flex flex-col items-center gap-4">
              {status === "unauthenticated" ? (
                <Button
                  className="flex flex-row justify-center gap-2 align-middle"
                  onClick={() =>
                    void signIn("google", { callbackUrl: "/chats" })
                  }
                >
                  <Icon icon="flat-color-icons:google" fontSize={24} />
                  Sign in with Google
                </Button>
              ) : status === "authenticated" ? (
                <div className="max-w-xl">
                  <div className="mb-4 flex items-center gap-4">
                    <Button asChild variant="secondary">
                      <Link href="/chats">Go to Chats</Link>
                    </Button>
                    <Button
                      onClick={() => void signOut()}
                      className="flex flex-row justify-center gap-2 align-middle"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Button>
                  </div>
                  <FileUpload />
                </div>
              ) : (
                <Button
                  disabled
                  className="flex flex-row justify-center gap-2 align-middle"
                >
                  <Loader2 size={16} className="animate-spin" />
                  Loading
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
