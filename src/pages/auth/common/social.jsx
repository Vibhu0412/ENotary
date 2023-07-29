import React from "react";
// import images
import FaceBook from "@/assets/images/icon/logos_facebook.svg";
import Google from "@/assets/images/icon/flat-color-icons_google.svg";
import Apple from "@/assets/images/icon/ic_baseline-apple.svg";

const Social = () => {
  return (
    <ul className="flex">
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10  text-white text-2xl flex-col items-center justify-center rounded-full"
        >
          <img src={Google} alt="" />
        </a>
      </li>
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10  text-white text-2xl flex-col items-center justify-center rounded-full"
        >
          <img src={FaceBook} alt="" />
        </a>
      </li>
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10  text-white text-2xl flex-col items-center justify-center rounded-full"
        >
          <img src={Apple} alt="" />
        </a>
      </li>
    </ul>
  );
};

export default Social;
