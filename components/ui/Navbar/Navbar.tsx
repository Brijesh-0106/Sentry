"use client";
import Navauth from "./Navauth";
import Navlinks from "./Navlinks";
// rgb(204, 123, 244)
export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-zinc-900 h-[7vh]">
      <div className="logoSection text-xl items-center gap-1 text-[#cc7bf4] flex pl-8 font-bold">
        <svg
          width="28"
          stroke="#cc7bf4"
          height="28"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="18"
            r="12"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="82"
            r="12"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="5"
          />
          <circle
            cx="72"
            cy="42"
            r="12"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="5"
          />
          <path
            d="M25 30 L25 70"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M25 30 Q25 42 60 42"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M58 34 L68 42 L58 50"
            fill="none"
            stroke="#cc7bf4"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Sentry
      </div>
      <div className="flex gap-20">
        <div className="navLinksSection flex items-center gap-12 text-lg text-white">
          <Navlinks />
        </div>
        <Navauth />
      </div>
    </div>
  );
}
