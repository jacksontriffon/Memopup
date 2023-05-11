import Image from "next/image";
import Dropdown from "./Dropdown";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between px-4 pt-4 transition-all duration-300 @container">
      <div className="h-12 w-12 transition-all duration-300 sm:h-16 sm:w-16">
        <Image
          src="/images/memopup.png"
          width={256}
          height={256}
          alt="Memopup Logo"
        />
      </div>
      <Dropdown />
      <div className="h-12 w-12 transition-all duration-300 sm:h-16 sm:w-16">
        <Image
          width={256}
          height={256}
          src={"/icons/avatar.svg"}
          alt="Default avatar"
        />
      </div>
    </header>
  );
}
