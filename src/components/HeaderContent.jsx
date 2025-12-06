"use client";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { openSignUpModal } from "@/features/ui/uiSlice";
import { MdLogout, MdPersonAdd } from "react-icons/md";

export default function HeaderContent({ session, dispatch }) {
  return (
    <div className="flex items-center gap-3">
      {session ? (
        <>
          <span className="text-sm text-gray-300 hidden sm:inline">
            Olá, {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Fazer logout"
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-2 transition"
          >
            <MdLogout className="w-4 h-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => dispatch(openSignUpModal())}
          aria-label="Abrir cadastro"
          className="text-green-400 hover:text-green-300 flex items-center gap-2 transition"
        >
          <MdPersonAdd className="w-4 h-4" aria-hidden="true" />
          <span>Cadastrar</span>
        </button>
      )}
    </div>
  );
}
