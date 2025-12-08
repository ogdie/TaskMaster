"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Box, Heading, Container, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const HeaderContent = dynamic(() => import("@/components/HeaderContent"), {
  ssr: false,
  loading: () => <Box h="24px" />
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
    <Box
      as="header"
      bgGradient="linear(to-r, black, gray.900, black)"
      borderBottomWidth="1px"
      borderBottomColor="brand.600"
      position="sticky"
      top={0}
      zIndex={40}
      shadow="md"
    >
      <Container maxW="7xl" py={3} px={{ base: 3, sm: 6, lg: 8 }}>
        <Flex justify="space-between" align="center">
          <Heading
            as="h1"
            size={{ base: "md", sm: "lg" }}
            color="brand.400"
            fontWeight="bold"
          >
            TaskMaster
          </Heading>
          {mounted && <HeaderContent session={session} dispatch={dispatch} />}
        </Flex>
      </Container>
    </Box>
  );
}