"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import { setLoginError, clearLoginError } from "@/features/auth/authSlice";
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Divider,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.loginError);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    dispatch(clearLoginError());
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        dispatch(setLoginError("Email ou senha incorretos"));
      }
    } catch (err) {
      dispatch(setLoginError("Erro ao fazer login. Tente novamente."));
    }
  };

  return (
    <Box
      minH={{ base: "calc(100vh - 60px)", sm: "calc(100vh - 80px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 3, sm: 4 }}
      py={{ base: 4, sm: 8 }}
    >
      <Container maxW="md" w="full">
        <Box
          bgGradient="linear(to-br, gray.900, gray.800)"
          borderRadius="lg"
          shadow="2xl"
          p={{ base: 4, sm: 8 }}
          borderWidth="2px"
          borderColor="brand.600"
        >
          <Heading
            as="h2"
            size={{ base: "lg", sm: "xl" }}
            mb={{ base: 4, sm: 6 }}
            textAlign="center"
            color="brand.400"
          >
            Login
          </Heading>

          <VStack spacing={{ base: 2, sm: 3 }} mb={{ base: 4, sm: 6 }}>
            <Button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              aria-label="Fazer login com GitHub"
              w="full"
              colorScheme="gray"
              variant="outline"
              leftIcon={
                <Icon viewBox="0 0 24 24" boxSize={{ base: 4, sm: 5 }}>
                  <path
                    fill="currentColor"
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </Icon>
              }
            >
              Login com GitHub
            </Button>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              aria-label="Fazer login com Google"
              w="full"
              colorScheme="red"
              leftIcon={
                <Icon viewBox="0 0 24 24" boxSize={{ base: 4, sm: 5 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </Icon>
              }
            >
              Login com Google
            </Button>
          </VStack>

          <HStack mb={{ base: 4, sm: 6 }}>
            <Divider />
            <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.400" px={2}>
              ou
            </Text>
            <Divider />
          </HStack>

          <form onSubmit={handleCredentialsLogin}>
            <VStack spacing={{ base: 2, sm: 4 }}>
              {loginError && (
                <Alert status="error" role="alert" borderRadius="md">
                  <AlertIcon />
                  {loginError}
                </Alert>
              )}
              
              <FormControl isRequired>
                <FormLabel color="brand.400">Email</FormLabel>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel color="brand.400">Senha</FormLabel>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Senha"
                />
              </FormControl>
              
              <Button
                type="submit"
                aria-label="Fazer login com email e senha"
                w="full"
                colorScheme="green"
                size={{ base: "md", sm: "lg" }}
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}