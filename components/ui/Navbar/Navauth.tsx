"use client";
import { Button } from "@/components/ui/button";
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
            <Button
              variant="outline"
              className=" cursor-pointer text-white transition-colors flex items-center hover:text-[#cc7bf4]"
              onClick={() => signOut()}
            >
              Logout
            </Button>
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
        <Button
          variant="outline"
          className=" cursor-pointer text-white transition-colors hover:text-[#cc7bf4]"
          onClick={() => signIn("github")}
        >
          Login
        </Button>
      )}
    </>
  );
}
