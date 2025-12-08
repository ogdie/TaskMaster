"use client";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { Box, Container, Spinner, Text, VStack } from "@chakra-ui/react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

// Lazy load components
const TaskList = lazy(() => import("@/components/TaskList"));
const SignUpModal = lazy(() => import("@/components/SignUpModal"));

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="calc(100vh - 80px)"
    >
      <VStack spacing={4}>
        <Spinner
          size="xl"
          color="brand.400"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
        />
        <Text color="brand.400" fontSize="lg" fontWeight="semibold">
          Carregando tarefas...
        </Text>
      </VStack>
    </Box>
  );
}

function ModalLoadingSpinner() {
  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner
        size="xl"
        color="brand.400"
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
      />
    </Box>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const showSignUpModal = useSelector((state) => state.ui.showSignUpModal);

  // Loading state
  if (status === "loading") {
    return (
      <Box as="main" minH="100vh" bgGradient="linear(to-br, black, gray.900, black)">
        <Header />
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box as="main" minH="100vh" bgGradient="linear(to-br, black, gray.900, black)">
      <Header />

      {session ? (
        // Usuário logado - mostra aplicação com lazy loading
        <Container maxW="7xl" px={{ base: 3, sm: 6, lg: 8 }} py={{ base: 4, sm: 8 }}>
          <Suspense fallback={<LoadingSpinner />}>
            <TaskList />
          </Suspense>
        </Container>
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
    </Box>
  );
}
