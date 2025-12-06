"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import { openSignUpModal } from "@/features/ui/uiSlice";
import dynamic from "next/dynamic";

const HeaderContent = dynamic(() => import("@/components/HeaderContent"), {
  ssr: false,
  loading: () => <div className="h-6" />
});

export default function Header() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <header className="bg-linear-to-r from-black via-gray-900 to-black shadow border-b border-green-400 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-green-400">TaskMaster</h1>
          {mounted && <HeaderContent session={session} dispatch={dispatch} />}
        </div>
      </div>
    </header>
  );
}