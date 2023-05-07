import Image from "next/image";
import Dropdown from "./Dropdown";

export default function NavBar() {
  return (
    <div className="flex justify-between px-4 pt-4 transition-all duration-300">
      <div className="h-12 w-12">
        <Image
          src="/images/memopup.png"
          width={256}
          height={256}
          alt="Memopup Logo"
        />
      </div>
      <Dropdown />
      <div className="h-12 w-12">
        <Image
          width={48}
          height={48}
          src={"/icons/avatar.svg"}
          alt="Default avatar"
        />
      </div>
    </div>
  );
}
