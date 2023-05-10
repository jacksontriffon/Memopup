import Image from "next/image";
import Dropdown from "./Dropdown";

export default function NavBar() {
  return (
    <header className="flex justify-between px-4 pt-4 transition-all duration-300 @container">
      <div className="h-12 w-12 @xs:h-16 @xs:w-16">
        <Image
          src="/images/memopup.png"
          width={256}
          height={256}
          alt="Memopup Logo"
        />
      </div>
      <Dropdown />
      <div className="h-12 w-12 @xs:h-16 @xs:w-16">
        <Image
          width={48}
          height={48}
          src={"/icons/avatar.svg"}
          alt="Default avatar"
        />
      </div>
    </header>
  );
}
