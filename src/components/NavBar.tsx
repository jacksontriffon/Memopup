import Image from "next/image";
import Dropdown from "./Dropdown";
import { useSession } from "next-auth/react";
import MemopupButton from "./Memopup/MemopupButton";

export default function NavBar() {
  const { data: sessionData } = useSession();
  const displayPicture: string = sessionData?.user.image
    ? sessionData.user.image
    : "/icons/avatar.svg";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-t from-transparent to-base-100 to-50% px-4 pb-14 pt-4 transition-all duration-300 @container">
      <MemopupButton />
      <Dropdown />
      <label
        htmlFor="menu"
        className="drawer-button btn-circle btn h-12 w-12 overflow-hidden rounded-full border-base-300 bg-base-200 p-[2px] transition-all duration-300 sm:h-16 sm:w-16"
      >
        <Image
          className="rounded-full"
          width={256}
          height={256}
          src={displayPicture}
          alt="Default avatar"
        />
      </label>
    </header>
  );
}
