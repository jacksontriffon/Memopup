import Image from "next/image";
import Dropdown from "./Dropdown";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NavBar() {
  const { data: sessionData } = useSession();
  console.log(sessionData);
  const displayPicture: string = sessionData?.user.image
    ? sessionData.user.image
    : "/icons/avatar.svg";

  const defaultMemopupPicture = "/images/memopup.png";
  const talkingMemopupPicture = "/images/memopup_talk.png";
  const [memopupPicture, setMemopupPicture] = useState(defaultMemopupPicture);

  return (
    <header className="flex items-center justify-between px-4 pt-4 transition-all duration-300 @container">
      <button className="btn-circle btn h-12 w-12 border-none transition-all duration-300 sm:h-16 sm:w-16">
        <Image
          src={memopupPicture}
          width={256}
          height={256}
          alt="Memopup Logo"
          onMouseDown={() => setMemopupPicture(talkingMemopupPicture)}
          onMouseLeave={() => setMemopupPicture(defaultMemopupPicture)}
        />
      </button>
      <Dropdown />
      <button className="btn-circle btn h-12 w-12 overflow-hidden rounded-full border-base-300 bg-base-200 p-[2px] transition-all duration-300 sm:h-16 sm:w-16">
        <Image
          className="rounded-full"
          width={256}
          height={256}
          src={displayPicture}
          alt="Default avatar"
        />
      </button>
    </header>
  );
}
