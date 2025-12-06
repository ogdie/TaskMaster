import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // OAuth existentes
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Login local
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        // Busca usuário pelo email
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Usuário não encontrado");

        // Verifica senha
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Senha incorreta");

        // Retorna usuário autenticado
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Usa nossa página customizada
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user._id?.toString() || user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
    }
    return session;
  },
  async redirect({ baseUrl }) {
    // Sempre redireciona para a página inicial após login
    return baseUrl;
  },
},
};