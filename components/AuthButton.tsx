"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "Usuario"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm hidden sm:block">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
    >
      Login
    </button>
  );
}