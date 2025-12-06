"use client";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

// Lazy load components
const TaskList = lazy(() => import("@/components/TaskList"));
const SignUpModal = lazy(() => import("@/components/SignUpModal"));

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-green-400 text-lg font-semibold">Carregando tarefas...</p>
      </div>
    </div>
  );
}

function ModalLoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const showSignUpModal = useSelector((state) => state.ui.showSignUpModal);

  // Loading state
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black">
        <Header />
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black">
      <Header />

      {session ? (
        // Usuário logado - mostra aplicação com lazy loading
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <TaskList />
          </Suspense>
        </div>
      ) : (
        // Usuário não logado - mostra formulário de login
        <LoginForm />
      )}

      {/* Modal de cadastro - lazy loaded e controlado pelo Redux */}
      {showSignUpModal && (
        <Suspense fallback={<ModalLoadingSpinner />}>
          <SignUpModal />
        </Suspense>
      )}
    </main>
  );
}
