"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import { closeSignUpModal } from "@/features/ui/uiSlice";
import { FiX } from "react-icons/fi";
import { MdPersonAdd } from "react-icons/md";
import { setSignupError, clearSignupError, setLoading } from "@/features/auth/authSlice";

export default function SignUpModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const signupError = useSelector((state) => state.auth.signupError);
  const isLoading = useSelector((state) => state.auth.isLoading);

  // Suporte a teclado: Escape para fechar modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeSignUpModal());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(clearSignupError());
    dispatch(setLoading(true));

    try {
      // Criar usuário usando fetch
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        dispatch(setSignupError(signupData.error || "Erro ao criar conta. Tente novamente."));
        dispatch(setLoading(false));
        return;
      }
      
      // Fazer login automaticamente após cadastro
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        dispatch(setSignupError("Conta criada, mas houve erro ao fazer login. Tente fazer login manualmente."));
        dispatch(setLoading(false));
      } else {
        dispatch(closeSignUpModal());
        dispatch(setLoading(false));
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      dispatch(setSignupError("Erro ao criar conta. Tente novamente."));
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center sm:items-center justify-center z-50 p-3 sm:p-4 modal-enter" role="dialog" aria-modal="true" aria-labelledby="signup-title">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative border-2 border-green-400 modal-content-enter">
        <button
          onClick={() => dispatch(closeSignUpModal())}
          aria-label="Fechar modal de cadastro"
          className="absolute top-2 sm:top-4 right-2 sm:right-4 text-green-400 hover:text-green-300 text-2xl font-bold w-8 h-8 flex items-center justify-center transition-fast"
        >
          <FiX className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 id="signup-title" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pr-6 text-green-400">Cadastrar</h2>

        <form onSubmit={handleSignUp} className="space-y-2 sm:space-y-4">
          {signupError && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm" role="alert">
              {signupError}
            </div>
          )}

          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-green-400 mb-2">
              Nome Completo
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Nome completo"
              aria-required="true"
              className="w-full border-2 border-green-400 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-green-400 mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              aria-required="true"
              className="w-full border-2 border-green-400 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-green-400 mb-2">
              Senha
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Senha"
              aria-required="true"
              className="w-full border-2 border-green-400 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 form-input"
              required
              minLength={6}
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 flex-col sm:flex-row">
            <button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? "Cadastrando..." : "Criar nova conta"}
              className="flex-1 bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-400 btn-primary flex items-center justify-center gap-2"
            >
              <MdPersonAdd className="w-5 h-5" aria-hidden="true" />
              <span>{isLoading ? "Cadastrando..." : "Cadastrar"}</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(closeSignUpModal())}
              disabled={isLoading}
              aria-label="Cancelar cadastro"
              className="flex-1 bg-gray-700 text-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-600 transition font-medium disabled:opacity-50 border-2 border-gray-500 btn-primary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}