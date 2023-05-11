import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import NavBar from "~/components/NavBar";
import Chat from "~/components/Chat";
import PromptModal from "~/components/PromptModal";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Doggo remembers your AI prompts" />
        <title>Memopup</title>
      </Head>
      <PromptModal />
      <main className="flex flex-col justify-between bg-base-100">
        <AuthPage />
      </main>
    </>
  );
};

export default Home;

const AuthPage: React.FC = () => {
  const { data: sessionData } = useSession();

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <>
      {sessionData ? (
        <>
          <NavBar />
          <Chat />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/images/memopup.png"
              width={64}
              height={64}
              alt="Memopup Logo"
            />
            <h1 className="text-3xl font-bold">Memopup wants to chat!</h1>
          </div>
          <button
            className="btn text-sm"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};
