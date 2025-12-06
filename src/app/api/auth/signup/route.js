import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectToDB();
    const { name, email, password } = await req.json();

    // Validar dados
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios" }),
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }),
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Este email já está cadastrado" }),
        { status: 409 }
      );
    }

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return new Response(JSON.stringify({ message: "Usuário criado com sucesso" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar usuário. Tente novamente." }),
      { status: 500 }
    );
  }
}
