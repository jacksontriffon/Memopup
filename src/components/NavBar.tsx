import Image from "next/image";
import React from "react";

export default function NavBar() {
  return (
    <div className="flex justify-between px-4 pt-2 transition-all duration-300">
      <div className="h-10 w-10 bg-neutral">
        <Image
          width={256}
          height={256}
          src="../../public/Memopup.svg"
          alt="Memopup Logo"
        />
      </div>
      <div className="h-10 w-10 rounded-full bg-neutral"></div>
    </div>
  );
}
