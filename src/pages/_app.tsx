import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ToastProvider } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ToastProvider duration={3000}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </ToastProvider>
  );
};

export default api.withTRPC(MyApp);
