import connectToDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { "Content-Type": "application/json" } });

  await connectToDB();
  const tasks = await Task.find({ userId: session.user.id });
  return new Response(JSON.stringify(tasks), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { "Content-Type": "application/json" } });

  await connectToDB();
  const data = await req.json();
  const task = await Task.create({ ...data, userId: session.user.id });
  return new Response(JSON.stringify(task), { status: 201, headers: { "Content-Type": "application/json" } });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { "Content-Type": "application/json" } });

  await connectToDB();
  const data = await req.json();
  const task = await Task.findOneAndUpdate(
    { _id: data._id, userId: session.user.id },
    data,
    { new: true }
  );
  return new Response(JSON.stringify(task), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { "Content-Type": "application/json" } });

  await connectToDB();
  const data = await req.json();
  await Task.findOneAndDelete({ _id: data._id, userId: session.user.id });
  return new Response(JSON.stringify({ message: "Task deleted" }), { status: 200, headers: { "Content-Type": "application/json" } });
}
