"use client";
import { useDispatch, useSelector } from "react-redux";
import TaskForm from "./TaskForm";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/features/tasks/tasksApi";
import { useSession } from "next-auth/react";
import { openTaskForm } from "@/features/ui/uiSlice";

export default function TaskList() {
  const { data: session } = useSession();
  const { data: tasks, isLoading } = useGetTasksQuery(undefined, { skip: !session });
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useDispatch();
  const showTaskForm = useSelector((state) => state.ui.showTaskForm);

  if (!session) return <p className="text-gray-400">Faça login para ver suas tarefas.</p>;
  if (isLoading) return <p className="text-green-400">Carregando tarefas...</p>;

  const taskList = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(openTaskForm(null))}
          aria-label="Criar nova tarefa"
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <MdAdd className="w-5 h-5" aria-hidden="true" />
          <span>Criar Nova Tarefa</span>
        </button>
      </div>

      {showTaskForm && <TaskForm />}

      {taskList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhuma tarefa encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {taskList.map((task) => (
            <div key={task._id} className="p-3 border rounded bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold ${task.completed ? "line-through text-gray-500" : "text-green-400"}`}>{task.title}</h3>
                  <p className="text-gray-300 text-sm">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(openTaskForm(task))}
                    aria-label={`Editar ${task.title}`}
                    className="bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-2"
                  >
                    <MdEdit className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => { if (confirm(`Deletar \"${task.title}\"?`)) deleteTask(task._id); }}
                    aria-label={`Deletar ${task.title}`}
                    className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-2"
                  >
                    <MdDelete className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Deletar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
