"use client";
import { signIn, signOut, useSession } from "next-auth/react";
// rgb(204, 123, 244)
export default function Navauth() {
  const session = useSession();
  console.log(session);
  return (
    <>
      {session.status === "authenticated" && (
        <>
          {/* <p className="text-white">Welcome, {session!.data!.user!.name}</p> */}
          <div className="flex gap-2">
            <button
              className=" cursor-pointer text-white transition-colors border px-4 py-1 rounded-lg flex items-center hover:text-[#cc7bf4]"
              onClick={() => signOut()}
            >
              Logout
            </button>
            <img
              alt="UserImage"
              className="rounded-full"
              src={session!.data!.user!.image}
              width={32}
              height={32}
            />
          </div>
        </>
      )}

      {session.status !== "authenticated" && (
        <button
          className=" cursor-pointer text-white border px-4 py-1 rounded-lg transition-colors hover:text-[#cc7bf4]"
          onClick={() => signIn("github")}
        >
          Login
        </button>
      )}
    </>
  );
}
