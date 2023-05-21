import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import NavBar from "~/components/NavBar";
import Chat from "~/components/Chat";
import PromptModal from "~/components/PromptModal";
import Image from "next/image";
import MemopupButton from "~/components/Memopup/MemopupButton";
import Menu from "~/components/Menu/Menu";

import { atomWithStorage } from "jotai/utils";
const storedChatIDAtom = atomWithStorage<string>("chatId", "");

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Doggo remembers your AI prompts" />
        <title>Memopup</title>
      </Head>
      <PromptModal />
      <Menu storedChatIDAtom={storedChatIDAtom}>
        <main className="flex flex-col justify-between bg-base-100">
          <AuthPage />
        </main>
      </Menu>
    </>
  );
};

export default Home;

const AuthPage: React.FC = () => {
  const { data: sessionData, status } = useSession();

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <>
      {status === "loading" ? (
        <div className="min-w-screen flex min-h-screen flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/images/memopup_talk.png"
              width={64}
              height={64}
              alt="Memopup Logo"
            />
            <h1 className="text-3xl font-bold">{"Wait! I'm thinking..."}</h1>
          </div>
          <div></div>
        </div>
      ) : status === "authenticated" ? (
        <>
          <NavBar />
          <div className="mt-auto">
            <Chat storedChatIDAtom={storedChatIDAtom} />
          </div>
        </>
      ) : status === "unauthenticated" ? (
        <div className="min-w-screen flex min-h-screen flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <MemopupButton />
            <h1 className="text-3xl font-bold">Memopup wants to chat!</h1>
          </div>
          <button
            className="btn text-sm"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="min-w-screen flex min-h-screen flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-error">Error</h1>
            <h3 className="text-xl font-medium text-base-300">
              {"oh no! something bad happened, and memopup doesn't know why"}
            </h3>
            <h3 className="text-lg font-medium text-base-200">
              {"Please, try again later"}
            </h3>
          </div>
        </div>
      )}
    </>
  );
};
