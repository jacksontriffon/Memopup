import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Zilla_Slab } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const zilla = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={zilla.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
