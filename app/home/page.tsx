"use client";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const PAIRS = [
  ["Merge clean,", "Sleep well"],
  ["Catch bugs,", "Before they catch you"],
  ["Any PR,", "Senior reviewed"],
  ["Less review time,", "More confidence"],
];

export default function Home() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [pairIndex, setPairIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const pair = PAIRS[pairIndex];

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeText = async (text: string, setter: (v: string) => void) => {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await sleep(80);
      }
    };

    const deleteText = async (text: string, setter: (v: string) => void) => {
      for (let i = text.length; i >= 0; i--) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await sleep(40);
      }
    };

    const run = async () => {
      // Type line 1
      await typeText(pair[0], setLine1);
      await sleep(300);

      // Type line 2
      await typeText(pair[1], setLine2);
      await sleep(2000);

      // Delete line 2 first
      await deleteText(pair[1], setLine2);
      await sleep(100);

      // Delete line 1
      await deleteText(pair[0], setLine1);
      await sleep(300);

      // Move to next pair
      if (!cancelled) {
        setPairIndex((prev) => (prev + 1) % PAIRS.length);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pairIndex]);

  // Blinking cursor
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursor);
  }, []);

  return (
    <div className="hero-section flex h-[calc(100vh-7vh)] px-18 bg-black">
      <div className="leftSignInPart h-full w-1/2 flex justify-center items-center">
        <div>
          <div>
            <h1 className="text-4xl text-[#cc7bf4] font-bold">
              {/* Line 1 */}
              <span>{line1}</span>
              {/* Cursor only on line 1 if line 2 is empty */}
              {line2 === "" && (
                <span className={showCursor ? "opacity-100" : "opacity-0"}>
                  |
                </span>
              )}
              <br />
              {/* Line 2 */}
              <span>{line2}</span>
              {/* Cursor on line 2 when it's typing */}
              {line2 !== "" && (
                <span className={showCursor ? "opacity-100" : "opacity-0"}>
                  |
                </span>
              )}
            </h1>
            <h2 className="text-[#faf9f5] text-xl mt-4">
              Any PR. Any repo. Reviewed in seconds.
            </h2>
          </div>
          {/* <div className="border-[0.5px] not-odd mt-4 p-4 border-zinc-700 dummyButton"> */}
          <button
            className="bg-[#faf9f5] cursor-pointer mt-4 flex py-2 px-3 gap-1 text-lg items-center rounded-lg"
            onClick={() => {
              signIn();
            }}
          >
            Login with Github
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              transform="rotate(0 0 0)"
            >
              <path
                d="M12 2.24902C6.51613 2.24902 2 6.70064 2 12.249C2 16.6361 4.87097 20.3781 8.87097 21.7329C9.3871 21.8297 9.54839 21.5071 9.54839 21.2813C9.54839 21.0555 9.54839 20.4103 9.51613 19.5393C6.74194 20.1845 6.16129 18.1845 6.16129 18.1845C5.70968 17.0555 5.03226 16.7329 5.03226 16.7329C4.12903 16.0877 5.06452 16.0877 5.06452 16.0877C6.06452 16.12 6.6129 17.12 6.6129 17.12C7.48387 18.6684 8.96774 18.2168 9.51613 17.9264C9.6129 17.2813 9.87097 16.8297 10.1613 16.5716C7.96774 16.3458 5.6129 15.4748 5.6129 11.6684C5.6129 10.5716 6.03226 9.70064 6.64516 9.02322C6.54839 8.79741 6.19355 7.76515 6.74194 6.37806C6.74194 6.37806 7.6129 6.11999 9.51613 7.41031C10.3226 7.18451 11.1613 7.05548 12.0323 7.05548C12.9032 7.05548 13.7742 7.15225 14.5484 7.41031C16.4516 6.15225 17.2903 6.37806 17.2903 6.37806C17.8387 7.73289 17.5161 8.79741 17.3871 9.02322C18.0323 9.70064 18.4194 10.6039 18.4194 11.6684C18.4194 15.4748 16.0645 16.3458 13.871 16.5716C14.2258 16.8942 14.5484 17.5393 14.5484 18.4426C14.5484 19.7974 14.5161 20.8619 14.5161 21.1845C14.5161 21.4426 14.7097 21.7329 15.1935 21.6361C19.129 20.3135 22 16.6039 22 12.1845C21.9677 6.70064 17.4839 2.24902 12 2.24902Z"
                fill="#343C54"
              />
            </svg>
          </button>
          {/* </div> */}
        </div>
      </div>
      <div className="rightVideoSection pr-2 ml-20 py-14  h-full w-1/2">
        <div className="w-full h-full bg-zinc-900 flex flex-col rounded-2xl">
          <span className="text-[#cc7bf4] text-center text-xl p-3 mx-auto mt-8 rounded-2xl  border border-zinc-500">
            How to Use?
          </span>
        </div>
      </div>
    </div>
  );
}
