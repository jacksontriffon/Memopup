import Image from "next/image";
import { useState } from "react";

export default function MemopupButton() {
  const defaultMemopupPicture = "/images/memopup.png";
  const talkingMemopupPicture = "/images/memopup_talk.png";
  const [memopupPicture, setMemopupPicture] = useState(defaultMemopupPicture);
  return (
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
  );
}
