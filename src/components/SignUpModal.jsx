"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import { closeSignUpModal } from "@/features/ui/uiSlice";
import { FiX } from "react-icons/fi";
import { MdPersonAdd } from "react-icons/md";
import { setSignupError, clearSignupError, setLoading } from "@/features/auth/authSlice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";

export default function SignUpModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const signupError = useSelector((state) => state.auth.signupError);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const showSignUpModal = useSelector((state) => state.ui.showSignUpModal);
  const { isOpen, onClose } = useDisclosure({ isOpen: showSignUpModal });

  // Suporte a teclado: Escape para fechar modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showSignUpModal) {
        dispatch(closeSignUpModal());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, showSignUpModal]);

  const handleClose = () => {
    dispatch(closeSignUpModal());
  };

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
    <Modal
      isOpen={showSignUpModal}
      onClose={handleClose}
      size="md"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader id="signup-title" color="brand.400">
          Cadastrar
        </ModalHeader>
        <ModalCloseButton color="brand.400" _hover={{ color: "brand.300" }} />

        <ModalBody pb={6}>
          <form onSubmit={handleSignUp}>
            <VStack spacing={4}>
              {signupError && (
                <Alert status="error" role="alert" borderRadius="md" w="full">
                  <AlertIcon />
                  {signupError}
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel color="brand.400">Nome Completo</FormLabel>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nome completo"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="brand.400">Email</FormLabel>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="brand.400">Senha</FormLabel>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Senha"
                  minLength={6}
                />
              </FormControl>

              <HStack w="full" spacing={3} pt={2} flexDirection={{ base: "column", sm: "row" }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  aria-label={isLoading ? "Cadastrando..." : "Criar nova conta"}
                  colorScheme="green"
                  flex={1}
                  leftIcon={<Icon as={MdPersonAdd} />}
                  isLoading={isLoading}
                  loadingText="Cadastrando..."
                >
                  Cadastrar
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  aria-label="Cancelar cadastro"
                  colorScheme="gray"
                  flex={1}
                >
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}