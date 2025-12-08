"use client";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { openSignUpModal } from "@/features/ui/uiSlice";
import { Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdLogout, MdPersonAdd } from "react-icons/md";

export default function HeaderContent({ session, dispatch }) {
  return (
    <Flex align="center" gap={3}>
      {session ? (
        <>
          <Text
            fontSize="sm"
            color="gray.300"
            display={{ base: "none", sm: "inline" }}
          >
            Olá, {session.user.name || session.user.email}
          </Text>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Fazer logout"
            colorScheme="red"
            size="sm"
            leftIcon={<Icon as={MdLogout} />}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button
          onClick={() => dispatch(openSignUpModal())}
          aria-label="Abrir cadastro"
          variant="ghost"
          colorScheme="green"
          leftIcon={<Icon as={MdPersonAdd} />}
        >
          Cadastrar
        </Button>
      )}
    </Flex>
  );
}
